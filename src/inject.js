const propagateErrorToExtension = () => {
	document.dispatchEvent(new CustomEvent("ErrorToExtension", {}));
};

window.addEventListener("error", propagateErrorToExtension);
window.addEventListener("unhandledrejection", propagateErrorToExtension);

const consoleErrorFunc = window.console.error;
window.console.error = (...args) => {
	consoleErrorFunc.apply(console, args);
	propagateErrorToExtension();
};
