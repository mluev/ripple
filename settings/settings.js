/**
 * Settings page - simplified
 */

const apiKeyInput = document.getElementById('apiKey');
const modelSelect = document.getElementById('modelSelect');
const systemPromptTextarea = document.getElementById('systemPrompt');
const saveSettingsButton = document.getElementById('saveSettings');
const saveStatus = document.getElementById('saveStatus');
const examplesList = document.getElementById('examplesList');
const toggleApiKeyBtn = document.getElementById('toggleApiKey');

let currentSettings = {};
let currentExamples = [];

// Load settings on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadExamples();
});

// Save settings
saveSettingsButton.addEventListener('click', saveSettings);

// Toggle API key visibility
toggleApiKeyBtn.addEventListener('click', () => {
  const type = apiKeyInput.type === 'password' ? 'text' : 'password';
  apiKeyInput.type = type;
});

const DEFAULT_SYSTEM_PROMPT = `You are a Twitter reply ghostwriter that helps users engage authentically on Twitter.
Your replies must sound human, natural, and conversational — never robotic or AI-generated.

Core Mission: Generate 3 distinct reply options for any tweet the user shares.
Each reply should feel like something a real person would type quickly on their phone.

Output Format (IMPORTANT - follow exactly):
Option 1: [reply text without any numbering or bullets]
Option 2: [reply text without any numbering or bullets]
Option 3: [reply text without any numbering or bullets]

DO NOT include numbering (1., 2., 3.) or bullets (•, -, *) in the reply text itself.
DO NOT start replies with numbers or symbols - just write the plain text.

Variety Requirements:
- Each reply must take a different angle (supportive, funny, curious, insightful, playful)
- Vary length: mix short punchy replies (5-15 words) with slightly longer ones (20-40 words)
- Rotate emotional tones: encouraging, witty, genuine, thoughtful, casual

Natural Writing Style:
- Write like texting a friend, not composing an email
- Use natural speech patterns: "tbh", "ngl", "wait", "honestly", "lol" (sparingly)
- Sentence fragments are fine: "This. Exactly this."
- Start with lowercase sometimes if it feels natural
- Use em dashes, ellipses naturally — not formally

Anti-AI Signals (What to AVOID):
❌ "Great question!" / "Well said!" / "This resonates with me"
❌ Over-explanation or essay-length replies
❌ Perfect grammar every time
❌ Corporate/professional tone
❌ Starting with "As someone who..."

DO Include:
✅ Genuine reactions: "wait what", "no way", "this is wild"
✅ Personal micro-stories: "literally just happened to me"
✅ Specific details over generic praise
✅ Light humor or self-deprecation when fitting
✅ Emoji (1-2 max, and only when natural)

Default mode: Friendly, curious professional. Slightly casual but not overly Gen Z. Smart but not preachy.

Twitter limit: 280 characters — stay well under when possible for readability.

Jump straight to replies. No preamble needed.`;

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get('settings');
    currentSettings = result.settings || {
      apiKey: '',
      model: 'claude-sonnet-4-20250514',
      systemPrompt: DEFAULT_SYSTEM_PROMPT
    };

    // Migrate old model format (remove provider prefix)
    if (currentSettings.model && currentSettings.model.includes('/')) {
      currentSettings.model = currentSettings.model.split('/')[1];
    }

    // Migrate openrouterKey to apiKey if exists
    if (currentSettings.openrouterKey && !currentSettings.apiKey) {
      currentSettings.apiKey = currentSettings.openrouterKey;
      delete currentSettings.openrouterKey;
    }

    // Set default system prompt if empty
    if (!currentSettings.systemPrompt) {
      currentSettings.systemPrompt = DEFAULT_SYSTEM_PROMPT;
    }

    apiKeyInput.value = currentSettings.apiKey || '';
    modelSelect.value = currentSettings.model || 'claude-sonnet-4-20250514';
    systemPromptTextarea.value = currentSettings.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('error', 'Error loading settings');
  }
}

async function saveSettings() {
  const apiKey = apiKeyInput.value.trim();
  const selectedModel = modelSelect.value;

  if (!apiKey) {
    showStatus('error', 'Anthropic API key is required');
    return;
  }

  if (!apiKey.startsWith('sk-ant-')) {
    showStatus('error', 'Invalid Anthropic API key format (should start with sk-ant-)');
    return;
  }

  saveSettingsButton.disabled = true;
  saveSettingsButton.textContent = 'Saving...';

  try {
    const settings = {
      apiKey: apiKey,
      model: selectedModel,
      systemPrompt: systemPromptTextarea.value.trim()
    };

    await chrome.storage.sync.set({ settings });
    currentSettings = settings;

    showStatus('success', 'Settings saved!');
    saveSettingsButton.textContent = 'Save Settings';
    saveSettingsButton.disabled = false;
  } catch (error) {
    console.error('Error saving:', error);
    showStatus('error', 'Failed to save settings');
    saveSettingsButton.textContent = 'Save Settings';
    saveSettingsButton.disabled = false;
  }
}

async function loadExamples() {
  try {
    const result = await chrome.storage.local.get('examples');
    currentExamples = result.examples || [];
    renderExamples();
  } catch (error) {
    console.error('Error loading examples:', error);
  }
}

async function deleteExample(id) {
  currentExamples = currentExamples.filter(ex => ex.id !== id);
  await chrome.storage.local.set({ examples: currentExamples });
  renderExamples();
}

function renderExamples() {
  if (!currentExamples.length) {
    examplesList.innerHTML = '<div style="text-align: center; padding: 40px; color: rgb(113, 118, 123);">No saved examples yet</div>';
    return;
  }

  examplesList.innerHTML = currentExamples.map(ex => `
    <div style="padding: 12px; border: 1px solid rgb(47, 51, 54); border-radius: 8px; margin-bottom: 8px;">
      <div style="color: rgb(231, 233, 234); margin-bottom: 8px;">${escapeHTML(ex.text)}</div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; color: rgb(113, 118, 123);">${ex.text.length} characters</span>
        <button class="delete-example-btn" data-id="${ex.id}" style="background: transparent; border: 1px solid rgb(47, 51, 54); color: rgb(244, 33, 46); padding: 6px 16px; border-radius: 9999px; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.2s;">Delete</button>
      </div>
    </div>
  `).join('');

  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      deleteExample(id);
    });
  });
}

function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showStatus(type, message) {
  saveStatus.className = `status-message ${type}`;
  saveStatus.textContent = message;
  saveStatus.style.display = 'block';

  setTimeout(() => {
    saveStatus.style.display = 'none';
  }, 3000);
}
