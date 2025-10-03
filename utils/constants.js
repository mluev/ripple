/**
 * @file constants.js
 * @description Application-wide constants
 * @module utils
 */

export const CONSTANTS = {
  // Storage keys
  STORAGE_KEYS: {
    SETTINGS: 'settings',
    EXAMPLES: 'examples',
    CACHE: 'cache'
  },

  // Limits
  MAX_EXAMPLES: 10,
  MAX_TWEET_LENGTH: 280,
  MAX_PROMPT_LENGTH: 10000,

  // API
  API_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 1,

  // UI
  MODAL_ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 500,

  // Messages
  MESSAGE_ACTIONS: {
    GENERATE_REPLY: 'generate-reply',
    SAVE_EXAMPLE: 'save-example',
    DELETE_EXAMPLE: 'delete-example',
    GET_SETTINGS: 'get-settings',
    UPDATE_SETTINGS: 'update-settings',
    SETTINGS_UPDATED: 'settings-updated',
    TEST_API: 'test-api'
  },

  // States
  BUTTON_STATES: {
    DEFAULT: 'default',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
  },

  // Error codes
  ERROR_CODES: {
    NO_API_KEY: 'NO_API_KEY',
    INVALID_API_KEY: 'INVALID_API_KEY',
    RATE_LIMIT: 'RATE_LIMIT',
    API_ERROR: 'API_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    STORAGE_ERROR: 'STORAGE_ERROR'
  }
};
