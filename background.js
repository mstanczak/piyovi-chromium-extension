// This service worker is primarily here to support the options page
// and handle any future background tasks. For this extension, its role is minimal.

chrome.runtime.onInstalled.addListener(() => {
  // Set default values for the features when the extension is first installed.
  chrome.storage.sync.set({
    isHighlightingEnabled: true,
    isNotesHighlightEnabled: true,
    isRepositioningEnabled: true,
    isPackAllProminent: true,
    isAutoPackEnabled: false // Default new feature to off
  });
});
