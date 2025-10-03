/**
 * @file content-script.js
 * @description Main content script entry point
 */

console.log('Smart Reply Extension - Content script loaded');

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('Smart Reply Extension - Initializing...');

  // Wait a bit for Twitter to load
  setTimeout(() => {
    initButtonInjection();
  }, 1000);
}

// Listen for settings updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'settings-updated') {
    console.log('Settings updated');
    // Could reload configuration if needed
  }
});
