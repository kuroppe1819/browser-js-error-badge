const createBadgeCountElement = ({ text }) => {
  const badgeCountEl = document.createElement("div");
  badgeCountEl.id = "browser-js-error-badge-count";
  badgeCountEl.textContent = text;
  badgeCountEl.style.paddingLeft = "2px";
  badgeCountEl.style.paddingRight = "2px";
  badgeCountEl.style.color = "#FFFFFF";
  badgeCountEl.style.background = "#030712";
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

(async () => {
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
})();

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.eventName === "badge_clicked") {
    const badgeCountEl = getBadgeCountElement();
    badgeCountEl.style.display =
      badgeCountEl.style.display === "none" ? "block" : "none";
  }
});
