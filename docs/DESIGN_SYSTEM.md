# Design System & UI/UX Guidelines

## Design Philosophy

**Core Principle:** Seamless integration with Twitter/X's native interface. Users should feel like the AI reply feature is a natural part of Twitter, not a third-party addition.

**Design Goals:**
1. **Native Feel:** Match Twitter's design language exactly
2. **Minimal Disruption:** Don't interfere with existing Twitter UI
3. **Clear Affordance:** Users instantly understand what the feature does
4. **Fast Interaction:** Minimal clicks from intent to action
5. **Professional Polish:** Enterprise-grade quality

---

## Color System

### Primary Colors (Match Twitter/X)

```css
/* Twitter/X Brand Colors */
--x-blue: #1D9BF0;           /* Primary action color */
--x-blue-hover: #1A8CD8;     /* Hover state */
--x-blue-active: #1876BD;    /* Active/pressed state */

/* Text Colors */
--text-primary: #0F1419;     /* Main text */
--text-secondary: #536471;   /* Secondary text, metadata */
--text-tertiary: #8B98A5;    /* Disabled, placeholder */

/* Background Colors */
--bg-primary: #FFFFFF;       /* Main background */
--bg-secondary: #F7F9F9;     /* Hover backgrounds */
--bg-tertiary: #EFF3F4;      /* Dividers, borders */

/* Semantic Colors */
--success: #00BA7C;          /* Success states */
--error: #F4212E;            /* Error states */
--warning: #FFD400;          /* Warning states */
```

### Extension-Specific Colors

```css
/* AI Feature Accent */
--ai-accent: #7856FF;        /* Purple for AI features */
--ai-accent-hover: #6941E5;  /* Hover state */
--ai-accent-light: #F5F3FF;  /* Light background */

/* Gradients */
--ai-gradient: linear-gradient(135deg, #7856FF 0%, #1D9BF0 100%);
--ai-gradient-subtle: linear-gradient(135deg, #F5F3FF 0%, #EBF5FF 100%);
```

### Dark Mode Support

```css
/* Dark Mode Colors */
[data-theme="dark"] {
  --text-primary: #E7E9EA;
  --text-secondary: #71767B;
  --text-tertiary: #4A5057;
  
  --bg-primary: #000000;
  --bg-secondary: #16181C;
  --bg-tertiary: #2F3336;
  
  --ai-accent-light: #1A1625;
}
```

---

## Typography

### Font Stack

```css
/* Match Twitter/X fonts exactly */
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               Helvetica, Arial, sans-serif;

/* Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Font Sizes

```css
/* Typography Scale */
--text-xs: 11px;    /* Metadata, labels */
--text-sm: 13px;    /* Secondary text */
--text-base: 15px;  /* Body text, tweets */
--text-lg: 17px;    /* Section headers */
--text-xl: 20px;    /* Page titles */
--text-2xl: 23px;   /* Large headings */
```

### Line Heights

```css
--leading-tight: 1.2;   /* Headings */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.6; /* Long-form content */
```

---

## Spacing System

### Base Unit: 4px

```css
/* Spacing Scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Component Spacing

```css
/* Common Patterns */
--button-padding-x: 16px;
--button-padding-y: 8px;
--input-padding-x: 12px;
--input-padding-y: 12px;
--card-padding: 16px;
--modal-padding: 20px;
```

---

## Border & Radius

### Border Styles

```css
/* Border Widths */
--border-thin: 1px;
--border-medium: 2px;

/* Border Colors */
--border-light: #EFF3F4;
--border-medium: #CFD9DE;
--border-dark: #536471;

/* Border Radius */
--radius-sm: 4px;    /* Small elements */
--radius-md: 8px;    /* Cards, inputs */
--radius-lg: 16px;   /* Modals */
--radius-full: 9999px; /* Pills, avatar */
```

---

## Shadows

```css
/* Elevation System */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08), 
             0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.12), 
             0 4px 8px rgba(0, 0, 0, 0.06);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.16);

/* Special Shadows */
--shadow-modal: 0 0 0 1px rgba(0, 0, 0, 0.04),
                0 8px 32px rgba(0, 0, 0, 0.16);
