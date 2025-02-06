document.addEventListener("DOMContentLoaded", function () {
    let toggleSwitch = document.getElementById("toggleTracking");
    let messageBox = document.getElementById("messageBox");

    messageBox.style.display = "none";
    messageBox.textContent = "🔄 Reload the page for changes to take effect.";

    document.body.appendChild(messageBox);

    chrome.storage.sync.get("trackingEnabled", (data) => {
        toggleSwitch.checked = data.trackingEnabled ?? true;
    });

    toggleSwitch.addEventListener("change", function () {
        chrome.storage.sync.set({ trackingEnabled: toggleSwitch.checked }, () => {
            messageBox.style.display = "block";
        });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { trackingEnabled: toggleSwitch.checked });
        });
    });

    document.getElementById("rateUs").addEventListener("click", function () {
        window.open("https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID/reviews", "_blank");
    });

    document.getElementById("reportBug").addEventListener("click", function () {
        window.open("https://github.com/your-repo/issues", "_blank");
    });

    document.getElementById("aboutDeveloper").addEventListener("click", function () {
        window.open("https://www.linkedin.com/in/altamsh-bairagdar-324ab7254/", "_blank");
    });
});
