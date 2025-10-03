# Development Plan & Implementation Roadmap

## Project Timeline Overview

**Total Estimated Time:** 8-12 weeks  
**Team Size:** 1-2 developers  
**Phases:** 4 major phases with 40+ tasks

---

## Phase 1: Foundation & Setup (Week 1-2)

**Goal:** Set up project structure, basic extension skeleton, and development environment

### Task 1.1: Project Initialization
**Estimated Time:** 2 hours  
**Priority:** Critical  

**Steps:**
1. Create project directory structure
2. Initialize git repository
3. Create `.gitignore` file
4. Set up package.json
5. Create README.md with setup instructions

**Acceptance Criteria:**
- [ ] All folders match ARCHITECTURE.md structure
- [ ] Git repository initialized
- [ ] Basic documentation present

**Files to Create:**
```
smart-reply-extension/
├── manifest.json
├── package.json
├── .gitignore
├── README.md
└── [all folders from ARCHITECTURE.md]
```

---

### Task 1.2: Create Manifest File
**Estimated Time:** 1 hour  
**Priority:** Critical  

**Steps:**
1. Create manifest.json in root
2. Define extension metadata (name, version, description)
3. Configure permissions (storage, activeTab)
4. Set host permissions for twitter.com and x.com
5. Configure background service worker
6. Configure content scripts
7. Set up extension popup
8. Add extension icons

**Acceptance Criteria:**
- [ ] Valid Manifest V3 format
- [ ] All required permissions listed
- [ ] Loads without errors in chrome://extensions

**Code Template:**
```json
{
  "manifest_version": 3,
  "name": "Smart Reply - AI Twitter Assistant",
  "version": "1.0.0",
  "description": "Generate personalized AI replies for Twitter",
  "permissions": ["storage", "activeTab"],
  "host_permissions": [
    "https://twitter.com/*",
    "https://x.com/*"
  ],
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "content_scripts": [
    {
      "matches": ["https://twitter.com/*", "https://x.com/*"],
      "js": ["content/content-script.js"],
      "css": ["content/styles/modal.css", "content/styles/button.css"]
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "assets/icons/icon16.png",
      "48": "assets/icons/icon48.png",
      "128": "assets/icons/icon128.png"
    }
  },
  "options_page": "settings/settings.html",
  "icons": {
    "16": "assets/icons/icon16.png",
    "48": "assets/icons/icon48.png",
    "128": "assets/icons/icon128.png"
  }
}
```

---

### Task 1.3: Create Configuration Files
**Estimated Time:** 2 hours  
**Priority:** High  

**Steps:**
1. Create config/models.json with Claude configuration
2. Create config/default-prompts.json with system prompts
3. Create config/twitter-selectors.json with DOM selectors
4. Create utils/constants.js with app constants

**Acceptance Criteria:**
- [ ] All config files are valid JSON
- [ ] Default prompts are well-written
- [ ] Constants are properly organized

**Files:**

**config/models.json:**
```json
{
  "models": [
    {
      "id": "claude-3.5-sonnet",
      "name": "Claude 3.5 Sonnet",
      "provider": "anthropic",
      "enabled": true,
      "config": {
        "endpoint": "https://api.anthropic.com/v1/messages",
        "model": "claude-3-5-sonnet-20241022",
        "maxTokens": 500,
        "temperature": 0.8,
        "apiVersion": "2023-06-01"
      }
    }
  ]
}
```

**config/default-prompts.json:**
```json
{
  "systemPrompt": "You are helping a user write Twitter replies. Generate natural, conversational responses that sound authentically human. Match the user's writing style from the provided examples. Be concise, engaging, and relevant. Avoid generic phrases like 'great question!' or 'interesting point!' that sound robotic. Each reply should feel personal and genuine.",
  
  "instructions": "Generate 3 different variations of a reply to this tweet. Each should:\n- Be unique in approach but match the user's style\n- Stay under 280 characters\n- Be conversational and natural\n- Not sound like AI\n\nSeparate the 3 replies with '---' on a new line.",
  
  "exampleSection": "\n\n[YOUR WRITING STYLE - EXAMPLES]\nHere are examples of how you typically write on Twitter:\n\n{examples}\n\nMatch this tone, style, and personality in your replies.",
  
  "contextSection": "\n\n[TWEET TO REPLY TO]\nAuthor: @{author}\nTweet: \"{text}\"\n\n{threadContext}"
}
```

