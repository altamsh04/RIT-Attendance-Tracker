// content.js - Updated with Custom Charts Implementation
(function injectAttendanceData() {
  console.log("📢 Injecting Attendance Data...");

  chrome.storage.sync.get("trackingEnabled", (data) => {
    if (data.trackingEnabled === false) {
      console.log("⚠️ Attendance tracking is OFF.");
      return;
    }

    let subjectName =
      document
        .querySelector("#GridViewAttendedance caption")
        ?.innerText.trim() || "Unknown Subject";
    let presentCount = 0;
    let absentCount = 0;
    let absentDates = [];
    let attendanceDates = [];
    let attendanceStatus = [];

    document.querySelectorAll("#GridViewAttendedance tr").forEach((tr) => {
      const statusCell = tr.querySelector("td:nth-child(6)");
      const dateCell = tr.querySelector("td:nth-child(4)");

      if (statusCell && dateCell) {
        const status = statusCell.innerText.trim();
        const date = dateCell.innerText.trim();

        if (status === "P") {
          presentCount++;
          attendanceDates.push(date);
          attendanceStatus.push(1); // 1 for present
        } else if (status === "A") {
          absentCount++;
          absentDates.push(date);
          attendanceDates.push(date);
          attendanceStatus.push(0); // 0 for absent
        }
      }
    });

    let totalLectures = presentCount + absentCount;
    let attendancePercent =
      totalLectures > 0
        ? ((presentCount / totalLectures) * 100).toFixed(1)
        : "0";

    let requiredLectures = 0;
    if (attendancePercent < 75) {
      let needed = Math.ceil((0.75 * totalLectures - presentCount) / 0.25);
      requiredLectures = needed > 0 ? needed : 0;
    }

    const existingBox = document.querySelector(".rit-attendance-box");
    if (existingBox) {
      existingBox.remove();
    }

    let attendanceBox = document.createElement("div");
    attendanceBox.className = "rit-attendance-box";
    attendanceBox.innerHTML = `
            <div class="attendance-header">
                <span>📊</span>
                <h3>Attendance Analytics</h3>
            </div>
            <div class="attendance-content">
                <p class="subject-name">${subjectName}</p>
                
                <div class="visualization-container">
                    <div class="donut-chart-container">
                        <div id="custom-donut-chart" class="custom-donut-chart">
                            <div class="donut-segment present-segment" style="--percentage: ${
                              presentCount / totalLectures
                            };"></div>
                            <div class="donut-segment absent-segment" style="--percentage: ${
                              absentCount / totalLectures
                            };"></div>
                        </div>
                        <div class="donut-center">
                            <span class="percent-big ${
                              attendancePercent >= 75
                                ? "percent-good"
                                : "percent-bad"
                            }">${attendancePercent}%</span>
                            <span class="percent-label">Attendance</span>
                        </div>
                    </div>
                    
                    <div class="trend-chart-container">
                        <div id="custom-trend-chart" class="custom-trend-chart">
                            <div class="chart-y-axis">
                                <span>100%</span>
                                <span>75%</span>
                                <span>50%</span>
                                <span>25%</span>
                                <span>0%</span>
                            </div>
                            <div class="chart-content">
                                <div class="threshold-line"></div>
                                <div class="trend-line"></div>
                                <div class="trend-points"></div>
                            </div>
                        </div>
                        <div class="trend-label">Attendance Percentage Over Time</div>
                    </div>
                </div>

                <div class="attendance-stats">
                    <div class="stat-card">
                        <p>TOTAL</p>
                        <div class="stat-value">${totalLectures}</div>
                        <div class="stat-progress">
                            <div class="progress-bar" style="width: 100%"></div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <p>PRESENT</p>
                        <div class="stat-value">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" style="margin-right: 4px; vertical-align: -4px;"><path fill="#63E6BE" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                            ${presentCount}
                        </div>
                        <div class="stat-progress">
                            <div class="progress-bar progress-present" style="width: ${
                              (presentCount / totalLectures) * 100
                            }%"></div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <p>ABSENT</p>
                        <div class="stat-value">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" style="margin-right: 4px; vertical-align: -4px;"><path fill="#ff4242" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
                            ${absentCount}
                        </div>
                        <div class="stat-progress">
                            <div class="progress-bar progress-absent" style="width: ${
                              (absentCount / totalLectures) * 100
                            }%"></div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <p>NEEDED</p>
                        <div class="stat-value">${
                          attendancePercent < 75 ? requiredLectures : "0"
                        }</div>
                        <div class="stat-progress">
                            <div class="progress-bar progress-needed" style="width: ${
                              attendancePercent < 75
                                ? (requiredLectures /
                                    (totalLectures + requiredLectures)) *
                                  100
                                : 0
                            }%"></div>
                        </div>
                    </div>
                </div>
                
                ${
                  attendancePercent < 75
                    ? `
                    <div class="attendance-warning">
                        <div class="warning-icon">⚠️</div>
                        <p class="warning-text">Need approximately <span class="warning-count">${requiredLectures}</span> more lectures to reach <span class="warning-count">75%</span></p>
                    </div>
                `
                    : ""
                }

                <button class="download-btn" id="downloadAttendance">
                    <span>📥</span> Download Attendance Report (.txt)
                </button>
            </div>
        `;

    let customStyles = document.createElement("style");
    customStyles.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
.rit-attendance-box {
    font-family: 'Inter', sans-serif;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 8px auto;
    padding: 0;
    overflow: hidden;
    max-width: 800px;
    width: 100%; /* Give some breathing room on smaller screens */
}
            
.visualization-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 12px;
    margin-bottom: 18px;
    background: #f8fafc;
    padding: 10px;
    border-radius: 8px;
    max-height: 200px; /* Reduced height */
    align-items: center;
}
            
.donut-chart-container {
    position: relative;
    width: 130px; /* Smaller size */
    height: 130px; /* Smaller size */
    margin: 0 auto;
}
            
.custom-donut-chart {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
}
            
.donut-segment {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
    transform-origin: center;
}

.donut-segment.present-segment {
    background-color: #63E6BE;
    transform: rotate(0deg);
    clip-path: polygon(
        50% 50%,
        50% 0%,
        /* This will be dynamically set based on the actual values */
        50% 50%
    );
    z-index: 2;
}
            
.donut-segment.absent-segment {
    background-color: #ff4242;
    transform: rotate(calc(360deg * var(--percentage)));
    z-index: 1;
}
            
.donut-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 65%;
    height: 65%;
    background: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 3;
}
            
/* Custom Trend Chart Styles */
.trend-chart-container {
    height: 120px; /* Smaller height */
    position: relative;
    width: 100%;
}

.custom-trend-chart {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
}
            
.chart-y-axis {
    width: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px 0; /* Reduced padding */
    font-size: 11px; /* Smaller font */
    color: #64748b;
}
            
.chart-content {
    flex: 1;
    position: relative;
    border-left: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
}
            
.threshold-line {
    position: absolute;
    top: 25%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(249, 115, 22, 0.4);
    border-top: 1px dashed #f97316;
    z-index: 1;
}
            
.trend-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 2;
}
            
.trend-points {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
}
            
.trend-label {
    text-align: center;
    font-size: 11px; /* Smaller font */
    color: #64748b;
    margin-top: 6px; /* Reduced margin */
}
            
.percent-big {
    font-size: 24px; /* Smaller font */
    font-weight: 700;
    display: block;
}

.percent-good {
    color: #10b981;
}

.percent-bad {
    color: #ef4444;
}
            
.percent-label {
    font-size: 11px; /* Smaller font */
    color: #64748b;
}
            
.attendance-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 8px;
}
            
