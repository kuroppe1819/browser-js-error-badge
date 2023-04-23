import browser from "webextension-polyfill";
import { BrowserJsErrorBadgeConfig } from "./config";

const setExtensionIcon = (enabled) => {
  const path = browser.runtime.getURL(
    enabled ? "icons/icon48.png" : "icons/disabled-icon48.png"
  );
  browser.action.setIcon({ path });
};

BrowserJsErrorBadgeConfig.loadEnabled((enabled) => {
  setExtensionIcon(enabled);
});

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.eventName === "error_occurred") {
    browser.action.setBadgeText({
      tabId: sender.tab.id,
      text: msg.value.errorCount,
    });

    browser.action.setBadgeTextColor({
      tabId: sender.tab.id,
      color: "#FFFFFF",
    });

    browser.action.setBadgeBackgroundColor({
      tabId: sender.tab.id,
      color: "#DC2626",
    });
  }
});

browser.action.onClicked.addListener(() => {
  BrowserJsErrorBadgeConfig.loadEnabled((enabled) => {
    const newEnabled = !enabled;
    setExtensionIcon(newEnabled);
    BrowserJsErrorBadgeConfig.saveEnabled(newEnabled);
  });
});
