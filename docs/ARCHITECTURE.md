# Architecture Document

## Project Overview

**Project Name:** Smart Reply Extension  
**Type:** Browser Extension (Chrome/Firefox)  
**Core Purpose:** AI-powered Twitter reply generation with personalization

---

## Technical Stack

### Core Technologies
- **Language:** JavaScript (ES6+) / TypeScript (optional)
- **Runtime:** Browser Extension Environment (Manifest V3)
- **Storage:** Chrome Storage API (sync + local)
- **API:** Anthropic Claude API

### Libraries & Dependencies

#### Required Libraries
```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.20.0",  // Claude API client
    "uuid": "^9.0.0"                  // Generate unique IDs
  }
}
```

#### Optional Enhancement Libraries
```json
{
  "devDependencies": {
    "eslint": "^8.0.0",              // Code linting
    "prettier": "^3.0.0"             // Code formatting
  }
}
```

**Note:** Keep dependencies minimal. Use vanilla JS where possible to reduce bundle size.

---

## Architecture Principles

### 1. Separation of Concerns
- **Content Scripts:** UI injection and DOM manipulation only
- **Background Service Worker:** API calls and business logic only
- **Utilities:** Reusable, pure functions with no side effects
- **Storage:** Abstracted through dedicated module

### 2. Message-Driven Architecture
All communication between components uses Chrome's message passing:
```javascript
// Content Script → Background
chrome.runtime.sendMessage({
  action: "generate-reply",
  data: {...}
});

// Background → Content Script
chrome.tabs.sendMessage(tabId, {
  action: "reply-generated",
  data: {...}
});
```

### 3. Single Source of Truth
- All settings stored in Chrome Storage
- No duplicate state across components
- Settings changes broadcast to all active tabs

### 4. Graceful Degradation
- Extension works without examples (uses prompt only)
- Clear error messages when API fails
- Fallback UI states for all scenarios

### 5. Privacy First
- No external tracking
- No data leaves user's browser except API calls
- API key encrypted in storage
- Optional telemetry (off by default)

---

## System Architecture

### High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     TWITTER.COM                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Content Script (Injected)              │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────┐  │  │
│  │  │ AI Button  │  │ Modal UI    │  │ Tweet    │  │  │
│  │  │ Injector   │  │ Controller  │  │ Parser   │  │  │
│  │  └────────────┘  └─────────────┘  └──────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Chrome Message API
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Background Service Worker                  │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │   Message    │  │   Prompt    │  │   API        │  │
│  │   Handler    │  │   Builder   │  │   Client     │  │
│  └──────────────┘  └─────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Chrome Storage API
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Chrome Storage                         │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │   Settings   │  │   Examples  │  │   Cache      │  │
│  │   (sync)     │  │   (local)   │  │   (local)    │  │
│  └──────────────┘  └─────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS Request
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Anthropic Claude API                       │
│                 (External Service)                      │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure

```
smart-reply-extension/
│
├── manifest.json                      # Extension configuration
│
├── background/
│   ├── service-worker.js             # Main background script
│   ├── message-handler.js            # Handle messages from content scripts
│   ├── api-client.js                 # Claude API integration
│   └── response-parser.js            # Parse AI responses
│
├── content/
│   ├── content-script.js             # Main content script entry
│   ├── ui/
│   │   ├── button-injector.js        # Inject AI button into Twitter
│   │   ├── modal-controller.js       # Reply modal logic
│   │   └── notification.js           # Toast notifications
│   ├── parsers/
│   │   ├── tweet-parser.js           # Extract tweet data
│   │   └── dom-observer.js           # Observe Twitter DOM changes
│   └── styles/
│       ├── modal.css                 # Modal styling
│       ├── button.css                # Button styling
│       └── animations.css            # Transition effects
│
├── settings/
│   ├── settings.html                 # Settings page markup
│   ├── settings.js                   # Settings page logic
│   ├── components/
│   │   ├── api-config.js             # API configuration section
│   │   ├── prompt-editor.js          # System prompt editor
│   │   └── example-manager.js        # Example CRUD interface
│   └── styles/
│       └── settings.css              # Settings page styles
│
├── popup/
│   ├── popup.html                    # Extension popup markup
│   ├── popup.js                      # Popup logic
│   └── popup.css                     # Popup styles
│
├── utils/
│   ├── storage.js                    # Chrome Storage wrapper
│   ├── prompt-builder.js             # Build AI prompts
│   ├── validation.js                 # Input validation
│   ├── crypto.js                     # Encryption utilities
│   └── constants.js                  # App-wide constants
│
├── config/
│   ├── models.json                   # AI model configurations
│   ├── default-prompts.json          # Default system prompts
│   └── twitter-selectors.json        # Twitter DOM selectors
│
├── assets/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── images/
│       └── logo.svg
│
└── docs/
    ├── ARCHITECTURE.md               # This file
    ├── CODE_GUIDELINES.md            # Coding standards
    ├── DESIGN_SYSTEM.md              # UI/UX specifications
    └── DEVELOPMENT_PLAN.md           # Implementation roadmap
```

