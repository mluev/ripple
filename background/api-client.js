/**
 * @file api-client.js
 * @description Claude API client for generating replies
 * @module background/api-client
 */

import { CONSTANTS } from '../utils/constants.js';

/**
 * API Error class
 */
class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

/**
 * Claude API Client
 */
export class ClaudeAPIClient {
  constructor(apiKey, config) {
    this.apiKey = apiKey;
    this.endpoint = config.endpoint;
    this.model = config.model;
    this.maxTokens = config.maxTokens;
    this.temperature = config.temperature;
    this.apiVersion = config.apiVersion;
  }

  /**
   * Generate reply variations
   * @param {string} prompt - Complete prompt
   * @returns {Promise<string>} AI response text
   */
  async generateReplies(prompt) {
    const response = await this.makeRequest(prompt);
    return this.parseResponse(response);
  }

  /**
   * Make API request with retry logic
   * @param {string} prompt - Complete prompt
   * @param {number} retryCount - Current retry count
   * @returns {Promise<Object>} API response
   */
  async makeRequest(prompt, retryCount = 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CONSTANTS.API_TIMEOUT);

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.apiVersion
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new APIError(response.status, errorText);
      }

      return await response.json();

    } catch (error) {
      // Retry once on failure (except for abort/auth errors)
      if (retryCount < CONSTANTS.MAX_RETRIES &&
          error.name !== 'AbortError' &&
          error.status !== 401) {
        console.log('Retrying API request...');
        await this.sleep(1000); // Wait 1 second before retry
        return this.makeRequest(prompt, retryCount + 1);
      }

      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new APIError(408, 'Request timeout');
      }

      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(500, error.message);
    }
  }

  /**
   * Parse API response
   * @param {Object} response - API response object
   * @returns {string} Response text
   */
  parseResponse(response) {
    try {
      // Extract text from Claude response
      if (response.content && response.content.length > 0) {
        return response.content[0].text;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new APIError(500, 'Failed to parse API response');
    }
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>} True if successful
   */
  async testConnection() {
    try {
      const testPrompt = 'Say "OK" if you can read this.';
      const response = await this.makeRequest(testPrompt);
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sleep utility
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export function getAPIErrorMessage(error) {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return 'Invalid API key. Please check your settings.';
      case 429:
        return 'Rate limit exceeded. Please try again in a moment.';
      case 408:
        return 'Request timeout. Please try again.';
      case 500:
        return 'API service error. Please try again later.';
      default:
        return 'An API error occurred. Please try again.';
    }
  }

  if (error.message && error.message.includes('network')) {
    return 'Network error. Please check your connection.';
  }

  return 'An unexpected error occurred. Please try again.';
}

export { APIError };
