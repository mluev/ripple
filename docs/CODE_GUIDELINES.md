# Code Guidelines & Standards

## Table of Contents
1. [General Principles](#general-principles)
2. [JavaScript/TypeScript Style](#javascripttypescript-style)
3. [Naming Conventions](#naming-conventions)
4. [File Organization](#file-organization)
5. [Code Structure](#code-structure)
6. [Error Handling](#error-handling)
7. [Documentation](#documentation)
8. [Testing Guidelines](#testing-guidelines)
9. [Performance Guidelines](#performance-guidelines)
10. [Security Guidelines](#security-guidelines)

---

## General Principles

### 1. Code Quality Standards
- **Write self-documenting code**: Names should explain purpose
- **Keep functions small**: Max 50 lines, ideally 20 or less
- **Single Responsibility**: Each function does one thing well
- **DRY (Don't Repeat Yourself)**: Extract common logic
- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions

### 2. Code Reviews Checklist
- [ ] Follows naming conventions
- [ ] Includes error handling
- [ ] Has appropriate comments
- [ ] No console.logs in production
- [ ] No hardcoded values
- [ ] Passes linting
- [ ] Works in all scenarios

---

## JavaScript/TypeScript Style

### Formatting Rules

```javascript
// ✅ GOOD: Use 2-space indentation
function example() {
  if (condition) {
    doSomething();
  }
}

// ❌ BAD: Inconsistent indentation
function example() {
    if (condition) {
      doSomething();
    }
}
```

### Semicolons
```javascript
// ✅ GOOD: Always use semicolons
const value = getData();
processValue(value);

// ❌ BAD: Missing semicolons
const value = getData()
processValue(value)
```

### Quotes
```javascript
// ✅ GOOD: Use single quotes for strings
const message = 'Hello world';
const html = '<div class="container"></div>';

// ✅ GOOD: Use template literals for interpolation
const greeting = `Hello ${name}`;

// ❌ BAD: Unnecessary template literals
const message = `Hello world`;
```

### Variables

```javascript
// ✅ GOOD: Use const by default
const API_KEY = getAPIKey();
const userData = fetchUserData();

// ✅ GOOD: Use let when reassignment needed
let counter = 0;
counter++;

// ❌ BAD: Never use var
var value = 123; // Don't do this
```

### Functions

```javascript
// ✅ GOOD: Arrow functions for short operations
const double = (x) => x * 2;
const filter = (arr) => arr.filter((x) => x > 0);

// ✅ GOOD: Traditional functions for complex logic
function processUserData(user) {
  // Validate
  if (!user.id) {
    throw new ValidationError('id', 'User ID is required');
  }
  
  // Process
  const processed = {
    id: user.id,
    name: user.name.trim(),
    email: user.email.toLowerCase()
  };
  
  return processed;
}

// ✅ GOOD: Async/await over promises
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    handleError(error);
  }
}

// ❌ BAD: Promise chains when async/await is clearer
function fetchData() {
  return fetch(url)
    .then(response => response.json())
    .then(data => processData(data))
    .catch(error => handleError(error));
}
```

### Objects and Arrays

```javascript
// ✅ GOOD: Use object shorthand
const name = 'John';
const age = 30;
const user = { name, age };

// ✅ GOOD: Use destructuring
const { id, title } = tweet;
const [first, second] = array;

// ✅ GOOD: Use spread operator
const newUser = { ...user, active: true };
const newArray = [...oldArray, newItem];

// ❌ BAD: Manual property assignment
const user = {
  name: name,
  age: age
};
```

### Conditional Statements

```javascript
// ✅ GOOD: Early returns
function validate(data) {
  if (!data) return false;
  if (!data.id) return false;
  if (!data.name) return false;
  return true;
}

// ❌ BAD: Nested conditions
function validate(data) {
  if (data) {
    if (data.id) {
      if (data.name) {
        return true;
      }
    }
  }
  return false;
}

// ✅ GOOD: Use ternary for simple conditions
const status = isActive ? 'active' : 'inactive';

// ❌ BAD: Ternary for complex conditions
const message = user.isAdmin ? 
  user.hasPermission ? 
    'Full access' : 
    'Limited access' : 
  'No access';
```

---

## Naming Conventions

### Variables and Functions

```javascript
// ✅ GOOD: camelCase for variables and functions
const userName = 'John';
const apiResponse = fetchData();
function getUserProfile() { }
function calculateTotalPrice() { }

// ❌ BAD: Inconsistent naming
const user_name = 'John';  // snake_case
const APIResponse = {};     // PascalCase for non-class
```

### Constants

```javascript
// ✅ GOOD: UPPER_SNAKE_CASE for true constants
const MAX_RETRIES = 3;
const API_ENDPOINT = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;

// ✅ GOOD: Configuration objects in camelCase
const config = {
  maxRetries: 3,
  apiEndpoint: 'https://api.example.com',
  defaultTimeout: 5000
};
```

### Classes

```javascript
// ✅ GOOD: PascalCase for classes
class APIClient { }
class UserManager { }
class TweetParser { }

// ✅ GOOD: Private properties with #
class User {
  #privateData;
  
  constructor(data) {
    this.#privateData = data;
  }
}
```

### Files

```javascript
// ✅ GOOD: kebab-case for file names
// content-script.js
// api-client.js
// tweet-parser.js
// modal-controller.js

// ❌ BAD: Other cases
// contentScript.js
// APIClient.js
// tweet_parser.js
```

### Booleans

```javascript
// ✅ GOOD: Use is/has/should prefixes
const isActive = true;
const hasPermission = false;
const shouldRender = true;
const canEdit = false;

// ❌ BAD: Unclear boolean names
const active = true;
const permission = false;
```

### Functions - Naming by Purpose

```javascript
// ✅ GOOD: Action verbs for functions
function fetchUserData() { }      // get from API
function createUser() { }         // create new
function updateSettings() { }     // modify existing
function deleteExample() { }      // remove
function validateInput() { }      // check validity
function parseResponse() { }      // transform data
function handleClick() { }        // event handler
function renderModal() { }        // display UI

// ✅ GOOD: get/set prefixes for getters/setters
function getAPIKey() { }
function setAPIKey(key) { }

// ✅ GOOD: calculate/compute for computations
function calculateTotal() { }
function computeScore() { }
```

---

## File Organization

### File Header Structure

```javascript
/**
 * @file tweet-parser.js
 * @description Extracts and structures tweet data from Twitter's DOM
 * @module content/parsers
 */

// --- Imports ---
import { DOM_SELECTORS } from '../../config/twitter-selectors.json';
import { log } from '../../utils/logger.js';

// --- Constants ---
const MAX_THREAD_DEPTH = 5;
const CACHE_DURATION = 60000; // 1 minute

// --- Main Code ---
```

### Import Order

```javascript
// 1. External libraries (if any)
import { Anthropic } from '@anthropic-ai/sdk';

// 2. Chrome APIs
import chrome from 'chrome';

// 3. Utilities
import { storage } from '../utils/storage.js';
import { log } from '../utils/logger.js';

// 4. Config
import config from '../config/models.json';

// 5. Local modules
import { parseResponse } from './response-parser.js';
```

### Export Pattern

```javascript
// ✅ GOOD: Named exports for utilities
export function parseResponse(data) { }
export function validateData(data) { }
export const CONSTANTS = { };

// ✅ GOOD: Default export for main class/function
export default class APIClient { }

// ❌ BAD: Mixing default and named exports unnecessarily
export default function main() { }
export function helper() { } // Confusing
```

---

## Code Structure

### Module Pattern

```javascript
/**
 * Example Manager Module
 * Handles CRUD operations for user examples
 */
const ExampleManager = (() => {
  // Private variables
  let examples = [];
  const MAX_EXAMPLES = 10;
  
  // Private methods
  function generateId() {
    return `example-${Date.now()}-${Math.random()}`;
  }
  
  // Public API
  return {
    async getAll() {
      examples = await storage.getExamples();
      return examples;
    },
    
    async add(text) {
      if (examples.length >= MAX_EXAMPLES) {
        throw new Error('Maximum examples reached');
      }
      
      const example = {
        id: generateId(),
        text,
        createdAt: new Date().toISOString(),
        usageCount: 0
      };
      
      examples.push(example);
      await storage.setExamples(examples);
      return example;
    },
    
    async delete(id) {
      examples = examples.filter(ex => ex.id !== id);
      await storage.setExamples(examples);
    }
  };
})();

export default ExampleManager;
```

### Class Structure

```javascript
/**
 * API Client for Claude
 */
class ClaudeAPIClient {
  // 1. Static properties
  static API_VERSION = '2023-06-01';
  
  // 2. Constructor
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.endpoint = 'https://api.anthropic.com/v1/messages';
    this.requestCount = 0;
  }
  
  // 3. Public methods (alphabetically)
  async generateReplies(prompt) {
    this.#validatePrompt(prompt);
    const response = await this.#makeRequest(prompt);
    return this.#parseResponse(response);
  }
  
  getRequestCount() {
    return this.requestCount;
  }
  
  // 4. Private methods (alphabetically)
  #makeRequest(prompt) {
    this.requestCount++;
    // Implementation
  }
  
  #parseResponse(response) {
    // Implementation
  }
  
  #validatePrompt(prompt) {
    if (!prompt || prompt.length === 0) {
      throw new ValidationError('prompt', 'Cannot be empty');
    }
  }
}
```

---

## Error Handling

### Custom Error Classes

```javascript
/**
 * Base error class for application
 */
class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * API-related errors
 */
class APIError extends AppError {
  constructor(status, message) {
    super(message, `API_ERROR_${status}`);
    this.status = status;
  }
}

/**
 * Validation errors
 */
class ValidationError extends AppError {
  constructor(field, message) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
  }
}

/**
 * Storage errors
 */
class StorageError extends AppError {
  constructor(operation, message) {
    super(message, 'STORAGE_ERROR');
    this.operation = operation;
  }
}
```

### Error Handling Pattern

```javascript
// ✅ GOOD: Specific error handling
async function generateReplies(tweetData) {
  try {
    // Validate input
    if (!tweetData || !tweetData.text) {
      throw new ValidationError('tweetData', 'Tweet data is required');
    }
    
    // Get settings
    const settings = await storage.getSettings();
    if (!settings.apiKey) {
      throw new ValidationError('apiKey', 'API key not configured');
    }
    
    // Call API
    const response = await apiClient.generate(tweetData);
    return response;
    
  } catch (error) {
    // Handle specific error types
    if (error instanceof ValidationError) {
      showNotification('error', `Invalid ${error.field}: ${error.message}`);
    } else if (error instanceof APIError) {
      if (error.status === 401) {
        showNotification('error', 'Invalid API key. Check settings.');
      } else if (error.status === 429) {
        showNotification('error', 'Rate limit exceeded. Try again later.');
      } else {
        showNotification('error', 'API error. Please try again.');
      }
    } else {
      // Unknown error
      console.error('Unexpected error:', error);
      showNotification('error', 'Something went wrong. Please try again.');
    }
    
    // Log error for debugging
    logError(error);
    
    // Re-throw if needed
    throw error;
  }
}

// ❌ BAD: Generic error handling
async function generateReplies(tweetData) {
  try {
    const response = await apiClient.generate(tweetData);
    return response;
  } catch (error) {
    console.error(error); // Not helpful
    return null; // Swallowing error
  }
}
```

### Try-Catch Guidelines

```javascript
// ✅ GOOD: Try-catch around specific operations
async function fetchData() {
  let data;
  
  try {
    data = await storage.getData();
  } catch (error) {
    console.error('Storage error:', error);
    data = getDefaultData(); // Fallback
  }
  
  return processData(data);
}

// ❌ BAD: Try-catch around everything
async function fetchData() {
  try {
    const data = await storage.getData();
    const processed = processData(data);
    const result = transformResult(processed);
    return result;
  } catch (error) {
    console.error(error); // Which operation failed?
  }
}
```

---

## Documentation

### Function Documentation

```javascript
/**
 * Extracts tweet content and metadata from Twitter's DOM
 * 
 * @param {HTMLElement} tweetElement - The tweet's DOM element
 * @returns {Object} Parsed tweet data
 * @returns {string} returns.text - Tweet text content
 * @returns {string} returns.author - Tweet author username
 * @returns {string} returns.id - Tweet ID
 * @throws {ValidationError} If tweet element is invalid
 * 
 * @example
 * const tweet = parseTweet(element);
 * console.log(tweet.text); // "Hello world"
 */
function parseTweet(tweetElement) {
  if (!tweetElement) {
    throw new ValidationError('tweetElement', 'Element is required');
  }
  
  // Implementation
}
```

### Inline Comments

```javascript
// ✅ GOOD: Explain WHY, not WHAT
// Twitter's DOM structure changes frequently, so we use multiple selectors
// as fallbacks to ensure we can always find the reply button
const selectors = [
  '[data-testid="reply"]',
  '[aria-label="Reply"]',
  '.r-reply-button'
];

// ✅ GOOD: Explain complex logic
// We wait 100ms because Twitter's React needs time to update the DOM
// after the user clicks reply. Without this delay, our button injection
// might fail due to race conditions.
await sleep(100);

// ❌ BAD: Stating the obvious
// Set the value to true
const isActive = true;

// ❌ BAD: Commented out code (remove instead)
// function oldImplementation() {
//   // ...
// }
```

### TODO Comments

```javascript
// ✅ GOOD: TODO with context
// TODO(username): Add retry logic for rate limit errors (Issue #42)
// TODO: Implement caching to reduce API calls (Priority: Medium)

// ❌ BAD: Vague TODO
// TODO: fix this
// TODO: make better
```

---

## Testing Guidelines

### Unit Test Structure

```javascript
/**
 * Tests for prompt-builder.js
 */
describe('PromptBuilder', () => {
  describe('buildPrompt', () => {
    it('should include system prompt', () => {
      const prompt = buildPrompt(tweetData, settings, []);
      expect(prompt).toContain(settings.systemPrompt);
    });
    
    it('should include tweet context', () => {
      const prompt = buildPrompt(tweetData, settings, []);
      expect(prompt).toContain(tweetData.text);
    });
    
    it('should include examples when provided', () => {
      const examples = [{ text: 'Example reply' }];
      const prompt = buildPrompt(tweetData, settings, examples);
      expect(prompt).toContain('Example reply');
    });
    
    it('should throw error when tweet data is missing', () => {
      expect(() => buildPrompt(null, settings, [])).toThrow(ValidationError);
    });
  });
});
```

### Test Naming Convention

```javascript
// ✅ GOOD: Descriptive test names
it('should return empty array when no examples exist', () => {});
it('should throw ValidationError when API key is missing', () => {});
it('should inject button after reply box appears', () => {});

// ❌ BAD: Vague test names
it('works', () => {});
it('test 1', () => {});
it('returns data', () => {});
```

---

## Performance Guidelines

### DOM Operations

```javascript
// ✅ GOOD: Batch DOM updates
function updateMultipleElements(data) {
  const fragment = document.createDocumentFragment();
  
  data.forEach(item => {
    const element = createElement(item);
    fragment.appendChild(element);
  });
  
  container.appendChild(fragment); // Single reflow
}

// ❌ BAD: Multiple DOM updates
function updateMultipleElements(data) {
  data.forEach(item => {
    const element = createElement(item);
    container.appendChild(element); // Multiple reflows
  });
}
```

### Event Listeners

```javascript
// ✅ GOOD: Event delegation
container.addEventListener('click', (e) => {
  if (e.target.matches('.reply-button')) {
    handleReplyClick(e);
  }
});

// ❌ BAD: Multiple listeners
buttons.forEach(button => {
  button.addEventListener('click', handleReplyClick);
});
```

### Async Operations

```javascript
// ✅ GOOD: Parallel async operations
async function loadData() {
  const [settings, examples, cache] = await Promise.all([
    storage.getSettings(),
    storage.getExamples(),
    storage.getCache()
  ]);
  
  return { settings, examples, cache };
}

// ❌ BAD: Sequential async operations
async function loadData() {
  const settings = await storage.getSettings();
  const examples = await storage.getExamples();
  const cache = await storage.getCache();
  
  return { settings, examples, cache };
}
```

### Debouncing

```javascript
// ✅ GOOD: Debounce rapid events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedSave = debounce(saveSettings, 500);

// Usage
input.addEventListener('input', () => {
  debouncedSave(input.value);
});
```

---

## Security Guidelines

### Input Validation

```javascript
// ✅ GOOD: Always validate and sanitize
function saveExample(text) {
  // Validate
  if (typeof text !== 'string') {
    throw new ValidationError('text', 'Must be a string');
  }
  
  if (text.length === 0 || text.length > 500) {
    throw new ValidationError('text', 'Must be 1-500 characters');
  }
  
  // Sanitize
  const sanitized = text
    .trim()
    .replace(/[<>]/g, ''); // Remove potential HTML
  
  return storage.addExample(sanitized);
}

// ❌ BAD: No validation
function saveExample(text) {
  return storage.addExample(text);
}
```

### XSS Prevention

```javascript
// ✅ GOOD: Use textContent for user input
function displayMessage(message) {
  element.textContent = message; // Safe
}

// ❌ BAD: innerHTML with user input
function displayMessage(message) {
  element.innerHTML = message; // XSS vulnerability!
}

// ✅ GOOD: Sanitize if HTML needed
function displayMessage(htmlMessage) {
  const sanitized = DOMPurify.sanitize(htmlMessage);
  element.innerHTML = sanitized;
}
```

### API Key Handling

```javascript
// ✅ GOOD: Never log API keys
async function testAPIConnection() {
  const apiKey = await storage.getAPIKey();
  
  try {
    await apiClient.test(apiKey);
    log('API', 'Connection successful');
  } catch (error) {
    log('API', 'Connection failed', { status: error.status });
    // ❌ Don't: log('API', 'Failed', { apiKey, error });
  }
}

// ✅ GOOD: Clear sensitive data
function processAPIKey(apiKey) {
  const encrypted = encryptKey(apiKey);
  apiKey = null; // Clear from memory
  return encrypted;
}
```

---

## Chrome Extension Specific

### Message Passing

```javascript
// ✅ GOOD: Structured messages
chrome.runtime.sendMessage({
  action: 'generate-reply',
  data: {
    tweetId: '123',
    text: 'Hello world'
  }
}, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Message failed:', chrome.runtime.lastError);
    return;
  }
  
  handleResponse(response);
});

// ✅ GOOD: Message handler with validation
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Validate message structure
  if (!message || !message.action) {
    sendResponse({ success: false, error: 'Invalid message' });
    return true;
  }
  
  // Handle async operations
  (async () => {
    try {
      const result = await handleAction(message.action, message.data);
      sendResponse({ success: true, data: result });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  })();
  
  return true; // Keep channel open for async response
});
```

### Storage Operations

```javascript
// ✅ GOOD: Handle storage errors
async function saveSettings(settings) {
  try {
    await chrome.storage.sync.set({ settings });
  } catch (error) {
    if (error.message.includes('QUOTA_BYTES')) {
      throw new StorageError('save', 'Storage quota exceeded');
    }
    throw new StorageError('save', error.message);
  }
}

// ✅ GOOD: Use appropriate storage
// Sync storage for settings (syncs across devices)
chrome.storage.sync.set({ settings });

// Local storage for large data (examples, cache)
chrome.storage.local.set({ examples });
```

---

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows style guide
- [ ] All functions have documentation
- [ ] Error handling is present
- [ ] No console.logs in production code
- [ ] No hardcoded values (use constants/config)
- [ ] Variable names are descriptive
- [ ] Functions are small and focused
- [ ] No unused variables or imports
- [ ] Passes ESLint (if configured)
- [ ] Works in both Chrome and Firefox
- [ ] Tested manually in browser
- [ ] No security vulnerabilities
- [ ] Performance considered
- [ ] Backwards compatible (if updating)

---

These guidelines ensure consistent, maintainable, and secure code across the entire extension.
