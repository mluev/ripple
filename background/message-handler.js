/**
 * @file message-handler.js
 * @description Handle messages from content scripts
 * @module background/message-handler
 */

import { storage } from '../utils/storage.js';
import { buildPrompt, parseAIResponse } from '../utils/prompt-builder.js';
import { ClaudeAPIClient, getAPIErrorMessage } from './api-client.js';
import { validateAPIKey } from '../utils/validation.js';

/**
 * Load model configuration
 * @param {string} modelId - Model ID
 * @returns {Promise<Object>} Model configuration
 */
async function getModelConfig(modelId) {
  try {
    const response = await fetch(chrome.runtime.getURL('config/models.json'));
    const data = await response.json();
    const model = data.models.find(m => m.id === modelId);

    if (!model) {
      throw new Error('Model not found');
    }

    return model.config;
  } catch (error) {
    console.error('Error loading model config:', error);
    throw error;
  }
}

/**
 * Handle reply generation request
 * @param {Object} tweetData - Tweet data
 * @param {Object} sender - Message sender
 * @param {Function} sendResponse - Response callback
 */
export async function handleGenerateReply(tweetData, sender, sendResponse) {
  try {
    // 1. Validate tweet data
    if (!tweetData || !tweetData.text) {
      throw new Error('Tweet data is required');
    }

    console.log('Generating reply for tweet:', tweetData.text.substring(0, 50));

    // 2. Get settings
    const settings = await storage.getSettings();

    if (!settings.apiKey) {
      throw new Error('API key not configured. Please add your API key in settings.');
    }

    // Validate API key
    validateAPIKey(settings.apiKey);

    // 3. Get examples
    const examples = await storage.getExamples();
    console.log(`Using ${examples.length} examples`);

    // 4. Load model config
    const modelConfig = await getModelConfig(settings.model);

    // 5. Build prompt
    const prompt = await buildPrompt(tweetData, settings, examples);
    console.log('Prompt built, length:', prompt.length);

    // 6. Create API client
    const client = new ClaudeAPIClient(settings.apiKey, modelConfig);

    // 7. Generate replies
    const responseText = await client.generateReplies(prompt);
    const replies = parseAIResponse(responseText);

    console.log(`Generated ${replies.length} replies`);

    // 8. Send success response
    sendResponse({
      success: true,
      replies: replies
    });

  } catch (error) {
    console.error('Error generating replies:', error);

    sendResponse({
      success: false,
      error: getAPIErrorMessage(error)
    });
  }
}

/**
 * Handle save example request
 * @param {Object} data - Example data
 * @param {Function} sendResponse - Response callback
 */
export async function handleSaveExample(data, sendResponse) {
  try {
    if (!data || !data.text) {
      throw new Error('Example text is required');
    }

    const example = {
      id: crypto.randomUUID(),
      text: data.text,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    await storage.addExample(example);

    const examples = await storage.getExamples();

    sendResponse({
      success: true,
      count: examples.length
    });

  } catch (error) {
    console.error('Error saving example:', error);

    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle delete example request
 * @param {Object} data - Data containing example ID
 * @param {Function} sendResponse - Response callback
 */
export async function handleDeleteExample(data, sendResponse) {
  try {
    if (!data || !data.id) {
      throw new Error('Example ID is required');
    }

    await storage.deleteExample(data.id);

    const examples = await storage.getExamples();

    sendResponse({
      success: true,
      count: examples.length
    });

  } catch (error) {
    console.error('Error deleting example:', error);

    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle get settings request
 * @param {Function} sendResponse - Response callback
 */
export async function handleGetSettings(sendResponse) {
  try {
    const settings = await storage.getSettings();
    const examples = await storage.getExamples();

    sendResponse({
      success: true,
      settings: settings,
      exampleCount: examples.length
    });

  } catch (error) {
    console.error('Error getting settings:', error);

    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle update settings request
 * @param {Object} data - New settings
 * @param {Function} sendResponse - Response callback
 */
export async function handleUpdateSettings(data, sendResponse) {
  try {
    if (!data || !data.settings) {
      throw new Error('Settings data is required');
    }

    await storage.setSettings(data.settings);

    sendResponse({
      success: true
    });

  } catch (error) {
    console.error('Error updating settings:', error);

    sendResponse({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle test API connection request
 * @param {Object} data - Data containing API key
 * @param {Function} sendResponse - Response callback
 */
export async function handleTestAPI(data, sendResponse) {
  try {
    if (!data || !data.apiKey) {
      throw new Error('API key is required');
    }

    validateAPIKey(data.apiKey);

    const modelConfig = await getModelConfig('claude-3-5-sonnet-20241022');
    const client = new ClaudeAPIClient(data.apiKey, modelConfig);

    await client.testConnection();

    sendResponse({
      success: true,
      message: 'API connection successful!'
    });

  } catch (error) {
    console.error('Error testing API:', error);

    sendResponse({
      success: false,
      error: getAPIErrorMessage(error)
    });
  }
}