.stat-card {
    background: #f8fafc;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
}
            
.stat-progress {
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    margin-top: 8px;
}
            
.progress-bar {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
}
            
.progress-present { background: #63E6BE; }
.progress-absent { background: #ff4242; }
.progress-needed { background: #fbbf24; }
            
.stat-value {
    font-size: 18px;
    font-weight: 600;
    margin: 4px 0;
    color: #1e293b;
    display: flex;
    align-items: center;
    justify-content: center;
}
            
.attendance-header {
    padding: 6px 6px;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
}

.attendance-header h3 {
    margin: 0;
    font-weight: 400;
}
            
.attendance-content {
    padding: 16px;
}

.subject-name {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #1e293b;
}
            
.download-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    transition: all 0.2s;
}
            
.download-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.attendance-warning {
    background: #fff7ed;
    border-left: 4px solid #f97316;
    padding: 8px 8px;
    margin: 8px 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.warning-text {
    margin: 0;
    color: #7c2d12;
    font-size: 14px;
}

.warning-count {
    font-weight: 600;
}

.trend-point {
    position: absolute;
    width: 6px; /* Smaller dots */
    height: 6px; /* Smaller dots */
    border-radius: 50%;
    background: #4f46e5;
    transform: translate(-50%, -50%);
}

.trend-line-path {
    stroke: #4f46e5;
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.trend-area {
    fill: rgba(79, 70, 229, 0.1);
    stroke: none;
}

/* Improve responsive behavior */
@media (max-width: 768px) {
    .visualization-container {
        grid-template-columns: 1fr;
        max-height: none; /* Allow full height on mobile */
    }
    
    .donut-chart-container {
        margin-bottom: 20px;
    }
    
    .attendance-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}

/* Smaller screens */
@media (max-width: 480px) {
    .attendance-stats {
        grid-template-columns: 1fr;
    }
    
    .stat-card {
        padding: 8px;
    }
    
    .attendance-content {
        padding: 14px;
    }
}
    `;

    document.head.appendChild(customStyles);

    let attendanceTable = document.querySelector("#GridViewAttendedance");
    if (attendanceTable) {
      attendanceTable.parentNode.insertBefore(attendanceBox, attendanceTable);
      console.log("✅ Attendance Data Injected!");

      // Initialize custom charts
      setTimeout(() => {
        try {
          // Create trend chart
          createTrendChart(totalLectures, attendanceStatus);
          console.log("✅ Custom charts rendered successfully!");
        } catch (error) {
          console.error("❌ Error rendering custom charts:", error);
        }
      }, 100);

      // Add download functionality
      document
        .getElementById("downloadAttendance")
        .addEventListener("click", () => {
          const content = `Attendance Report\n---------------\nSubject: ${subjectName}\nTotal Lectures: ${totalLectures}\nPresent: ${presentCount}\nAbsent: ${absentCount}\nAttendance Percentage: ${attendancePercent}%\n\nAbsent Dates:\n${absentDates.join(
            "\n"
          )}`;

          const blob = new Blob([content], { type: "text/plain" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${subjectName.replace(/\s+/g, "_")}_attendance.txt`;
          a.click();
          window.URL.revokeObjectURL(url);
        });
    } else {
      console.log("❌ Attendance Table Not Found!");
    }
  });
})();

