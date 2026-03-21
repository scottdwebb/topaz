# Topaz Administrative Solutions Website

Marketing and service website for **Topaz Administrative Solutions** — featuring a responsive landing page and three service detail pages (Small Business Plans, IT Consulting, Virtual Assistant).

Built with semantic HTML5, custom CSS (design system driven by CSS custom properties), and vanilla JavaScript. Typography uses **Playfair Display** (serif headings) and **Source Sans 3** (body), with a teal + gold luxury palette.

---

## Features

- WCAG 2.1-aware navigation — skip links, keyboard-friendly dropdowns, mobile off-canvas menu, focus management
- Light / dark theme toggle with `prefers-reduced-motion` support and ARIA live announcements
- Scroll-into-view animations (IntersectionObserver, `data-animate` + `.is-in-view`)
- Responsive hero with background video, timed overlay reveal, and CTA
- Puzzle-based "Our Process" animation on each service detail page
- Contact form with client-side validation, inline error states, and success feedback
- Breadcrumb navigation and active nav state on each service page

---

## Tech Stack

| Layer      | Detail                                                  |
| ---------- | ------------------------------------------------------- |
| HTML       | Semantic HTML5, ARIA roles & landmarks                  |
| CSS        | Custom design system (`main.css`, `process-puzzle.css`) |
| JavaScript | Vanilla ES modules (`js/main.js`, `puzzle.js`)          |
| Fonts      | Google Fonts — Playfair Display, Source Sans 3          |
| Icons      | Font Awesome 6 (kit)                                    |
| Tooling    | Prettier (code formatting)                              |

---

## Project Structure

```text
topaz-site/
├── index.html
├── small-bus-plan.html
├── it-consult.html
├── virtual-assist.html
├── assets/
│   ├── favicon/
│   ├── images/
│   │   └── puzzle/
│   └── video/
├── css/
│   ├── main.css
│   └── process-puzzle.css
├── js/
│   └── main.js
│   └── puzzle.js
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
└── README.md
```
