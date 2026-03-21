// ========================================================================
// Topaz Main Script
// WCAG-Compliant Navigation, Titles, Theme, Header, Forms, Animations
// Shared by index.html and all service-detail pages
// ========================================================================

// ------------------------------------------------------------------------
// Global Application State
// ------------------------------------------------------------------------

const AppState = {
  currentPage: "home", // used only on index.html
  theme: localStorage.getItem("theme") || "light",
  headerVisible: false,
  mobileMenuOpen: false,
};

// Detect if we are on index.html (no body id) or a service-detail page
const isHomeShell = !document.body.id;

// ------------------------------------------------------------------------
// Theme Management
// ------------------------------------------------------------------------

/**
 * Apply the current theme to <html> and update UI icons.
 */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", AppState.theme);
  updateThemeIcons();
}

/**
 * Toggle between light and dark themes, persist to localStorage,
 * and announce the change for screen readers.
 */
function toggleTheme() {
  AppState.theme = AppState.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", AppState.theme);
  localStorage.setItem("theme", AppState.theme);
  updateThemeIcons();
  announce(`${AppState.theme} theme activated`);
}

/**
 * Update theme toggle icons in desktop and mobile headers.
 */
function updateThemeIcons() {
  const icons = [
    document.getElementById("themeIcon"),
    document.getElementById("themeIconMobile"),
  ];
  icons.forEach((icon) => {
    if (!icon) return;
    icon.className =
      AppState.theme === "light"
        ? "fas fa-moon theme-toggle__icon"
        : "fas fa-sun theme-toggle__icon";
  });
}

// ------------------------------------------------------------------------
// Accessibility Announcer (ARIA live region helper)
// ------------------------------------------------------------------------

/**
 * Announce a short message via #announcer aria-live region.
 */
function announce(message) {
  const announcer = document.getElementById("announcer");
  if (!announcer) return;
  announcer.textContent = "";
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// ------------------------------------------------------------------------
// Utility: header offset, focusable elements, focus trap
// ------------------------------------------------------------------------

/**
 * Get the current header height (for offset scroll calculations).
 */
function getHeaderOffset() {
  const header = document.querySelector(".header");
  return header ? header.offsetHeight : 0;
}

/**
 * Return all focusable elements inside a given container.
 */
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      [
        "a[href]:not([tabindex='-1'])",
        "button:not([disabled]):not([tabindex='-1'])",
        "input:not([disabled]):not([tabindex='-1'])",
        "select:not([disabled]):not([tabindex='-1'])",
        "textarea:not([disabled]):not([tabindex='-1'])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(","),
    ),
  );
}

/**
 * Trap focus inside an element (e.g., mobile menu).
 * Returns a cleanup function to remove the listener.
 */
function trapFocusIn(element, releaseCallback) {
  const focusable = getFocusableElements(element);
  if (!focusable.length) return null;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleKeydown(e) {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (typeof releaseCallback === "function") releaseCallback();
    }
  }

  element.addEventListener("keydown", handleKeydown);
  return () => element.removeEventListener("keydown", handleKeydown);
}

// ========================================================================
// Navigation & Browser Titles (Index + Service Detail Pages)
// ========================================================================

// Views on index.html (single-page sections)
const HOME_VIEWS = {
  home: { title: "Topaz Administrative Solutions | Thinking. Solution." },
  services: {
    title: "Our Services | Topaz Administrative Solutions",
    scrollTo: "services",
  },
  about: {
    title: "About Us | Topaz Administrative Solutions",
    scrollTo: "about",
  },
  contact: {
    title: "Contact Us | Topaz Administrative Solutions",
    scrollTo: "contact",
  },
};

// Service-detail pages metadata (physical HTML files)
const SERVICE_PAGES = {
  "business-plans": {
    filename: "small-bus-plan.html",
    id: "service-business-plans",
    title: "Small Business Plans | Topaz Administrative Solutions",
  },
  "it-consulting": {
    filename: "it-consult.html",
    id: "service-it-consulting",
    title: "IT Consulting | Topaz Administrative Solutions",
  },
  "virtual-assistant": {
    filename: "virtual-assist.html",
    id: "service-virtual-assistant",
    title: "Virtual Assistant | Topaz Administrative Solutions",
  },
};

// Map body ids to breadcrumb labels (service-detail pages)
const SERVICE_BREADCRUMBS = {
  "service-business-plans": {
    label: "Small Business Plans",
    href: "small-bus-plan.html",
  },
  "service-it-consulting": { label: "IT Consulting", href: "it-consult.html" },
  "service-virtual-assistant": {
    label: "Virtual Assistant",
    href: "virtual-assist.html",
  },
};

