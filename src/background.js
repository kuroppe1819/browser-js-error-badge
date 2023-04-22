const injectScript = () => {
  const propagateErrorToExtension = () => {
    document.dispatchEvent(new CustomEvent("ErrorToExtension", {}));
  };

  window.addEventListener("error", propagateErrorToExtension);
  window.addEventListener("unhandledrejection", propagateErrorToExtension);

  const consoleErrorFunc = window.console.error;
  window.console.error = function () {
    consoleErrorFunc.apply(console, arguments);
    propagateErrorToExtension();
  };
};

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.eventName === "content_loaded") {
    await chrome.scripting.executeScript({
      target: {
        tabId: sender.tab.id,
        allFrames: true,
      },
      func: injectScript,
      injectImmediately: true,
      world: "MAIN",
    });
  } else if (msg.eventName === "error_occurred") {
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