**config/twitter-selectors.json:**
```json
{
  "replyBox": [
    "[data-testid='tweetTextarea_0']",
    "[data-testid='tweetTextarea']",
    ".DraftEditor-editorContainer"
  ],
  "replyButton": [
    "[data-testid='reply']",
    "[aria-label*='Reply']"
  ],
  "tweetText": [
    "[data-testid='tweetText']",
    ".css-1dbjc4n.r-1loqt21"
  ],
  "tweetAuthor": [
    "[data-testid='User-Name']",
    ".css-1dbjc4n.r-1awozwy"
  ],
  "composerToolbar": [
    "[data-testid='toolBar']",
    ".css-1dbjc4n.r-kemksi"
  ]
}
```

**utils/constants.js:**
```javascript
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
    GET_SETTINGS: 'get-settings',
    UPDATE_SETTINGS: 'update-settings',
    SETTINGS_UPDATED: 'settings-updated'
  },
  
  // States
  BUTTON_STATES: {
    DEFAULT: 'default',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
  }
};
```

---

### Task 1.4: Create Utility Modules
**Estimated Time:** 4 hours  
**Priority:** High  

**Steps:**
1. Create utils/storage.js - Chrome storage wrapper
2. Create utils/validation.js - Input validation functions
3. Create utils/crypto.js - Encryption utilities for API key
4. Create utils/logger.js - Debug logging (optional)

**Acceptance Criteria:**
- [ ] Storage wrapper handles all Chrome storage operations
- [ ] Validation functions cover all input types
- [ ] Encryption properly secures API key
- [ ] All functions have JSDoc comments

**Files:**

**utils/storage.js:**
```javascript
/**
 * Storage utility wrapper for Chrome Storage API
 * @module utils/storage
 */

import { CONSTANTS } from './constants.js';

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
      await chrome.storage.sync.set({ 
        [CONSTANTS.STORAGE_KEYS.SETTINGS]: settings 
      });
    } catch (error) {
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
      throw new ValidationError('examples', 'Maximum examples reached');
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
   * Get default settings
   * @returns {Object} Default settings object
   */
  getDefaultSettings() {
    return {
      apiKey: '',
      model: 'claude-3.5-sonnet',
      systemPrompt: '', // Will be loaded from config
      preferences: {
        autoSaveExamples: false,
        maxExamples: 10,
        showCharacterCount: true,
        useThreadContext: true
      }
    };
  }
};

class StorageError extends Error {
  constructor(operation, message) {
    super(message);
    this.name = 'StorageError';
    this.operation = operation;
  }
}

class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}
```

---

## Phase 2: Core Functionality (Week 3-5)

**Goal:** Implement AI reply generation, button injection, and modal display

### Task 2.1: Tweet Parser Module
**Estimated Time:** 4 hours  
**Priority:** Critical  

**Steps:**
1. Create content/parsers/tweet-parser.js
2. Implement extractTweetData() function
3. Implement extractTweetAuthor() function
4. Implement extractThreadContext() function (optional)
5. Handle different Twitter DOM structures
6. Add error handling for missing elements

**Acceptance Criteria:**
- [ ] Extracts tweet text correctly
- [ ] Extracts author information
- [ ] Handles missing elements gracefully
- [ ] Works on both twitter.com and x.com

