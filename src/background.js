class BrowserJsErrorBadgeConfig {
  static loadEnabled(func) {
    chrome.storage.sync.get(["browserJsErrorBadgeEnabled"], (result) => {
      let enabled = result.browserJsErrorBadgeEnabled;

      if (enabled === undefined) enabled = true;

      func(enabled);
    });
  }

  static async saveEnabled(enabled) {
    await chrome.storage.sync.set({ browserJsErrorBadgeEnabled: enabled });
  }

  static onEnabledChanged(func) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.browserJsErrorBadgeEnabled) {
        func(changes.browserJsErrorBadgeEnabled.newValue);
      }
    });
  }
}

const setExtensionIcon = (enabled) => {
  const path = chrome.runtime.getURL(
    enabled ? "icons/icon48.png" : "icons/disabled-icon48.png"
  );
  chrome.action.setIcon({ path });
};

BrowserJsErrorBadgeConfig.loadEnabled((enabled) => {
  setExtensionIcon(enabled);
});

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.eventName === "error_occurred") {
    await chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: msg.value.errorCount,
    });

    await chrome.action.setBadgeTextColor({
      tabId: sender.tab.id,
      color: "#FFFFFF",
    });

    await chrome.action.setBadgeBackgroundColor({
      tabId: sender.tab.id,
      color: "#DC2626",
    });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.active) return;
  await chrome.tabs.sendMessage(tab.id, {
    eventName: "badge_clicked",
  });

  BrowserJsErrorBadgeConfig.loadEnabled((enabled) => {
    const newEnabled = !enabled;
    setExtensionIcon(newEnabled);
    BrowserJsErrorBadgeConfig.saveEnabled(newEnabled);
  });
});
