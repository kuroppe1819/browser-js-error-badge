export class BrowserJsErrorBadgeConfig {
  static loadEnabled(func) {
    chrome.storage.sync.get(["browserJsErrorBadgeEnabled"], (result) => {
      let enabled = result.browserJsErrorBadgeEnabled;

      if (enabled === undefined) enabled = true;

      func(enabled);
    });
  }

  static async saveEnabled(enabled) {
    await chrome.storage.sync.set({ browserJsErrorBadgeEnabled: enabled });
  }

  static onEnabledChanged(func) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.browserJsErrorBadgeEnabled) {
        func(changes.browserJsErrorBadgeEnabled.newValue);
      }
    });
  }
}
