// ========================================================================
// Topaz Bulb Puzzle Animation Script (Shared by Service Detail Pages)
// ========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Get puzzle pieces
  const piece1 = document.querySelector('[data-piece="1"]');
  const piece2 = document.querySelector('[data-piece="2"]');
  const piece3 = document.querySelector('[data-piece="3"]');
  const piece4 = document.querySelector('[data-piece="4"]');
  const piece5 = document.querySelector('[data-piece="5"]');
  const piece6 = document.querySelector('[data-piece="6"]');

  function getConnectOffset() {
    return getComputedStyle(document.documentElement).getPropertyValue("--connect-offset").trim();
  }

  function animatePuzzle() {
    // Top-left puzzle piece
    setTimeout(() => {
      piece1.style.transform = "translateX(0)";
      piece1.classList.add("visible");
    }, 500);

    // Top-right puzzle piece
    setTimeout(() => {
      piece2.style.transform = "translateX(0)";
      piece2.classList.add("visible");
    }, 1500);

    // Bottom-left puzzle piece
    setTimeout(() => {
      piece3.style.transform = "translateX(0)";
      piece3.classList.add("visible");
    }, 2500);

    // Bottom-right puzzle piece
    setTimeout(() => {
      piece4.style.transform = "translateX(0)";
      piece4.classList.add("visible");
    }, 3500);

    // Connecting top and bottom puzzle pieces
    setTimeout(() => {
      const offset = getConnectOffset();
      piece1.style.transform = `translate(0, ${offset})`;
      piece2.style.transform = `translate(0, ${offset})`;
      piece3.style.transform = `translate(0, -${offset})`;
      piece4.style.transform = `translate(0, -${offset})`;
    }, 4500);

    // Top-thread puzzle piece
    setTimeout(() => {
      piece5.style.transform = "translateX(0)";
      piece5.classList.add("visible");
    }, 5500);

    // Bottom-thread puzzle piece
    setTimeout(() => {
      piece6.style.transform = "translateX(0)";
      piece6.classList.add("visible");
    }, 6000);
  }

  const puzzleContainer = document.querySelector(".puzzle-container");
  if (!puzzleContainer) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          animatePuzzle();
          entry.target.dataset.animated = "true";
          obs.unobserve(entry.target); // optional: stop observing
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(puzzleContainer);
});
