import { BrowserJsErrorBadgeConfig } from "./config";

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

chrome.action.onClicked.addListener(() => {
  BrowserJsErrorBadgeConfig.loadEnabled((enabled) => {
    const newEnabled = !enabled;
    setExtensionIcon(newEnabled);
    BrowserJsErrorBadgeConfig.saveEnabled(newEnabled);
  });
});