```

---

## Animation & Transitions

### Timing Functions

```css
/* Easing Curves */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration

```css
/* Animation Durations */
--duration-fast: 150ms;    /* Hover states */
--duration-base: 200ms;    /* Most transitions */
--duration-slow: 300ms;    /* Modal open/close */
--duration-slower: 500ms;  /* Page transitions */
```

### Common Transitions

```css
/* Reusable Transition Properties */
--transition-colors: color var(--duration-base) var(--ease-in-out),
                     background-color var(--duration-base) var(--ease-in-out),
                     border-color var(--duration-base) var(--ease-in-out);

--transition-transform: transform var(--duration-base) var(--ease-out);

--transition-opacity: opacity var(--duration-base) var(--ease-in-out);

--transition-all: all var(--duration-base) var(--ease-in-out);
```

---

## Component Specifications

### 1. AI Reply Button

**Visual Design:**
```
┌─────────────────────┐
│  ✨ AI Reply        │  ← Button in reply toolbar
└─────────────────────┘
```

**Specifications:**
```css
.ai-reply-button {
  /* Layout */
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  
  /* Visual */
  background: var(--ai-accent-light);
  border: 1px solid var(--ai-accent);
  border-radius: var(--radius-full);
  
  /* Typography */
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--ai-accent);
  
  /* Interaction */
  cursor: pointer;
  transition: var(--transition-all);
}

.ai-reply-button:hover {
  background: var(--ai-accent);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.ai-reply-button:active {
  transform: translateY(0);
}

.ai-reply-button--loading {
  pointer-events: none;
  opacity: 0.6;
}
```

**States:**
- **Default:** Subtle purple accent
- **Hover:** Filled purple background
- **Active:** Slight press effect
- **Loading:** Spinner icon, reduced opacity
- **Disabled:** Grayed out, no pointer

**Icon:**
- Use sparkle emoji (✨) or custom AI icon
- Size: 16x16px
- Positioned left of text

**Placement:**
- Next to Twitter's native reply button
- Aligned with other action buttons
- Responsive: Hide text on mobile, show icon only

---

### 2. Reply Generation Modal

**Visual Design:**
```
┌──────────────────────────────────────────────┐
│  AI Reply Suggestions                    [×] │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  Reply Variation 1                     │ │
│  │                                        │ │
│  │  This is a great point! I've been...  │ │
│  │                                        │ │
│  │  [Use This Reply]  [Save as Example]  │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  Reply Variation 2                  250│ │
│  │  ...                                   │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  Reply Variation 3                  280│ │
│  │  ...                             [!]   │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  [↻ Regenerate All]           [Cancel]      │
└──────────────────────────────────────────────┘
```

**Specifications:**

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn var(--duration-base);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Container */
.modal-container {
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  overflow: hidden;
  animation: slideUp var(--duration-slow) var(--ease-out);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: var(--transition-colors);
}

.modal-close:hover {
  background: var(--bg-secondary);
}