// --------------------------- Index navigation ---------------------------

/**
 * Navigate between views on index.html (home/services/about/contact).
 * Updates document title, scrolls to section, and updates active nav links.
 */
function navigateOnHome(pageKey) {
  if (!isHomeShell) return;

  const view = HOME_VIEWS[pageKey] || HOME_VIEWS.home;
  document.title = view.title;

  if (view.scrollTo) {
    // Scroll to the target section with header offset applied
    setTimeout(() => {
      const section = document.getElementById(view.scrollTo);
      if (!section) return;
      const headerHeight = getHeaderOffset();
      const targetPosition =
        section.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }, 100);
  } else {
    // Home: scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Update nav + state for scrollspy
  updateActiveNavLinks(pageKey);
  AppState.currentPage = pageKey;

  // On explicit navigateOnHome, reset headerVisible and let scroll logic control it
  AppState.headerVisible = false;
  updateHeader();

  announce(`Navigated to ${view.title}`);
}

/**
 * Update active classes in desktop and mobile nav for the given pageKey.
 */
function updateActiveNavLinks(pageKey) {
  if (!isHomeShell) return;

  document
    .querySelectorAll(".nav__link, .off-canvas-menu__link")
    .forEach((link) => {
      link.classList.remove(
        "nav__link--active",
        "off-canvas-menu__link--active",
      );
    });

  const activeHash = `#${pageKey}`;

  document
    .querySelectorAll(
      `[href="index.html${activeHash}"], [href="${activeHash}"]`,
    )
    .forEach((link) => {
      if (link.classList.contains("nav__link")) {
        link.classList.add("nav__link--active");
      } else if (link.classList.contains("off-canvas-menu__link")) {
        link.classList.add("off-canvas-menu__link--active");
      }
    });

  // When on "services" view, mark Services root as active as well
  if (pageKey === "services") {
    document
      .querySelectorAll(
        ".nav__link--services-root, .off-canvas-menu__link--services-root",
      )
      .forEach((el) =>
        el.classList.add(
          el.classList.contains("nav__link--services-root")
            ? "nav__link--active"
            : "off-canvas-menu__link--active",
        ),
      );
  }
}

// ------------------------------------------------------------------------
// Scrollspy: update active nav + title while scrolling on index.html
// ------------------------------------------------------------------------

const SCROLLSPY_SECTIONS = ["home", "services", "about", "contact"];

/**
 * Get the absolute top position of a section, adjusted for header height.
 */
function getSectionTop(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  const headerHeight = getHeaderOffset();
  return el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
}

/**
 * Scrollspy handler: determine which section is in view and update
 * AppState.currentPage, document.title, and active nav links.
 */
function scrollSpyHandler() {
  if (!isHomeShell) return;

  const scrollY = window.pageYOffset + getHeaderOffset() + 80;
  let currentKey = "home";

  // Walk from bottom up so later sections win when overlapping
  for (let i = SCROLLSPY_SECTIONS.length - 1; i >= 0; i--) {
    const id = SCROLLSPY_SECTIONS[i];
    const top = getSectionTop(id);
    if (top !== null && scrollY >= top) {
      currentKey = id;
      break;
    }
  }

  if (AppState.currentPage !== currentKey) {
    AppState.currentPage = currentKey;
    const view = HOME_VIEWS[currentKey] || HOME_VIEWS.home;
    document.title = view.title;
    updateActiveNavLinks(currentKey);
  }
}

// --------------------------- Service pages ------------------------------

/**
 * On service-detail pages, ensure title/nav state matches current service.
 */
function highlightServiceOnDetailPage() {
  if (isHomeShell) return;

  const bodyId = document.body.id;
  const matchEntry = Object.entries(SERVICE_PAGES).find(
    ([, cfg]) => cfg.id === bodyId,
  );
  if (!matchEntry) return;

  const [serviceKey, cfg] = matchEntry;

  // Enforce correct document title
  if (document.title !== cfg.title) {
    document.title = cfg.title;
  }

  // Mark Services root active in desktop and mobile nav
  document
    .querySelectorAll(
      ".nav__link--services-root, .off-canvas-menu__link--services-root",
    )
    .forEach((el) =>
      el.classList.add(
        el.classList.contains("nav__link--services-root")
          ? "nav__link--active"
          : "off-canvas-menu__link--active",
      ),
    );

  // Highlight active service submenu items (desktop dropdown + mobile submenu)
  document
    .querySelectorAll(`.nav__dropdown-link[data-service="${serviceKey}"]`)
    .forEach((link) => link.classList.add("nav__dropdown-link--active"));

  document
    .querySelectorAll(`.off-canvas-menu__sublink[data-service="${serviceKey}"]`)
    .forEach((link) => link.classList.add("off-canvas-menu__sublink--active"));
}

// ------------------------------------------------------------------------
// Service detail breadcrumb generator
// ------------------------------------------------------------------------

/**
 * Build breadcrumb trail on service-detail pages from SERVICE_BREADCRUMBS
 * and update the hero title to match the service label.
 */
function initServiceBreadcrumb() {
  if (isHomeShell) return;

  const bodyId = document.body.id;
  const cfg = SERVICE_BREADCRUMBS[bodyId];
  if (!cfg) return;

  const list = document.getElementById("breadcrumbList");
  if (!list) return;

  // Clear any fallback content
  list.innerHTML = "";

  // 1. Home
  const homeItem = document.createElement("li");
  homeItem.className = "breadcrumb__item";
  homeItem.innerHTML = `
    <a href="index.html#home" class="breadcrumb__link">Home</a>
    <span class="breadcrumb__separator">/</span>
  `;
  list.appendChild(homeItem);

  // 2. Services
  const servicesItem = document.createElement("li");
  servicesItem.className = "breadcrumb__item";
  servicesItem.innerHTML = `
    <a href="index.html#services" class="breadcrumb__link">Services</a>
    <span class="breadcrumb__separator">/</span>
  `;
  list.appendChild(servicesItem);

  // 3. Current page (no link, aria-current)
  const currentItem = document.createElement("li");
  currentItem.className = "breadcrumb__item";
  currentItem.setAttribute("aria-current", "page");
  currentItem.innerHTML = `
    <span class="breadcrumb__current">${cfg.label}</span>
  `;
  list.appendChild(currentItem);

  // Update hero title text to match breadcrumb label
  const titleEl = document.getElementById("service-hero-title");
  if (titleEl) {
    titleEl.textContent = cfg.label;
  }
}

// ========================================================================
// WCAG Navigation: Skip Links, Desktop Dropdown, Mobile Menu
// ========================================================================

/**
 * Enhance skip links so they also move keyboard focus to the target.
 */
function initSkipLinks() {
  document.querySelectorAll(".skip-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href")?.replace("#", "");
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      // Allow normal jump, then move focus for screen readers
      setTimeout(() => {
        target.setAttribute("tabindex", "-1");
        target.focus();
      }, 0);
    });
  });
}

