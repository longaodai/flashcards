// Helper function to format duration from milliseconds to "Xm Ys"
function formatDuration(ms) {
  if (ms === null || isNaN(ms)) return "--";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  let result = "";
  if (minutes > 0) {
    result += `${minutes}m `;
  }
  result += `${remainingSeconds}s`;
  return result.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  // Get time spent from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const durationMs = Number.parseInt(urlParams.get("duration"));
  const timeSpentElement = document.getElementById("time-spent");

  if (!isNaN(durationMs)) {
    timeSpentElement.textContent = formatDuration(durationMs);
  } else {
    timeSpentElement.textContent = "--"; // Fallback if no duration is found
  }

  // Mobile navigation toggle (copied from script.js for consistency)
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
