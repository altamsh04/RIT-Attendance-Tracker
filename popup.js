// popup.js - Updated for Modern UI
document.addEventListener("DOMContentLoaded", function () {
    let toggleSwitch = document.getElementById("toggleTracking");
    let messageBox = document.getElementById("messageBox");

    // Hide message box initially
    messageBox.style.display = "none";

    // Get saved state
    chrome.storage.sync.get("trackingEnabled", (data) => {
        toggleSwitch.checked = data.trackingEnabled !== false; // Default to true if not set
    });

    // Set up toggle event
    toggleSwitch.addEventListener("change", function () {
        chrome.storage.sync.set({ trackingEnabled: toggleSwitch.checked }, () => {
            messageBox.style.display = "block";
        });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { trackingEnabled: toggleSwitch.checked });
            }
        });
    });

    // Button click handlers
    document.getElementById("rateUs").addEventListener("click", function () {
        window.open("https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID/reviews", "_blank");
    });

    document.getElementById("reportBug").addEventListener("click", function () {
        window.open("https://forms.gle/yA8gkdaig5VxT8cs9", "_blank");
    });

    document.getElementById("aboutDeveloper").addEventListener("click", function () {
        window.open("https://www.linkedin.com/in/altamsh-bairagdar-324ab7254/", "_blank");
    });
});