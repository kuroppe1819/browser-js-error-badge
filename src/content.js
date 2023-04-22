import { BrowserJsErrorBadgeConfig } from "./config";

const createBadgeCountElement = ({ text }) => {
  const badgeCountEl = document.createElement("div");
  badgeCountEl.id = "browser-js-error-badge-count";
  badgeCountEl.textContent = text;
  badgeCountEl.style.paddingLeft = "2px";
  badgeCountEl.style.paddingRight = "2px";
  badgeCountEl.style.color = "#FFFFFF";
  badgeCountEl.style.background = "#111827";
  badgeCountEl.style.position = "fixed";
  badgeCountEl.style.top = "0";
  badgeCountEl.style.left = "0";
  badgeCountEl.style.zIndex = "2147483647";
  badgeCountEl.style.fontSize = "16px";
  return badgeCountEl;
};

const getBadgeCountElement = () => {
  return document.getElementById("browser-js-error-badge-count");
};

const setBrowserJsErrorBadgeEnabled = (enabled) => {
  // document.body.dataset.marktoneEnabled = enabled.toString();

  // if (enabled) {
  //   document.body.classList.remove("marktone-disabled");
  // } else {
  //   document.body.classList.add("marktone-disabled");
  // }

  const badgeCountEl = getBadgeCountElement();
  badgeCountEl.style.display = enabled ? "block" : "none";
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
