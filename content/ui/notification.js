/**
 * @file notification.js
 * @description Toast notification system
 * @module content/ui
 */

/**
 * Show toast notification
 * @param {string} type - Type (success, error, info)
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default 3000)
 */
function showNotification(type, message, duration = 3000) {
  // Remove existing notifications
  const existing = document.querySelectorAll('.smart-reply-toast');
  existing.forEach(toast => toast.remove());

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `smart-reply-toast smart-reply-toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  // Icon based on type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '✓';
      break;
    case 'error':
      icon = '✕';
      break;
    case 'info':
      icon = 'ℹ';
      break;
    default:
      icon = '•';
  }

  toast.innerHTML = `
    <span class="smart-reply-toast__icon">${icon}</span>
    <span class="smart-reply-toast__message">${message}</span>
  `;

  // Add to DOM
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('smart-reply-toast--visible');
  });

  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.remove('smart-reply-toast--visible');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Make function globally accessible
window.showNotification = showNotification;
