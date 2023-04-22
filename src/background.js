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

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.active) return;
  await chrome.tabs.sendMessage(tab.id, {
    eventName: "badge_clicked",
  });
});