/**
 * Accessible “Services” dropdown in the desktop nav.
 */
function initDesktopDropdown() {
  const servicesItem = document.querySelector(".nav__item--has-dropdown");
  if (!servicesItem) return;

  const toggle = servicesItem.querySelector(".nav__link--toggle");
  const menu = servicesItem.querySelector(".nav__dropdown");

  function openDropdown() {
    servicesItem.classList.add("nav__item--open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeDropdown() {
    servicesItem.classList.remove("nav__item--open");
    toggle.setAttribute("aria-expanded", "false");
  }

  // Mouse click
  toggle.addEventListener("click", () => {
    const isOpen = servicesItem.classList.contains("nav__item--open");
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
      const firstItem = menu?.querySelector(".nav__dropdown-link");
      firstItem?.focus();
    }
  });

  // Keyboard on toggle (Enter/Space/ArrowDown open, Esc close)
  toggle.addEventListener("keydown", (e) => {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      openDropdown();
      const firstItem = menu?.querySelector(".nav__dropdown-link");
      firstItem?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
    }
  });

  // Keyboard inside dropdown
  menu?.addEventListener("keydown", (e) => {
    const items = Array.from(menu.querySelectorAll(".nav__dropdown-link"));
    const currentIndex = items.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(currentIndex + 1) % items.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
      toggle.focus();
    }
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!servicesItem.contains(e.target)) {
      closeDropdown();
    }
  });
}

/**
 * Accessible off-canvas mobile navigation with focus trap and overlay.
 */
