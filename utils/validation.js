/**
 * @file validation.js
 * @description Input validation utilities
 * @module utils/validation
 */

import { CONSTANTS } from './constants.js';

/**
 * Custom error for validation failures
 */
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid
 * @throws {ValidationError} If invalid
 */
export function validateAPIKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new ValidationError('apiKey', 'API key is required');
  }

  if (apiKey.trim().length === 0) {
    throw new ValidationError('apiKey', 'API key cannot be empty');
  }

  // Anthropic API keys start with 'sk-ant-'
  if (!apiKey.startsWith('sk-ant-')) {
    throw new ValidationError('apiKey', 'Invalid API key format. Must start with "sk-ant-"');
  }

  return true;
}

/**
 * Validate tweet text
 * @param {string} text - Tweet text to validate
 * @returns {boolean} True if valid
 * @throws {ValidationError} If invalid
 */
export function validateTweetText(text) {
  if (!text || typeof text !== 'string') {
    throw new ValidationError('text', 'Tweet text is required');
  }

  if (text.trim().length === 0) {
    throw new ValidationError('text', 'Tweet text cannot be empty');
  }

  return true;
}

/**
 * Validate example text
 * @param {string} text - Example text to validate
 * @returns {boolean} True if valid
 * @throws {ValidationError} If invalid
 */
export function validateExampleText(text) {
  if (!text || typeof text !== 'string') {
    throw new ValidationError('text', 'Example text is required');
  }

  if (text.trim().length === 0) {
    throw new ValidationError('text', 'Example text cannot be empty');
  }

  if (text.length > 500) {
    throw new ValidationError('text', 'Example text too long (max 500 characters)');
  }

  return true;
}

/**
 * Validate system prompt
 * @param {string} prompt - System prompt to validate
 * @returns {boolean} True if valid
 * @throws {ValidationError} If invalid
 */
export function validateSystemPrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new ValidationError('systemPrompt', 'System prompt is required');
  }

  if (prompt.trim().length === 0) {
    throw new ValidationError('systemPrompt', 'System prompt cannot be empty');
  }

  if (prompt.length > CONSTANTS.MAX_PROMPT_LENGTH) {
    throw new ValidationError('systemPrompt', `System prompt too long (max ${CONSTANTS.MAX_PROMPT_LENGTH} characters)`);
  }

  return true;
}

/**
 * Validate settings object
 * @param {Object} settings - Settings object to validate
 * @returns {boolean} True if valid
 * @throws {ValidationError} If invalid
 */
export function validateSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    throw new ValidationError('settings', 'Settings must be an object');
  }

  if (settings.apiKey) {
    validateAPIKey(settings.apiKey);
  }

  if (settings.systemPrompt) {
    validateSystemPrompt(settings.systemPrompt);
  }

  return true;
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHTML(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

export { ValidationError };