// Function to create the trend chart using SVG
function createTrendChart(totalLectures, attendanceStatus) {
  const chartContent = document.querySelector(".chart-content");
  const trendLine = document.querySelector(".trend-line");
  const trendPoints = document.querySelector(".trend-points");

  if (!chartContent || !trendLine || !trendPoints || totalLectures === 0)
    return;

  const width = chartContent.clientWidth;
  const height = chartContent.clientHeight;

  // Calculate attendance percentages over time
  let runningPresent = 0;
  const percentages = [];

  attendanceStatus.forEach((status, index) => {
    if (status === 1) runningPresent++;
    const percentage = (runningPresent / (index + 1)) * 100;
    percentages.push(percentage);
  });

  // Create SVG elements
  const svgNS = "http://www.w3.org/2000/svg";

  // Create path for trend line
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";

  // Create path data
  let pathData = "M ";
  let areaData = "M 0 " + height + " ";

  percentages.forEach((percentage, index) => {
    const x = (index / (totalLectures - 1)) * width;
    const y = height - (percentage / 100) * height;

    if (index === 0) {
      pathData += x + " " + y;
      areaData += x + " " + y;
    } else {
      pathData += " L " + x + " " + y;
      areaData += " L " + x + " " + y;
    }

    // Add points
    const point = document.createElement("div");
    point.className = "trend-point";
    point.style.left = x + "px";
    point.style.top = y + "px";
    trendPoints.appendChild(point);
  });

  // Complete area path
  areaData += " L " + width + " " + height + " L 0 " + height + " Z";

  // Create line path
  const linePath = document.createElementNS(svgNS, "path");
  linePath.setAttribute("d", pathData);
  linePath.setAttribute("class", "trend-line-path");
  svg.appendChild(linePath);

  // Create area path
  const areaPath = document.createElementNS(svgNS, "path");
  areaPath.setAttribute("d", areaData);
  areaPath.setAttribute("class", "trend-area");
  svg.appendChild(areaPath);

  trendLine.appendChild(svg);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.trackingEnabled === false) {
    console.log("⏸️ Attendance tracking is disabled.");
    document.querySelector(".rit-attendance-box")?.remove();
  }
});
