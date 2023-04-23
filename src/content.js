import browser from "webextension-polyfill";
import { BrowserJsErrorBadgeConfig } from "./config";

const createBadgeCountElement = ({ errorCount }) => {
  const badgeCountEl = document.createElement("div");
  badgeCountEl.setAttribute("id", "browser-js-error-badge-count");

  const badgeEl = document.createElement("img");
  badgeEl.src = browser.runtime.getURL("icons/error-icon16.png");
  badgeEl.title = "error";
  badgeCountEl.appendChild(badgeEl);

  const countEl = document.createElement("div");
  countEl.textContent = errorCount;
  badgeCountEl.appendChild(countEl);

  return badgeCountEl;
};

const getBadgeCountElement = () => {
  return document.getElementById("browser-js-error-badge-count");
};

const setBrowserJsErrorBadgeEnabled = (enabled) => {
  const badgeCountEl = getBadgeCountElement();

  if (badgeCountEl === null) return;

  if (enabled) {
    badgeCountEl.classList.remove("browser-js-error-badge-count-disabled");
  } else {
    badgeCountEl.classList.add("browser-js-error-badge-count-disabled");
  }
};

BrowserJsErrorBadgeConfig.loadEnabled(setBrowserJsErrorBadgeEnabled);
BrowserJsErrorBadgeConfig.onEnabledChanged(setBrowserJsErrorBadgeEnabled);

let errorCount = 0;
document.addEventListener("ErrorToExtension", () => {
  BrowserJsErrorBadgeConfig.loadEnabled((enabled) => {
    if (!enabled) return;

    errorCount++;
    browser.runtime.sendMessage({
      eventName: "error_occurred",
      value: { errorCount: errorCount.toString() },
    });

    const badgeCountEl = getBadgeCountElement();
    if (badgeCountEl) {
      badgeCountEl.parentNode.removeChild(badgeCountEl);
    }
    document.documentElement.appendChild(
      createBadgeCountElement({ errorCount: errorCount.toString() })
    );
  });
});

const injectScript = document.createElement("script");
injectScript.src = browser.runtime.getURL("inject.js");
(document.head || document.documentElement).appendChild(injectScript);
injectScript.parentNode.removeChild(injectScript);
