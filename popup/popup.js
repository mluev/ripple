/**
 * @file popup.js
 * @description Minimal popup - just opens settings
 */

// Open settings when button is clicked
document.getElementById('openSettings').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});
