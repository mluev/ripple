/**
 * @file prompt-builder.js
 * @description Build AI prompts from tweet data, settings, and examples
 * @module utils/prompt-builder
 */

/**
 * Load default prompts from config
 * @returns {Promise<Object>} Default prompts configuration
 */
async function loadDefaultPrompts() {
  try {
    const response = await fetch(chrome.runtime.getURL('config/default-prompts.json'));
    return await response.json();
  } catch (error) {
    console.error('Error loading default prompts:', error);
    return {
      systemPrompt: 'You are helping write Twitter replies. Be natural and conversational.',
      instructions: 'Generate 3 reply variations. Separate with ---',
      exampleSection: '\n\nExamples:\n{examples}',
      contextSection: '\n\nTweet: "{text}" by @{author}'
    };
  }
}

/**
 * Format examples for prompt
 * @param {Array} examples - Array of example objects
 * @returns {string} Formatted examples section
 */
function formatExamples(examples) {
  if (!examples || examples.length === 0) {
    return '';
  }

  const exampleTexts = examples
    .slice(0, 10)
    .map((ex, i) => `${i + 1}. "${ex.text}"`)
    .join('\n');

  return exampleTexts;
}

/**
 * Format tweet context for prompt
 * @param {Object} tweetData - Tweet data object
 * @param {Object} templates - Prompt templates
 * @returns {string} Formatted context section
 */
function formatTweetContext(tweetData, templates) {
  let context = templates.contextSection
    .replace('{text}', tweetData.text)
    .replace('{author}', tweetData.author || 'unknown');

  // Add thread context if available
  if (tweetData.threadContext && tweetData.threadContext.length > 0) {
    const threadText = tweetData.threadContext
      .map(tweet => `- "${tweet.text}"`)
      .join('\n');
    context += `\n\nThread context:\n${threadText}`;
  }

  return context;
}

/**
 * Build complete AI prompt
 * @param {Object} tweetData - Tweet data
 * @param {Object} settings - User settings
 * @param {Array} examples - User examples
 * @returns {Promise<string>} Complete prompt
 */
export async function buildPrompt(tweetData, settings, examples) {
  const templates = await loadDefaultPrompts();

  const sections = [];

  // 1. System prompt (use custom or default)
  const systemPrompt = settings.systemPrompt || templates.systemPrompt;
  sections.push(systemPrompt);

  // 2. Examples section (if any)
  if (examples && examples.length > 0) {
    const examplesText = formatExamples(examples);
    const exampleSection = templates.exampleSection.replace('{examples}', examplesText);
    sections.push(exampleSection);
  }

  // 3. Tweet context
  const context = formatTweetContext(tweetData, templates);
  sections.push(context);

  // 4. Instructions
  sections.push(templates.instructions);

  return sections.join('\n\n');
}

/**
 * Parse AI response into reply variations
 * @param {string} responseText - AI response text
 * @returns {Array<string>} Array of reply variations
 */
export function parseAIResponse(responseText) {
  // Split by separator
  const replies = responseText
    .split('---')
    .map(r => r.trim())
    .filter(r => r.length > 0);

  // Ensure we have at least 1 reply
  if (replies.length === 0) {
    throw new Error('No replies generated');
  }

  // Return up to 3 replies
  return replies.slice(0, 3);
}
