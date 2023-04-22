(async () => {
  let errorCount = 0;

  document.addEventListener("ErrorToExtension", () => {
    errorCount++;
    console.log(errorCount);
  });

  await chrome.runtime.sendMessage({ text: "content_loaded" });
})();