function initMobileMenu() {
  const overlay = document.querySelector(".overlay");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const mobileClose = mobileMenu?.querySelector(".off-canvas-menu__close");

  let releaseTrap = null;

  function openMenu() {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.hidden = false;
    mobileMenu.classList.add("off-canvas-menu--active");
    overlay?.classList.add("overlay--active");
    mobileToggle.setAttribute("aria-expanded", "true");
    AppState.mobileMenuOpen = true;
    document.body.style.overflow = "hidden";

    releaseTrap = trapFocusIn(mobileMenu, closeMenu);
    const firstFocusable = getFocusableElements(mobileMenu)[0];
    firstFocusable?.focus();
    announce("Mobile menu opened");
  }

  function closeMenu() {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.hidden = true;
    mobileMenu.classList.remove("off-canvas-menu--active");
    overlay?.classList.remove("overlay--active");
    mobileToggle.setAttribute("aria-expanded", "false");
    AppState.mobileMenuOpen = false;
    document.body.style.overflow = "";
    if (releaseTrap) {
      releaseTrap();
      releaseTrap = null;
    }
    mobileToggle.focus();
    announce("Mobile menu closed");
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      if (mobileMenu.hidden) openMenu();
      else closeMenu();
    });
    mobileClose?.addEventListener("click", closeMenu);
    overlay?.addEventListener("click", closeMenu);
  }

  // Global Esc closes mobile menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && AppState.mobileMenuOpen) {
      e.preventDefault();
      closeMenu();
    }
  });

  // Mobile services submenu expand/collapse
  const mobileServicesItem = document.querySelector(
    ".off-canvas-menu__item--has-children",
  );
  if (mobileServicesItem) {
    const toggleBtn = mobileServicesItem.querySelector(
      ".off-canvas-menu__link--toggle",
    );
    toggleBtn.addEventListener("click", () => {
      const isOpen = mobileServicesItem.classList.toggle(
        "off-canvas-menu__item--open",
      );
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Close mobile menu when nav links inside it are used
  document.querySelectorAll(".off-canvas-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileMenu.hidden) closeMenu();
    });
  });
}

// ------------------------------------------------------------------------
// Scroll-into-view animations (services, process, about, etc.)
// ------------------------------------------------------------------------

/**
 * Use IntersectionObserver to add .is-in-view to elements with [data-animate]
 * when they scroll into view, with reduced-motion support.
 */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll("[data-animate]");
  if (!animatedEls.length) return;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  if (prefersReducedMotion.matches) {
    animatedEls.forEach((el) => el.classList.add("is-in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in-view");
        obs.unobserve(entry.target);
      });
    },
    { root: null, threshold: 0.2 },
  );

  animatedEls.forEach((el) => observer.observe(el));
}

// ------------------------------------------------------------------------
// Nav-link click handling (hash scrolling on index, normal on services)
// ------------------------------------------------------------------------

/**
 * Handle clicks on [data-nav-link] anchors.
 * On index, hijack hash navigation to use navigateOnHome.
 * On service pages, let links behave normally.
 */
function initNavLinks() {
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";

      if (isHomeShell && href.includes("#")) {
        const hashIndex = href.indexOf("#");
        const pageKey = href.slice(hashIndex + 1) || "home";

        if (HOME_VIEWS[pageKey]) {
          e.preventDefault();
          navigateOnHome(pageKey);
          history.pushState(null, "", `#${pageKey}`);
        }
      }
      // On service pages, normal navigation occurs.
    });
  });
}

// ========================================================================
// Header Visibility Management
// ========================================================================

/**
 * Show/hide header based on scroll past hero or explicit AppState flag.
 */
function updateHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const currentScroll = window.pageYOffset;
  const heroSection = document.querySelector(".hero");
  const heroHeight = heroSection ? heroSection.offsetHeight : 0;

  // Show header if scrolled past hero or CTA has been clicked
  if (currentScroll > heroHeight - 100 || AppState.headerVisible) {
    header.classList.add("header--visible");
  } else {
    header.classList.remove("header--visible");
  }

  if (currentScroll > 50) {
    header.classList.add("header--scrolled");
  } else {
    header.classList.remove("header--scrolled");
  }
}

// ========================================================================
// Hero Video & CTA Management (index hero only)
// ========================================================================

/**
 * Handle hero video end + CTA reveal and header visibility on CTA click.
 */
