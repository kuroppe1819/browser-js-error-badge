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
  if (msg.text === "content_loaded") {
    await chrome.scripting.executeScript({
      target: {
        tabId: sender.tab.id,
        allFrames: true,
      },
      func: injectScript,
      injectImmediately: true,
      world: "MAIN",
    });
  }
});
