const propagateErrorToExtension = () => {
	document.dispatchEvent(new CustomEvent("ErrorToExtension", {}));
};

// Errors already counted by the fetch wrapper, so that unhandledrejection
// and console.error do not count them again. A WeakSet keeps the page's
// error objects untouched (works even when they are frozen).
const countedErrors = new WeakSet();

const markAsCounted = (error) => {
	if (error instanceof Object) countedErrors.add(error);
};

const isCounted = (value) => countedErrors.has(value);

const isAborted = (error) =>
	error instanceof DOMException &&
	(error.name === "AbortError" || error.name === "TimeoutError");

window.addEventListener("error", propagateErrorToExtension);

window.addEventListener("unhandledrejection", (event) => {
	if (isCounted(event.reason)) return;
	propagateErrorToExtension();
});

const consoleErrorFunc = window.console.error;
window.console.error = (...args) => {
	consoleErrorFunc.apply(console, args);
	if (args.some(isCounted)) return;
	propagateErrorToExtension();
};

// Detect fetch network failures (offline, DNS failure, CORS rejection, etc.)
// even when the page catches them. Aborts and timeouts are not errors.
// HTTP error responses (4xx/5xx) resolve normally and are out of scope.
const originalFetch = window.fetch;
window.fetch = (...args) =>
	originalFetch.apply(window, args).catch((error) => {
		if (!isAborted(error)) {
			markAsCounted(error);
			propagateErrorToExtension();
		}
		throw error;
	});

// Detect XHR network failures. The error event does not fire for
// aborts, timeouts, or HTTP error responses.
const originalXhrSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (...args) {
	// The DOM spec guarantees the identical listener is not added twice,
	// so reused instances do not double count.
	this.addEventListener("error", propagateErrorToExtension);
	return originalXhrSend.apply(this, args);
};