function initHero() {
  const heroVideo = document.querySelector(".hero__video");
  const heroActions = document.querySelector(".hero__actions");
  const heroTitle = document.querySelector(".hero__title");
  const heroSubtitle = document.querySelector(".hero__subtitle");
  const heroOverlay = document.querySelector(".hero__overlay");

  if (!heroVideo || !heroActions || !heroTitle || !heroSubtitle || !heroOverlay)
    return;

  // On video end, reveal overlay + text + CTA
  heroVideo.addEventListener("ended", () => {
    heroActions.classList.add("hero__actions--visible");
    heroTitle.classList.add("hero__title--visible");
    heroSubtitle.classList.add("hero__subtitle--visible");
    heroOverlay.classList.add("hero__overlay--visible");
  });

  // Fallback: show CTA + text after 10 seconds if video hasn't ended
  setTimeout(() => {
    if (
      !heroActions.classList.contains("hero__actions--visible") &&
      !heroTitle.classList.contains("hero__title--visible") &&
      !heroSubtitle.classList.contains("hero__subtitle--visible") &&
      !heroOverlay.classList.contains("hero__overlay--visible")
    ) {
      heroActions.classList.add("hero__actions--visible");
      heroTitle.classList.add("hero__title--visible");
      heroSubtitle.classList.add("hero__subtitle--visible");
      heroOverlay.classList.add("hero__overlay--visible");
    }
  }, 16000);

  // When CTA clicked, keep header visible going forward
  heroActions.addEventListener("click", () => {
    AppState.headerVisible = true;
    updateHeader();
  });
}

// ========================================================================
// Contact Form Validation & Submission
// ========================================================================

/**
 * Client-side validation and simulated async submission for contact form.
 */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear previous errors
    contactForm
      .querySelectorAll(".form-group")
      .forEach((group) => group.classList.remove("form-group--error"));

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");

    let isValid = true;

    if (!name.value.trim()) {
      name.closest(".form-group").classList.add("form-group--error");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.closest(".form-group").classList.add("form-group--error");
      isValid = false;
    }

    if (phone.value && !/^[\d\s\-+\()]+$/.test(phone.value)) {
      phone.closest(".form-group").classList.add("form-group--error");
      isValid = false;
    }

    if (!message.value.trim()) {
      message.closest(".form-group").classList.add("form-group--error");
      isValid = false;
    }

    if (!isValid) {
      announce("Please correct the errors in the form");
      const firstError = contactForm.querySelector(
        ".form-group--error input, .form-group--error textarea",
      );
      if (firstError) firstError.focus();
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    // Simulated async submit
    setTimeout(() => {
      contactForm.style.display = "none";
      formSuccess.classList.add("form-success--visible");
      announce("Message sent successfully");

      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = "block";
        formSuccess.classList.remove("form-success--visible");
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }, 5000);
    }, 1500);
  });

  // Real-time validation on blur
  contactForm.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => {
      const formGroup = input.closest(".form-group");

      if (input.hasAttribute("required") && !input.value.trim()) {
        formGroup.classList.add("form-group--error");
      } else if (input.type === "email" && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          formGroup.classList.add("form-group--error");
        } else {
          formGroup.classList.remove("form-group--error");
        }
      } else {
        formGroup.classList.remove("form-group--error");
      }
    });
  });
}

// ========================================================================
// Initialization (DOM Ready)
// ========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Theme
  applyTheme();
  document
    .getElementById("themeToggle")
    ?.addEventListener("click", toggleTheme);
  document
    .getElementById("themeToggleMobile")
    ?.addEventListener("click", toggleTheme);

  // Header behavior
  updateHeader();
  window.addEventListener("scroll", updateHeader);

  // Navigation
  initSkipLinks();
  initDesktopDropdown();
  initMobileMenu();
  initNavLinks();

  // Page-type specific setup
  if (isHomeShell) {
    // Index: deep-link to appropriate section (hash or default home)
    const initialHash = window.location.hash.replace("#", "") || "home";
    navigateOnHome(initialHash);

    // Scrollspy for index sections
    window.addEventListener("scroll", scrollSpyHandler);

    // Service CTA buttons on index (cards/buttons with data-service)
    document.querySelectorAll("[data-service]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.getAttribute("data-service");
        const cfg = SERVICE_PAGES[key];
        if (!cfg) return;
        window.location.href = cfg.filename;
      });
    });

    // Handle browser back/forward for hash navigation
    window.addEventListener("popstate", () => {
      const hash = window.location.hash.replace("#", "") || "home";
      navigateOnHome(hash);
    });
  } else {
    // Service-detail pages
    highlightServiceOnDetailPage();
    initServiceBreadcrumb();
  }

  // Hero, scroll animations, forms (used on home and contact)
  initHero();
  initScrollAnimations();
  initContactForm();
});