**Code Structure:**
```javascript
/**
 * Extract tweet data from Twitter's DOM
 * @param {HTMLElement} tweetElement - Tweet container element
 * @returns {Object} Tweet data
 */
export function extractTweetData(tweetElement) {
  // Implementation
  return {
    text: '',
    author: '',
    authorHandle: '',
    id: '',
    timestamp: ''
  };
}
```

---

### Task 2.2: Button Injection System
**Estimated Time:** 6 hours  
**Priority:** Critical  

**Steps:**
1. Create content/ui/button-injector.js
2. Set up MutationObserver to detect reply boxes
3. Create AI button element with proper styling
4. Inject button into Twitter's composer toolbar
5. Add event listener for button clicks
6. Handle multiple reply boxes on same page
7. Remove buttons when reply box closes

**Acceptance Criteria:**
- [ ] Button appears when reply box opens
- [ ] Button matches Twitter's design
- [ ] Only one button per reply box
- [ ] Button disappears when reply box closes
- [ ] Click triggers reply generation

**Code Structure:**
```javascript
/**
 * Initialize button injection system
 */
export function initButtonInjection() {
  observeDOM();
}

/**
 * Observe DOM for reply boxes
 */
function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    // Check for reply boxes
    // Inject button if needed
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Create and inject AI button
 * @param {HTMLElement} container - Container to inject button into
 */
function injectButton(container) {
  // Create button element
  // Style according to DESIGN_SYSTEM.md
  // Add event listeners
  // Inject into DOM
}
```

---

### Task 2.3: Background Service Worker Setup
**Estimated Time:** 3 hours  
**Priority:** Critical  

**Steps:**
1. Create background/service-worker.js
2. Set up message listener
3. Create message routing logic
4. Add error handling
5. Test message passing between content and background

**Acceptance Criteria:**
- [ ] Receives messages from content script
- [ ] Routes messages to correct handlers
- [ ] Sends responses back to content script
- [ ] Handles errors gracefully

**Code Structure:**
```javascript
/**
 * Background Service Worker
 * Handles API calls and business logic
 */

import { CONSTANTS } from '../utils/constants.js';

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Validate message
  if (!message || !message.action) {
    sendResponse({ success: false, error: 'Invalid message' });
    return true;
  }

  // Route to handler
  handleMessage(message, sender, sendResponse);
  
  return true; // Keep channel open for async response
});

async function handleMessage(message, sender, sendResponse) {
  try {
    switch (message.action) {
      case CONSTANTS.MESSAGE_ACTIONS.GENERATE_REPLY:
        await handleGenerateReply(message.data, sender, sendResponse);
        break;
      
      case CONSTANTS.MESSAGE_ACTIONS.SAVE_EXAMPLE:
        await handleSaveExample(message.data, sendResponse);
        break;
      
      default:
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
```

---

### Task 2.4: Prompt Builder Module
**Estimated Time:** 4 hours  
**Priority:** Critical  

**Steps:**
1. Create utils/prompt-builder.js
2. Implement buildPrompt() function
3. Load default prompts from config
4. Insert system prompt
5. Insert examples section (if examples exist)
6. Insert tweet context
7. Add instructions for 3 variations
8. Handle token limits

**Acceptance Criteria:**
- [ ] Generates valid prompt for Claude
- [ ] Includes all necessary sections
- [ ] Properly formats examples
- [ ] Stays within token limits
- [ ] Uses templates from config

**Code Structure:**
```javascript
/**
 * Build AI prompt from components
 * @param {Object} tweetData - Tweet data
 * @param {Object} settings - User settings
 * @param {Array} examples - User examples
 * @returns {string} Complete prompt
 */
export function buildPrompt(tweetData, settings, examples) {
  const sections = [];
  
  // 1. System prompt
  sections.push(settings.systemPrompt);
  
  // 2. Examples (if any)
  if (examples.length > 0) {
    sections.push(formatExamples(examples));
  }
  
  // 3. Tweet context
  sections.push(formatTweetContext(tweetData));
  
  // 4. Instructions
  sections.push(getInstructions());
  
  return sections.join('\n\n');
}

function formatExamples(examples) {
  // Format examples section
}

function formatTweetContext(tweetData) {
  // Format tweet context
}
```