---

## Data Flow Patterns

### Pattern 1: Reply Generation Flow

```javascript
// 1. User triggers generation
[User clicks AI button on Twitter]
    ↓
// 2. Content script extracts context
tweetData = extractTweetContext()
    ↓
// 3. Content script sends message to background
chrome.runtime.sendMessage({
    action: 'generate-reply',
    tweetData: tweetData
})
    ↓
// 4. Background fetches settings
settings = await storage.getSettings()
examples = await storage.getExamples()
    ↓
// 5. Background builds prompt
prompt = buildPrompt(tweetData, settings, examples)
    ↓
// 6. Background calls API
response = await claudeAPI.generateReplies(prompt)
    ↓
// 7. Background parses response
replies = parseReplies(response)
    ↓
// 8. Background sends back to content script
chrome.tabs.sendMessage(tabId, {
    action: 'replies-ready',
    replies: replies
})
    ↓
// 9. Content script shows modal
showReplyModal(replies)
    ↓
// 10. User selects reply
[User clicks "Use This"]
    ↓
// 11. Insert into Twitter
insertIntoReplyBox(selectedReply)
```

### Pattern 2: Example Management Flow

```javascript
// Save Example
[User clicks "Save as Example" in modal]
    ↓
chrome.runtime.sendMessage({
    action: 'save-example',
    text: replyText
})
    ↓
exampleId = uuid()
example = { id, text, createdAt, usageCount: 0 }
    ↓
await storage.addExample(example)
    ↓
chrome.tabs.sendMessage(tabId, {
    action: 'example-saved',
    count: newExampleCount
})
    ↓
[Show success notification]
```

### Pattern 3: Settings Update Flow

```javascript
// Update Settings
[User modifies settings in settings page]
    ↓
[User clicks "Save"]
    ↓
validateSettings(newSettings)
    ↓
await storage.setSettings(newSettings)
    ↓
// Broadcast to all tabs
chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
            action: 'settings-updated'
        })
    })
})
    ↓
[Show "Saved!" feedback]
```

---

## Storage Schema

### Chrome Storage Sync (Settings - 100KB limit)
```javascript
{
  "settings": {
    "apiKey": "encrypted_key_here",      // Encrypted API key
    "model": "claude-3.5-sonnet",        // Selected model ID
    "systemPrompt": "You are...",        // Custom system prompt
    "preferences": {
      "autoSaveExamples": false,
      "maxExamples": 10,
      "showCharacterCount": true,
      "useThreadContext": true
    }
  }
}
```

### Chrome Storage Local (Examples - Unlimited)
```javascript
{
  "examples": [
    {
      "id": "uuid-v4-string",
      "text": "Great point! I've been...",
      "createdAt": "2025-10-02T10:30:00Z",
      "usageCount": 5,
      "metadata": {
        "tweetContext": "optional context",
        "category": "technical" // optional categorization
      }
    }
  ],
  "cache": {
    "lastAPITest": "2025-10-02T09:00:00Z",
    "lastAPIStatus": "success",
    "todayUsageCount": 42
  }
}
```

---

## API Integration Architecture

### Claude API Client Structure

```javascript
class ClaudeAPIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.endpoint = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-5-sonnet-20241022';
  }

  async generateReplies(prompt) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 500,
        temperature: 0.8,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }

    return await response.json();
  }
}
```

### Error Handling Strategy

```javascript
// Error Types
class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
    this.name = 'ValidationError';
  }
}

// Error Handler
function handleError(error) {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return 'Invalid API key. Please check your settings.';
      case 429:
        return 'Rate limit exceeded. Please try again in a moment.';
      case 500:
        return 'API service error. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
  
  if (error instanceof ValidationError) {
    return `Invalid ${error.field}: ${error.message}`;
  }
  
  return 'An unexpected error occurred.';
}
```

---

## Security Architecture

### 1. API Key Management
- **Storage:** Encrypted using Web Crypto API before storage
- **Memory:** Cleared immediately after use
- **Transmission:** Only sent to Anthropic API (HTTPS)
- **Access:** Only background script can access

```javascript
// Encryption utility
async function encryptAPIKey(apiKey) {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return {
    encrypted: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv)
  };
}
```

