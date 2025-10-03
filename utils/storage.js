/**
 * @file storage.js
 * @description Storage utility wrapper for Chrome Storage API
 * @module utils/storage
 */

import { CONSTANTS } from './constants.js';

/**
 * Custom error for storage operations
 */
class StorageError extends Error {
  constructor(operation, message) {
    super(message);
    this.name = 'StorageError';
    this.operation = operation;
  }
}

/**
 * Storage utility object
 */
export const storage = {
  /**
   * Get settings from sync storage
   * @returns {Promise<Object>} Settings object
   */
  async getSettings() {
    try {
      const result = await chrome.storage.sync.get(CONSTANTS.STORAGE_KEYS.SETTINGS);
      return result.settings || this.getDefaultSettings();
    } catch (error) {
      console.error('Error getting settings:', error);
      return this.getDefaultSettings();
    }
  },

  /**
   * Save settings to sync storage
   * @param {Object} settings - Settings object
   */
  async setSettings(settings) {
    try {
      // For MVP: Save without encryption for simplicity
      // TODO: Add encryption back later
      await chrome.storage.sync.set({
        [CONSTANTS.STORAGE_KEYS.SETTINGS]: settings
      });
    } catch (error) {
      if (error.message && error.message.includes('QUOTA')) {
        throw new StorageError('save', 'Storage quota exceeded');
      }
      throw new StorageError('save', error.message);
    }
  },

  /**
   * Get all examples from local storage
   * @returns {Promise<Array>} Array of example objects
   */
  async getExamples() {
    try {
      const result = await chrome.storage.local.get(CONSTANTS.STORAGE_KEYS.EXAMPLES);
      return result.examples || [];
    } catch (error) {
      console.error('Error getting examples:', error);
      return [];
    }
  },

  /**
   * Save examples to local storage
   * @param {Array} examples - Array of example objects
   */
  async setExamples(examples) {
    try {
      await chrome.storage.local.set({
        [CONSTANTS.STORAGE_KEYS.EXAMPLES]: examples
      });
    } catch (error) {
      throw new StorageError('save', error.message);
    }
  },

  /**
   * Add a new example
   * @param {Object} example - Example object
   */
  async addExample(example) {
    const examples = await this.getExamples();

    if (examples.length >= CONSTANTS.MAX_EXAMPLES) {
      throw new Error('Maximum examples reached');
    }

    examples.push(example);
    await this.setExamples(examples);
  },

  /**
   * Delete an example by ID
   * @param {string} id - Example ID
   */
  async deleteExample(id) {
    const examples = await this.getExamples();
    const filtered = examples.filter(ex => ex.id !== id);
    await this.setExamples(filtered);
  },

  /**
   * Get cache from local storage
   * @returns {Promise<Object>} Cache object
   */
  async getCache() {
    try {
      const result = await chrome.storage.local.get(CONSTANTS.STORAGE_KEYS.CACHE);
      return result.cache || {};
    } catch (error) {
      console.error('Error getting cache:', error);
      return {};
    }
  },

  /**
   * Save cache to local storage
   * @param {Object} cache - Cache object
   */
  async setCache(cache) {
    try {
      await chrome.storage.local.set({
        [CONSTANTS.STORAGE_KEYS.CACHE]: cache
      });
    } catch (error) {
      throw new StorageError('save', error.message);
    }
  },

  /**
   * Get default settings
   * @returns {Object} Default settings object
   */
  getDefaultSettings() {
    return {
      apiKey: '',
      model: 'claude-3-5-sonnet-20241022',
      systemPrompt: '',
      preferences: {
        autoSaveExamples: false,
        maxExamples: 10,
        showCharacterCount: true,
        useThreadContext: true
      }
    };
  }
};

export { StorageError };