---

### Task 2.5: Claude API Client
**Estimated Time:** 5 hours  
**Priority:** Critical  

**Steps:**
1. Create background/api-client.js
2. Implement ClaudeAPIClient class
3. Add authentication with API key
4. Implement generateReplies() method
5. Add request timeout handling
6. Add retry logic
7. Handle API errors (401, 429, 500, etc.)
8. Parse API response

**Acceptance Criteria:**
- [ ] Successfully calls Claude API
- [ ] Handles authentication
- [ ] Implements timeout (30s)
- [ ] Retries once on failure
- [ ] Returns parsed replies
- [ ] Handles all error codes

**Code Structure:**
```javascript
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
   * @returns {Promise<Array>} Array of 3 replies
   */
  async generateReplies(prompt) {
    const response = await this.makeRequest(prompt);
    return this.parseResponse(response);
  }

  async makeRequest(prompt, retryCount = 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

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
          messages: [{
            role: 'user',
            content: prompt
          }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new APIError(response.status, await response.text());
      }

      return await response.json();
      
    } catch (error) {
      if (retryCount < 1 && !error.name === 'AbortError') {
        // Retry once
        return this.makeRequest(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  parseResponse(response) {
    // Extract text from response
    const text = response.content[0].text;
    
    // Split by separator
    const replies = text.split('---')
      .map(r => r.trim())
      .filter(r => r.length > 0);
    
    // Ensure we have 3 replies
    if (replies.length < 3) {
      throw new Error('API did not return 3 variations');
    }
    
    return replies.slice(0, 3);
  }
}

class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}
```

---

### Task 2.6: Reply Generation Handler
**Estimated Time:** 4 hours  
**Priority:** Critical  

**Steps:**
1. Create background/message-handler.js
2. Implement handleGenerateReply() function
3. Fetch settings and examples from storage
4. Build prompt using prompt-builder
5. Call API client
6. Handle errors
7. Send response back to content script

**Acceptance Criteria:**
- [ ] Fetches all required data
- [ ] Builds correct prompt
- [ ] Calls API successfully
- [ ] Returns 3 reply variations
- [ ] Handles all errors with user-friendly messages

**Code Structure:**
```javascript
/**
 * Handle reply generation request
 */
export async function handleGenerateReply(tweetData, sender, sendResponse) {
  try {
    // 1. Validate tweet data
    if (!tweetData || !tweetData.text) {
      throw new ValidationError('tweetData', 'Tweet data is required');
    }

    // 2. Get settings
    const settings = await storage.getSettings();
    
    if (!settings.apiKey) {
      throw new ValidationError('apiKey', 'API key not configured');
    }

    // 3. Get examples
    const examples = await storage.getExamples();

    // 4. Load model config
    const modelConfig = await getModelConfig(settings.model);

    // 5. Build prompt
    const prompt = buildPrompt(tweetData, settings, examples);

    // 6. Create API client
    const client = new ClaudeAPIClient(settings.apiKey, modelConfig);

    // 7. Generate replies
    const replies = await client.generateReplies(prompt);

    // 8. Send success response
    sendResponse({
      success: true,
      replies: replies
    });

  } catch (error) {
    console.error('Error generating replies:', error);
    
    // Send error response with user-friendly message
    sendResponse({
      success: false,
      error: getUserFriendlyError(error)
    });
  }
}
```

---

### Task 2.7: Reply Modal Component
**Estimated Time:** 6 hours  
**Priority:** Critical  

**Steps:**
1. Create content/ui/modal-controller.js
2. Create modal HTML structure dynamically
3. Apply styles from DESIGN_SYSTEM.md
4. Display 3 reply variations
5. Show character count for each
6. Highlight replies over 280 characters
7. Handle user selection
8. Implement "Use This Reply" functionality
9. Add close button and overlay click
10. Add animation (fade in/slide up)

