document.addEventListener("DOMContentLoaded", () => {
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
  const mobileNavCloseBtn = document.getElementById("mobile-nav-close-btn");

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", () => {
      mobileNavOverlay.classList.add("open");
    });
  }
  if (mobileNavCloseBtn) {
    mobileNavCloseBtn.addEventListener("click", () => {
      mobileNavOverlay.classList.remove("open");
    });
  }
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener("click", (e) => {
      if (e.target === mobileNavOverlay) {
        mobileNavOverlay.classList.remove("open");
      }
    });
  }
});
