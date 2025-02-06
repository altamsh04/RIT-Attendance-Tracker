(function injectAttendanceData() {
    console.log("📢 Injecting Attendance Data...");

    chrome.storage.sync.get("trackingEnabled", (data) => {
        if (data.trackingEnabled === false) {
            console.log("⚠️ Attendance tracking is OFF.");
            return;
        }

        let subjectName = document.querySelector("#GridViewAttendedance caption")?.innerText.trim() || "Unknown Subject";
        let presentCount = 0;
        let absentCount = 0;

        document.querySelectorAll("#GridViewAttendedance tr td:nth-child(6)").forEach(td => {
            if (td.innerText.trim() === "P") {
                presentCount++;
            } else if (td.innerText.trim() === "A") {
                absentCount++;
            }
        });

        let totalLectures = presentCount + absentCount;
        let attendancePercent = totalLectures > 0 ? ((presentCount / totalLectures) * 100).toFixed(2) : "0";

        let requiredLectures = 0;
        if (attendancePercent < 75) {
            let needed = Math.ceil((0.75 * totalLectures - presentCount) / 0.25);
            requiredLectures = needed > 0 ? needed : 0;
        }

        let attendanceBox = document.createElement("div");
        attendanceBox.innerHTML = `
            <div style="padding: 10px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #007BFF;">📚 Attendance Summary</h3>
                <p><strong>Subject:</strong> ${subjectName}</p>
                <p><strong>Total Lectures:</strong> ${totalLectures}</p>
                <p><strong>Present Days:</strong> ✅ ${presentCount}</p>
                <p><strong>Absent Days:</strong> ❌ ${absentCount}</p>
                <p><strong>Attendance %:</strong> 
                    <span style="color: ${attendancePercent >= 75 ? 'green' : 'red'}; font-weight: bold;">${attendancePercent}%</span>
                </p>
                ${attendancePercent < 75 ? `
                    <p style="color: red;"><strong>⚠️ You need to attend <span style="font-size: 18px;">${requiredLectures}</span> more lectures to reach 75% attendance.</strong></p>
                ` : ''}
            </div>
        `;

        let attendanceTable = document.querySelector("#GridViewAttendedance");
        if (attendanceTable) {
            attendanceTable.parentNode.insertBefore(attendanceBox, attendanceTable);
            console.log("✅ Attendance Data Injected!");
        } else {
            console.log("❌ Attendance Table Not Found!");
        }
    });
})();

chrome.runtime.onMessage.addListener((message) => {
    if (message.trackingEnabled === false) {
        console.log("⏸️ Attendance tracking is disabled.");
        document.querySelector("#GridViewAttendedance")?.remove();
    }
});