**Acceptance Criteria:**
- [ ] Modal appears centered on screen
- [ ] Shows all 3 variations
- [ ] Character count accurate
- [ ] User can select a reply
- [ ] Selected reply inserts into Twitter's reply box
- [ ] Modal closes after selection
- [ ] Matches design system

**Code Structure:**
```javascript
/**
 * Show reply modal with variations
 * @param {Array} replies - Array of 3 reply strings
 * @param {HTMLElement} replyBox - Twitter's reply textarea
 */
export function showReplyModal(replies, replyBox) {
  // 1. Create modal structure
  const modal = createModalElement(replies);
  
  // 2. Add to DOM
  document.body.appendChild(modal);
  
  // 3. Add event listeners
  addModalEventListeners(modal, replyBox);
  
  // 4. Show with animation
  requestAnimationFrame(() => {
    modal.classList.add('modal--visible');
  });
}

function createModalElement(replies) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">AI Reply Suggestions</h2>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        ${replies.map((reply, index) => createReplyCard(reply, index)).join('')}
      </div>
      <div class="modal-footer">
        <button class="button-secondary" data-action="regenerate">
          ↻ Regenerate All
        </button>
        <button class="button-secondary" data-action="cancel">
          Cancel
        </button>
      </div>
    </div>
  `;
  return modal;
}

function createReplyCard(reply, index) {
  const charCount = reply.length;
  const isOver = charCount > 280;
  
  return `
    <div class="reply-card" data-index="${index}">
      <div class="reply-card__header">
        <span class="reply-card__label">Reply ${index + 1}</span>
        <span class="reply-card__count ${isOver ? 'reply-card__count--over' : ''}">
          ${charCount}
        </span>
      </div>
      <div class="reply-card__text">${escapeHtml(reply)}</div>
      <div class="reply-card__actions">
        <button class="button-primary" data-action="use" data-index="${index}">
          Use This Reply
        </button>
        <button class="button-secondary" data-action="save" data-index="${index}">
          Save as Example
        </button>
      </div>
    </div>
  `;
}
```

---

### Task 2.8: Insert Reply into Twitter
**Estimated Time:** 3 hours  
**Priority:** Critical  

**Steps:**
1. Find Twitter's reply textarea
2. Set value programmatically
3. Trigger React events (input, change)
4. Update character count
5. Focus cursor at end of text
6. Handle different Twitter DOM structures

**Acceptance Criteria:**
- [ ] Text appears in reply box
- [ ] Twitter's UI updates (character count, etc.)
- [ ] Cursor positioned at end
- [ ] Works on both twitter.com and x.com

**Code Structure:**
```javascript
/**
 * Insert text into Twitter's reply box
 * @param {string} text - Text to insert
 * @param {HTMLElement} replyBox - Reply textarea element
 */
export function insertTextIntoReply(text, replyBox) {
  // Method 1: Try direct value set
  try {
    replyBox.value = text;
    replyBox.textContent = text;
    
    // Trigger React events
    triggerReactEvents(replyBox, text);
    
    // Focus and position cursor
    replyBox.focus();
    setCursorToEnd(replyBox);
    
  } catch (error) {
    console.error('Failed to insert text:', error);
    // Fallback: manual insertion
  }
}

