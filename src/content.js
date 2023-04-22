import { BrowserJsErrorBadgeConfig } from "./config";

const createBadgeCountElement = ({ text }) => {
  const badgeCountEl = document.createElement("div");
  badgeCountEl.setAttribute("id", "browser-js-error-badge-count");
  badgeCountEl.textContent = text;
  return badgeCountEl;
};

const getBadgeCountElement = () => {
  return document.getElementById("browser-js-error-badge-count");
};

const setBrowserJsErrorBadgeEnabled = (enabled) => {
  const badgeCountEl = getBadgeCountElement();

  if (enabled) {
    badgeCountEl.classList.remove("browser-js-error-badge-count-disabled");
  } else {
    badgeCountEl.classList.add("browser-js-error-badge-count-disabled");
  }
};

BrowserJsErrorBadgeConfig.loadEnabled(setBrowserJsErrorBadgeEnabled);
BrowserJsErrorBadgeConfig.onEnabledChanged(setBrowserJsErrorBadgeEnabled);

let errorCount = 0;
document.addEventListener("ErrorToExtension", async () => {
  errorCount++;
  await chrome.runtime.sendMessage({
    eventName: "error_occurred",
    value: { errorCount: errorCount.toString() },
  });

  const badgeCountEl = getBadgeCountElement();
  if (badgeCountEl) {
    badgeCountEl.parentNode.removeChild(badgeCountEl);
  }
  document.documentElement.appendChild(
    createBadgeCountElement({ text: `❌ ${errorCount}` })
  );
});

const injectScript = document.createElement("script");
injectScript.src = chrome.runtime.getURL("inject.js");
(document.head || document.documentElement).appendChild(injectScript);
injectScript.parentNode.removeChild(injectScript);
