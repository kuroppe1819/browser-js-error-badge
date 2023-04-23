import browser from "webextension-polyfill";

export class BrowserJsErrorBadgeConfig {
  static async loadEnabled(func) {
    const result = await browser.storage.sync.get([
      "browserJsErrorBadgeEnabled",
    ]);
    let enabled = result.browserJsErrorBadgeEnabled;

    if (enabled === undefined) enabled = true;

    func(enabled);
  }

  static async saveEnabled(enabled) {
    await browser.storage.sync.set({ browserJsErrorBadgeEnabled: enabled });
  }

  static async onEnabledChanged(func) {
    await browser.storage.onChanged.addListener((changes) => {
      if (changes.browserJsErrorBadgeEnabled) {
        func(changes.browserJsErrorBadgeEnabled.newValue);
      }
    });
  }
}
