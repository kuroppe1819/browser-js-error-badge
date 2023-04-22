(async () => {
  let errorCount = 0;

  document.addEventListener("ErrorToExtension", async () => {
    errorCount++;
    await chrome.runtime.sendMessage({
      eventName: "error_occurred",
      value: { errorCount: errorCount.toString() },
    });

    document.documentElement.style.border = "4px solid #DC2626";
  });
})();