/* Modal Body */
.modal-body {
  padding: var(--space-4);
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Reply Card */
.reply-card {
  padding: var(--space-4);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  transition: var(--transition-all);
  cursor: pointer;
  position: relative;
}

.reply-card:hover {
  border-color: var(--ai-accent);
  background: var(--ai-accent-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.reply-card--selected {
  border-color: var(--ai-accent);
  background: var(--ai-accent-light);
  box-shadow: var(--shadow-md);
}

.reply-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.reply-card__label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

.reply-card__count {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.reply-card__count--over {
  color: var(--error);
  font-weight: var(--font-weight-bold);
}

.reply-card__text {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  white-space: pre-wrap;
}

.reply-card__actions {
  display: flex;
  gap: var(--space-2);
}

/* Modal Footer */
.modal-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

**Interaction States:**
- **Hover:** Card lifts with shadow
- **Selected:** Blue accent border
- **Over limit:** Red character count
- **Loading:** Skeleton screens with shimmer

---

### 3. Button Styles

**Primary Button (Use This Reply):**
```css
.button-primary {
  padding: var(--button-padding-y) var(--button-padding-x);
  background: var(--ai-accent);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-all);
}

.button-primary:hover {
  background: var(--ai-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.button-primary:active {
  transform: translateY(0);
}
```

**Secondary Button (Save Example, Cancel):**
```css
.button-secondary {
  padding: var(--button-padding-y) var(--button-padding-x);
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
}

.button-secondary:hover {
  background: var(--bg-secondary);
  border-color: var(--text-primary);
}
```

**Icon Button (Close, Regenerate):**
```css
.button-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-colors);
}

.button-icon:hover {
  background: var(--bg-secondary);
}
```

---

### 4. Settings Page Design

**Layout:**
```
┌────────────────────────────────────────────────┐
│  ⚙️  Settings                              [×]  │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  🔑 API Configuration                    │ │
│  │  ────────────────────────────────────    │ │
│  │                                          │ │
│  │  AI Model                                │ │
│  │  [Claude 3.5 Sonnet            ▼]       │ │
│  │                                          │ │
│  │  API Key                                 │ │
│  │  [sk-ant-••••••••••••••]  [Show] [Test] │ │
│  │  ✓ Connected                             │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  📝 System Prompt                        │ │
│  │  ────────────────────────────────────    │ │
│  │                                          │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │ You are helping write Twitter...   │ │ │
│  │  │                                    │ │ │
│  │  │ [Large textarea]                   │ │ │
│  │  └────────────────────────────────────┘ │ │
│  │                                          │ │
│  │  [Reset to Default]                     │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  💾 Saved Examples (3)                   │ │
│  │  ────────────────────────────────────    │ │
│  │                                          │ │
│  │  [Search examples...]                    │ │
│  │                                          │ │
│  │  • Great point! I've been thinking... ×  │ │
│  │    Created: Oct 2, 2025 • Used 5 times  │ │
│  │                                          │ │
│  │  • This reminds me of when...        ×  │ │
│  │    Created: Oct 1, 2025 • Used 2 times  │ │
│  │                                          │ │
│  │  [+ Add Example]                         │ │
│  └──────────────────────────────────────────┘ │
│                                                │
└────────────────────────────────────────────────┘
```

**Specifications:**
```css
/* Settings Container */
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-6);
}

/* Section Card */
.settings-section {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

.settings-section__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 2px solid var(--border-light);
}

.settings-section__title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

/* Form Elements */
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.form-input {
  width: 100%;
  padding: var(--input-padding-y) var(--input-padding-x);
  background: var(--bg-primary);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--text-primary);
  transition: var(--transition-colors);
}

.form-input:focus {
  outline: none;
  border-color: var(--ai-accent);
  box-shadow: 0 0 0 3px var(--ai-accent-light);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
  font-family: var(--font-family);
  line-height: var(--leading-normal);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* Dropdown arrow */
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

/* Status Indicators */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge--success {
  background: #E8F8F2;
  color: var(--success);
}

.status-badge--error {
  background: #FEE;
  color: var(--error);
}

/* Example List */
.example-item {
  padding: var(--space-3);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  display: flex;
  justify-content: space-between;
  align-items: start;
  transition: var(--transition-colors);
}

.example-item:hover {
  background: var(--bg-tertiary);
}

.example-item__text {
  flex: 1;
  font-size: var(--text-base);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.example-item__meta {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.example-item__delete {
  padding: var(--space-1);
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: var(--transition-colors);
}

.example-item__delete:hover {
  background: var(--error);
  color: white;
}
```

---

### 5. Notification/Toast

**Visual Design:**
```
┌─────────────────────────────────┐
│  ✓  Reply generated!            │
└─────────────────────────────────┘
```

**Specifications:**
```css
.toast {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  z-index: 10000;
  animation: slideInRight var(--duration-base) var(--ease-out);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast--success {
  border-left: 4px solid var(--success);
}

.toast--error {
  border-left: 4px solid var(--error);
}

.toast__icon {
  width: 20px;
  height: 20px;
}

.toast__message {
  font-size: var(--text-base);
  color: var(--text-primary);
}
```

---

### 6. Loading States

**Spinner:**
```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-light);
  border-top-color: var(--ai-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Skeleton Loader:**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large */
```

### Mobile Adaptations

```css
/* Mobile: Icon only button */
@media (max-width: 640px) {
  .ai-reply-button__text {
    display: none;
  }
  
  .modal-container {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
  
  .modal-body {
    max-height: calc(100vh - 120px);
  }
}
```

---

## Accessibility

### Focus States

```css
/* Keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--ai-accent);
  outline-offset: 2px;
}

.button:focus-visible {
  box-shadow: 0 0 0 3px var(--ai-accent-light);
}
```

### ARIA Attributes

```html
<!-- Button -->
<button 
  class="ai-reply-button"
  aria-label="Generate AI reply"
  aria-describedby="ai-tooltip">
  ✨ AI Reply
</button>

<!-- Modal -->
<div 
  class="modal-overlay" 
  role="dialog" 
  aria-labelledby="modal-title"
  aria-modal="true">
  <div class="modal-container">
    <h2 id="modal-title">AI Reply Suggestions</h2>
    <!-- Content -->
  </div>
</div>

<!-- Loading state -->
<button aria-busy="true" aria-label="Generating replies...">
  <span class="spinner" aria-hidden="true"></span>
</button>
```

### Screen Reader Support

```css
/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Icon System

### Custom Icons

Use SVG icons for consistency:

```html
<!-- AI Icon -->
<svg class="icon" viewBox="0 0 24 24">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>

<!-- Loading Icon -->
<svg class="icon icon-spinner" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
    <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" from="0" to="64"/>
  </circle>
</svg>
```

**Icon Sizes:**
```css
.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.icon--sm { width: 16px; height: 16px; }
.icon--lg { width: 24px; height: 24px; }
.icon--xl { width: 32px; height: 32px; }
```

---

## Design Tokens (CSS Variables)

**Complete Token System:**

```css
:root {
  /* Colors */
  --color-primary: #1D9BF0;
  --color-primary-hover: #1A8CD8;
  --color-ai-accent: #7856FF;
  --color-success: #00BA7C;
  --color-error: #F4212E;
  --color-warning: #FFD400;
  
  /* Text */
  --text-primary: #0F1419;
  --text-secondary: #536471;
  --text-tertiary: #8B98A5;
  
  /* Background */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7F9F9;
  --bg-tertiary: #EFF3F4;
  
  /* Spacing */
  --space-unit: 4px;
  --space-xs: calc(var(--space-unit) * 1);
  --space-sm: calc(var(--space-unit) * 2);
  --space-md: calc(var(--space-unit) * 4);
  --space-lg: calc(var(--space-unit) * 6);
  --space-xl: calc(var(--space-unit) * 8);
  
  /* Typography */
  --font-size-xs: 11px;
  --font-size-sm: 13px;
  --font-size-base: 15px;
  --font-size-lg: 17px;
  --font-size-xl: 20px;
  
  /* Borders */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.12);
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
  
  /* Z-index */
  --z-modal: 9999;
  --z-toast: 10000;
  --z-tooltip: 10001;
}
```

---

## Usage Examples

### Complete Button Implementation

```html
<button class="ai-reply-button" data-state="default">
  <svg class="icon icon--sparkle" viewBox="0 0 24 24">
    <!-- Sparkle icon path -->
  </svg>
  <span class="ai-reply-button__text">AI Reply</span>
</button>
```

```css
.ai-reply-button {
  /* Use design tokens */
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  
  background: var(--bg-secondary);
  border: 1px solid var(--color-ai-accent);
  border-radius: var(--border-radius-full);
  
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-ai-accent);
  
  cursor: pointer;
  transition: all var(--transition-base) ease-in-out;
}

.ai-reply-button:hover {
  background: var(--color-ai-accent);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.ai-reply-button[data-state="loading"] {
  pointer-events: none;
  opacity: 0.6;
}

.ai-reply-button[data-state="loading"] .icon {
  animation: spin 0.8s linear infinite;
}
```

---

This design system ensures visual consistency and seamless integration with Twitter/X's native interface while maintaining the extension's unique identity through subtle AI-themed accents.
