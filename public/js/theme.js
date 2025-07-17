document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const sunIconMobile = document.getElementById("sun-icon-mobile");
  const moonIconMobile = document.getElementById("moon-icon-mobile");

  // Function to set theme
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      if (sunIcon) sunIcon.classList.add("hidden");
      if (moonIcon) moonIcon.classList.remove("hidden");
      if (sunIconMobile) sunIconMobile.classList.add("hidden");
      if (moonIconMobile) moonIconMobile.classList.remove("hidden");
    } else {
      if (sunIcon) sunIcon.classList.remove("hidden");
      if (moonIcon) moonIcon.classList.add("hidden");
      if (sunIconMobile) sunIconMobile.classList.remove("hidden");
      if (moonIconMobile) moonIconMobile.classList.add("hidden");
    }
  }

  // Check for saved theme or system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  // Event listener for desktop theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      setTheme(currentTheme === "light" ? "dark" : "light");
    });
  }

  // Event listener for mobile theme toggle
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      setTheme(currentTheme === "light" ? "dark" : "light");
    });
  }
});
