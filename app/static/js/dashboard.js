// Fetch data and update the dashboard
async function loadStats() {
  try {
    const response = await $.get("/api/stats");
    const data = response;

    if (data.error) {
      console.error(data.error);
      return;
    }

    // Update summary cards
    $("#total-requests").text(data.total);

    $("#total-downloads").text(data.downloads);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    $("#today-requests").text(data.daily[today] || 0);

    // Get current month in YYYY-MM format
    const currentMonth = today.substring(0, 7);
    $("#month-requests").text(data.monthly[currentMonth] || 0);

    // Create daily chart
    createChart(
      "dailyChart",
      "line",
      Object.keys(data.daily),
      Object.values(data.daily),
      "Daily Requests",
    );

    // Create monthly chart
    createChart(
      "monthlyChart",
      "bar",
      Object.keys(data.monthly),
      Object.values(data.monthly),
      "Monthly Requests",
    );

    // Fill endpoints table
    fillTable("endpoints-table", data.endpoints);

    // Fill methods table
    fillTable("methods-table", data.methods);
  } catch (error) {
    console.error("Error loading statistics:", error);
  }
}

function createChart(canvasId, type, labels, data, label) {
  const ctx = $(`#${canvasId}`)[0].getContext("2d");
  new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor:
            type === "bar"
              ? "rgba(54, 162, 235, 0.5)"
              : "rgba(75, 192, 192, 0.5)",
          borderColor:
            type === "bar" ? "rgba(54, 162, 235, 1)" : "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function fillTable(tableId, data) {
  const tableBody = $(`#${tableId}`);
  tableBody.empty();

  // Sort by count descending
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  sortedEntries.forEach(([key, value]) => {
    const row = $("<tr>").html(`
        <td>${key}</td>
        <td>${value}</td>
      `);
    tableBody.append(row);
  });
}

// Load data when page loads
$(document).ready(loadStats);

// Refresh data every 30 seconds
setInterval(loadStats, 30000);
