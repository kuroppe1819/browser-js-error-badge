import browser from "webextension-polyfill";

export const loadEnabled = async (func) => {
	const result = await browser.storage.sync.get(["browserJsErrorBadgeEnabled"]);
	let enabled = result.browserJsErrorBadgeEnabled;

	if (enabled === undefined) enabled = true;

	func(enabled);
};

export const saveEnabled = async (enabled) => {
	await browser.storage.sync.set({ browserJsErrorBadgeEnabled: enabled });
};

export const onEnabledChanged = async (func) => {
	await browser.storage.onChanged.addListener((changes) => {
		if (changes.browserJsErrorBadgeEnabled) {
			func(changes.browserJsErrorBadgeEnabled.newValue);
		}
	});
};
