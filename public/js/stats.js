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
  // Function to load and display statistics
  function loadStats() {
    const stats = JSON.parse(localStorage.getItem("flashcardStats") || "{}");
    const today = new Date();
    const dateKey = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // Today's Summary
    const todayStats = stats.dailyStats ? stats.dailyStats[dateKey] : null;
    document.getElementById("today-time-spent").textContent = todayStats
      ? formatDuration(todayStats.totalTimeSpentMs)
      : "--";
    document.getElementById("today-sessions").textContent = todayStats
      ? todayStats.sessionsCount
      : "--";

    // Hourly Breakdown Today
    const hourlyStatsList = document.getElementById("hourly-stats-list");
    hourlyStatsList.innerHTML = ""; // Clear previous content
    const todayHourlyData = stats.hourlyStats
      ? stats.hourlyStats[dateKey]
      : null;

    if (todayHourlyData && Object.keys(todayHourlyData).length > 0) {
      // Sort hours for consistent display
      const sortedHours = Object.keys(todayHourlyData).sort();
      sortedHours.forEach((hour) => {
        const time = todayHourlyData[hour];
        const listItem = document.createElement("div");
        listItem.className = "flex justify-between items-center p-3 rounded-md";
        listItem.innerHTML = `
                    <span class="text-card font-medium">${hour}:00 - ${
          Number(hour) + 1
        }:00</span>
                    <span class="text-blue-500 font-semibold">${formatDuration(
                      time
                    )}</span>
                `;
        hourlyStatsList.appendChild(listItem);
      });
    } else {
      hourlyStatsList.innerHTML =
        '<p class="text-muted text-sm">No hourly data available for today.</p>';
    }

    // Daily Study History
    const dailyStatsList = document.getElementById("daily-stats-list");
    dailyStatsList.innerHTML = ""; // Clear previous content
    const dailyData = stats.dailyStats || {};

    if (Object.keys(dailyData).length > 0) {
      // Sort dates in descending order
      const sortedDates = Object.keys(dailyData).sort().reverse();
      sortedDates.forEach((date) => {
        const dayStats = dailyData[date];
        const listItem = document.createElement("div");
        listItem.className = "flex justify-between items-center p-3 rounded-md";
        listItem.innerHTML = `
                  <span class="text-card font-medium">${date}</span>
                  <span class="text-blue-500 font-semibold">${formatDuration(
                    dayStats.totalTimeSpentMs
                  )} (${dayStats.sessionsCount} sessions)</span>
              `;
        dailyStatsList.appendChild(listItem);
      });
    } else {
      dailyStatsList.innerHTML =
        '<p class="text-muted text-sm">No historical data available.</p>';
    }
  }

  loadStats(); // Load stats when the page loads
});