function triggerReactEvents(element, text) {
  // Input event
  const inputEvent = new Event('input', { bubbles: true });
  element.dispatchEvent(inputEvent);
  
  // Change event
  const changeEvent = new Event('change', { bubbles: true });
  element.dispatchEvent(changeEvent);
}
```

---

## Phase 3: Settings & Examples (Week 6-7)

**Goal:** Complete settings page and example management

### Task 3.1: Settings Page HTML/CSS
**Estimated Time:** 4 hours  
**Priority:** High  

**Steps:**
1. Create settings/settings.html
2. Create settings/styles/settings.css
3. Build API configuration section
4. Build system prompt editor section
5. Build example management section
6. Add save buttons
7. Apply design system styles

**Acceptance Criteria:**
- [ ] All sections present and styled
- [ ] Matches DESIGN_SYSTEM.md specifications
- [ ] Responsive layout
- [ ] Accessible (ARIA attributes)

---

### Task 3.2: Settings Page Logic
**Estimated Time:** 5 hours  
**Priority:** High  

**Steps:**
1. Create settings/settings.js
2. Load current settings on page load
3. Implement API key input with show/hide
4. Implement model dropdown (prepared for future)
5. Implement system prompt editor
6. Add "Test Connection" button
7. Add "Reset to Default" button
8. Implement auto-save with feedback

**Acceptance Criteria:**
- [ ] Settings load correctly
- [ ] All inputs functional
- [ ] Test connection works
- [ ] Settings save successfully
- [ ] Shows "Saved!" feedback

---

### Task 3.3: Example Manager Component
**Estimated Time:** 6 hours  
**Priority:** High  

**Steps:**
1. Create settings/components/example-manager.js
2. Display list of saved examples
3. Implement "Add Example" functionality
4. Implement inline editing
5. Implement delete with confirmation
6. Show usage count for each example
7. Add search/filter functionality (optional)

**Acceptance Criteria:**
- [ ] Lists all examples
- [ ] Can add new examples
- [ ] Can edit existing examples
- [ ] Can delete examples with confirmation
- [ ] Updates storage correctly

---

### Task 3.4: Save Example Feature
**Estimated Time:** 3 hours  
**Priority:** Medium  

**Steps:**
1. Add "Save as Example" button to modal
2. Implement save handler in content script
3. Send message to background to save
4. Implement handleSaveExample in background
5. Generate unique ID for example
6. Store in Chrome local storage
7. Show success notification

**Acceptance Criteria:**
- [ ] Button appears in modal
- [ ] Saves example to storage
- [ ] Shows success feedback
- [ ] Example appears in settings

---

### Task 3.5: API Key Encryption
**Estimated Time:** 3 hours  
**Priority:** High  

**Steps:**
1. Implement encryption in utils/crypto.js
2. Use Web Crypto API
3. Encrypt before storing API key
4. Decrypt when loading API key
5. Never log API key
6. Clear from memory after use

**Acceptance Criteria:**
- [ ] API key encrypted in storage
- [ ] Decrypts correctly
- [ ] No plaintext API key in storage
- [ ] No API key in logs

---

## Phase 4: Polish & Features (Week 8-10)

**Goal:** Add polish, error handling, and nice-to-have features

### Task 4.1: Loading States & Animations
**Estimated Time:** 4 hours  
**Priority:** Medium  

**Steps:**
1. Add spinner to button during generation
2. Add skeleton loaders to modal
3. Add fade in/out animations
4. Add slide up animation for modal
5. Add hover effects to buttons
6. Add transition for all state changes

**Acceptance Criteria:**
- [ ] Smooth animations throughout
- [ ] Loading states clear and visible
- [ ] No jarring transitions
- [ ] Matches design system

---

### Task 4.2: Error Handling & User Feedback
**Estimated Time:** 4 hours  
**Priority:** High  

**Steps:**
1. Create notification system (toasts)
2. Add error messages for all failure scenarios
3. Add success messages for completed actions
4. Handle API errors gracefully
5. Show helpful troubleshooting hints

**Acceptance Criteria:**
- [ ] All errors have user-friendly messages
- [ ] Toasts appear for all major actions
- [ ] Errors suggest solutions
- [ ] No silent failures

---

### Task 4.3: Regenerate Functionality
**Estimated Time:** 3 hours  
**Priority:** Medium  

**Steps:**
1. Add "Regenerate" button to modal
2. Clear current replies
3. Show loading state
4. Make new API call with same context
5. Update modal with new replies
6. Limit regenerations (prevent spam)

**Acceptance Criteria:**
- [ ] Regenerate button works
- [ ] Shows loading state
- [ ] Updates with new replies
- [ ] Doesn't allow infinite regenerations

---

### Task 4.4: Extension Popup
**Estimated Time:** 3 hours  
**Priority:** Low  

**Steps:**
1. Create popup/popup.html
2. Create popup/popup.js
3. Show connection status
4. Show current model
5. Show example count
6. Add link to settings
7. Add link to help/docs

**Acceptance Criteria:**
- [ ] Shows extension status
- [ ] Links work correctly
- [ ] Updates in real-time
- [ ] Clean, minimal UI

---

### Task 4.5: Character Count Indicator
**Estimated Time:** 2 hours  
**Priority:** Low  

**Steps:**
1. Add character counter to each reply card
2. Calculate length correctly (handle emoji, etc.)
3. Highlight when over 280
4. Show warning icon for over-limit replies

**Acceptance Criteria:**
- [ ] Accurate character count
- [ ] Handles emoji correctly
- [ ] Clear visual indicator for over-limit
- [ ] Updates dynamically

---

### Task 4.6: Keyboard Shortcuts
**Estimated Time:** 3 hours  
**Priority:** Low  

**Steps:**
1. Add keyboard support to modal
2. Number keys (1, 2, 3) to select replies
3. Escape key to close modal
4. Enter key to use first reply
5. R key to regenerate

**Acceptance Criteria:**
- [ ] All shortcuts work
- [ ] Doesn't conflict with Twitter's shortcuts
- [ ] Visual indication of shortcuts
- [ ] Can disable in settings

---

### Task 4.7: Thread Context (Optional)
**Estimated Time:** 4 hours  
**Priority:** Low  

**Steps:**
1. Detect if tweet is part of thread
2. Traverse up to get previous tweets
3. Include thread context in prompt
4. Limit depth (last 3 tweets)
5. Handle broken threads

**Acceptance Criteria:**
- [ ] Detects threads correctly
- [ ] Extracts thread context
- [ ] Improves reply relevance
- [ ] Doesn't slow down generation

---

## Phase 5: Testing & Deployment (Week 11-12)

### Task 5.1: Manual Testing
**Estimated Time:** 8 hours  
**Priority:** Critical  

**Test Scenarios:**
1. Fresh install - first time setup
2. Reply generation - all tweet types
3. Example management - CRUD operations
4. Settings - all configurations
5. Error scenarios - API errors, network issues
6. Edge cases - very long tweets, emoji, special characters
7. Performance - fast interactions, no lag
8. Mobile view - responsive design

**Acceptance Criteria:**
- [ ] All scenarios pass
- [ ] No console errors
- [ ] Smooth user experience
- [ ] Works on different screen sizes

---

### Task 5.2: Cross-Browser Testing
**Estimated Time:** 4 hours  
**Priority:** High  

**Test On:**
1. Chrome (latest)
2. Chrome (one version back)
3. Edge (latest)
4. Firefox (latest) - may need minor adjustments

**Acceptance Criteria:**
- [ ] Works on Chrome
- [ ] Works on Edge
- [ ] Works on Firefox (or documented issues)
- [ ] No browser-specific bugs

---

### Task 5.3: Performance Optimization
**Estimated Time:** 4 hours  
**Priority:** Medium  

**Steps:**
1. Profile extension with Chrome DevTools
2. Optimize DOM queries
3. Reduce bundle size
4. Cache frequently accessed data
5. Debounce expensive operations
6. Minimize reflows/repaints

**Acceptance Criteria:**
- [ ] Button injection < 100ms
- [ ] Modal opens < 200ms
- [ ] API response processed < 50ms
- [ ] No memory leaks

---

### Task 5.4: Documentation
**Estimated Time:** 6 hours  
**Priority:** High  

**Documents to Create:**
1. README.md - Project overview, installation
2. USER_GUIDE.md - How to use the extension
3. SETUP.md - Development setup
4. CHANGELOG.md - Version history
5. LICENSE - Choose appropriate license

**Acceptance Criteria:**
- [ ] All docs complete
- [ ] Clear, concise language
- [ ] Screenshots where helpful
- [ ] Easy to follow

---

### Task 5.5: Package for Chrome Web Store
**Estimated Time:** 3 hours  
**Priority:** Critical  

**Steps:**
1. Create extension icons (16, 48, 128)
2. Create promotional images
3. Write store description
4. Create privacy policy
5. Zip extension files
6. Test zip locally
7. Create developer account
8. Submit for review

**Acceptance Criteria:**
- [ ] All required assets created
- [ ] Store listing complete
- [ ] Privacy policy published
- [ ] Extension zip valid

---

### Task 5.6: Post-Launch Monitoring
**Estimated Time:** Ongoing  
**Priority:** Medium  

**Steps:**
1. Monitor user feedback
2. Track error reports
3. Watch for Twitter DOM changes
4. Plan updates and fixes
5. Respond to reviews

**Acceptance Criteria:**
- [ ] Monitoring system in place
- [ ] Quick response to critical issues
- [ ] Regular updates planned

---

## Summary of Task Priorities

### Critical Path (Must Complete for MVP):
1. ✅ Project setup
2. ✅ Manifest file
3. ✅ Tweet parser
4. ✅ Button injection
5. ✅ Background service worker
6. ✅ Prompt builder
7. ✅ API client
8. ✅ Reply generation handler
9. ✅ Modal display
10. ✅ Insert reply into Twitter
11. ✅ Settings page
12. ✅ Example management
13. ✅ Testing
14. ✅ Deployment

### High Priority (Important for Quality):
- Error handling
- API key encryption
- Settings persistence
- Loading states
- Cross-browser testing

### Medium Priority (Nice to Have):
- Regenerate functionality
- Character count
- Thread context
- Performance optimization

### Low Priority (Future Enhancements):
- Keyboard shortcuts
- Extension popup
- Advanced analytics
- Multi-language support

---

## Resource Allocation

**Week 1-2:** Foundation (1 developer)
- Set up project structure
- Create configuration files
- Build utility modules

**Week 3-5:** Core Features (1-2 developers)
- Implement main functionality
- API integration
- UI components

**Week 6-7:** Settings & Polish (1 developer)
- Settings page
- Example management
- UI refinements

**Week 8-10:** Testing & Optimization (1-2 developers)
- Thorough testing
- Bug fixes
- Performance tuning

**Week 11-12:** Launch (1 developer)
- Documentation
- Store submission
- Initial support

---

## Success Metrics

**Technical:**
- [ ] 0 critical bugs
- [ ] < 5 minor bugs
- [ ] 95%+ API success rate
- [ ] < 5s average generation time

**User Experience:**
- [ ] 4+ star rating
- [ ] 70%+ users save examples
- [ ] 80%+ replies used without editing
- [ ] < 5% uninstall rate

**Performance:**
- [ ] Button injection < 100ms
- [ ] Modal render < 200ms
- [ ] No memory leaks
- [ ] Works on 1000+ tweets/day

---

## Risk Mitigation

**Risk 1: Twitter DOM Changes**
- Mitigation: Flexible selectors, quick update process
- Monitoring: Check for DOM changes weekly

**Risk 2: API Rate Limits**
- Mitigation: Queue requests, show warnings
- Monitoring: Track API usage patterns

**Risk 3: Poor Reply Quality**
- Mitigation: Good default prompt, regenerate option
- Monitoring: User feedback, example adoption

**Risk 4: Extension Approval Delays**
- Mitigation: Submit early, have backup timeline
- Monitoring: Regular status checks

---

This comprehensive plan breaks down the entire project into actionable tasks. Start with Phase 1, complete each task sequentially, and check off items as you progress. The plan is designed to be handed to an AI or developer for systematic implementation.
