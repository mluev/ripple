/**
 * @file content-script.js
 * @description Main content script entry point
 */

console.log('Ripple Extension - Content script loaded');

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('Ripple Extension - Initializing...');

  // Wait a bit for Twitter to load
  setTimeout(() => {
    try {
      if (typeof initButtonInjection === 'function') {
        initButtonInjection();
      } else {
        console.error('initButtonInjection is not defined');
      }
    } catch (error) {
      console.error('Error initializing button injection:', error);
    }

    try {
      if (typeof initMultipleMode === 'function') {
        initMultipleMode();
      } else {
        console.error('initMultipleMode is not defined');
      }
    } catch (error) {
      console.error('Error initializing multiple mode:', error);
    }
  }, 1000);
}

// Listen for settings updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'settings-updated') {
    console.log('Settings updated');
    // Could reload configuration if needed
  }
});