### 2. Content Security Policy
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### 3. Input Sanitization
- Sanitize all user inputs before storage
- Validate tweet data before sending to API
- Escape HTML in UI components

---

## Performance Optimization

### 1. Lazy Loading
- Load settings only when needed
- Cache frequently accessed data
- Defer non-critical operations

### 2. Request Optimization
- Debounce rapid button clicks
- Cancel pending requests on new request
- Implement request queue for rate limiting

### 3. DOM Optimization
- Use MutationObserver efficiently
- Batch DOM updates
- Remove event listeners on cleanup

### 4. Memory Management
- Clear large objects after use
- Limit example storage (configurable max)
- Periodic cache cleanup

---

## Extensibility Design

### Adding New AI Models

```javascript
// config/models.json
{
  "models": [
    {
      "id": "claude-3.5-sonnet",
      "name": "Claude 3.5 Sonnet",
      "provider": "anthropic",
      "enabled": true,
      "config": {
        "endpoint": "https://api.anthropic.com/v1/messages",
        "maxTokens": 500,
        "temperature": 0.8
      }
    },
    {
      "id": "gpt-4o-mini",
      "name": "GPT-4o Mini",
      "provider": "openai",
      "enabled": false,
      "config": {
        "endpoint": "https://api.openai.com/v1/chat/completions",
        "maxTokens": 500,
        "temperature": 0.7
      }
    }
  ]
}
```

### Provider Interface
```javascript
class AIProvider {
  constructor(config) {
    this.config = config;
  }
  
  async generateReplies(prompt) {
    throw new Error('Method not implemented');
  }
  
  formatPrompt(data) {
    throw new Error('Method not implemented');
  }
  
  parseResponse(response) {
    throw new Error('Method not implemented');
  }
}

class AnthropicProvider extends AIProvider {
  // Implementation specific to Anthropic
}

class OpenAIProvider extends AIProvider {
  // Implementation specific to OpenAI
}
```

---

## Testing Strategy

### Unit Tests
- Pure utility functions
- Prompt builder logic
- Data parsing functions
- Storage operations

### Integration Tests
- Message passing between components
- API client with mock responses
- Settings save/load flow
- Example management operations

### Manual Testing Checklist
- Button appears on all tweet types
- Modal displays correctly
- Generated replies are under 280 characters
- Examples improve personalization
- Settings persist across sessions
- Error states display properly

---

## Monitoring & Logging

### Development Mode
```javascript
const DEBUG = false; // Set to true in development

function log(category, message, data = null) {
  if (!DEBUG) return;
  
  console.log(`[${category}] ${message}`, data);
}

// Usage
log('API', 'Generating replies', { tweetId, promptLength });
```

### Production Telemetry (Optional, Opt-in)
```javascript
{
  "analytics": {
    "enabled": false, // User must opt-in
    "events": [
      "reply_generated",
      "reply_used",
      "example_saved",
      "api_error"
    ]
  }
}
```

---

## Deployment Considerations

### Version Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog for each release
- Migration scripts for breaking changes

### Update Strategy
- Auto-updates via Chrome Web Store
- Graceful handling of version changes
- Preserve user data during updates

### Browser Compatibility
- Primary: Chrome 88+
- Secondary: Firefox 78+ (with minor adjustments)
- Edge Chromium: Should work without changes

---

## Constraints & Limitations

### Technical Constraints
- Chrome Storage Sync: 100KB limit (settings)
- Chrome Storage Local: No limit (examples)
- Service Worker: Cannot run indefinitely
- Content Script: Cannot access chrome.* APIs directly

### API Constraints
- Claude API rate limits apply
- Token limits per request
- Cost considerations for high-volume users

### Twitter Constraints
- DOM structure may change
- Rate limiting on Twitter's side
- Terms of Service compliance required

---

## Future Architecture Considerations

### Potential Enhancements
1. **Local AI Models:** Support for browser-based models (WebLLM)
2. **Multi-platform:** Extend to LinkedIn, Reddit, etc.
3. **Team Features:** Shared examples and prompts
4. **Advanced Analytics:** ML-based reply optimization
5. **Offline Mode:** Cache common responses

### Scalability Planning
- Design for 100K+ users
- Handle 1M+ API requests/day
- Support 1000+ examples per user
- Maintain <100ms UI response time

---

## Compliance & Legal

### Privacy Policy Requirements
- Disclose data collection (API calls)
- Explain data storage (local only)
- Third-party services (Anthropic)
- User rights (export, delete)

### Terms of Service
- Comply with Twitter's automation policy
- Comply with Anthropic's acceptable use
- No misleading or spam content
- User responsibility for content

---

This architecture document serves as the foundation for all development decisions. All code should align with these principles and patterns.
