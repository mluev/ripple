/**
 * Settings page - simplified
 */

const openrouterKeyInput = document.getElementById('openrouterKey');
const modelSelect = document.getElementById('modelSelect');
const systemPromptTextarea = document.getElementById('systemPrompt');
const saveSettingsButton = document.getElementById('saveSettings');
const saveStatus = document.getElementById('saveStatus');
const examplesList = document.getElementById('examplesList');
const toggleOpenrouterKeyBtn = document.getElementById('toggleOpenrouterKey');

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
toggleOpenrouterKeyBtn.addEventListener('click', () => {
  const type = openrouterKeyInput.type === 'password' ? 'text' : 'password';
  openrouterKeyInput.type = type;
});

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get('settings');
    currentSettings = result.settings || {
      openrouterKey: '',
      model: 'anthropic/claude-sonnet-4-20250514',
      systemPrompt: ''
    };

    openrouterKeyInput.value = currentSettings.openrouterKey || '';
    modelSelect.value = currentSettings.model || 'anthropic/claude-sonnet-4-20250514';
    systemPromptTextarea.value = currentSettings.systemPrompt || '';
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('error', 'Error loading settings');
  }
}

async function saveSettings() {
  const openrouterKey = openrouterKeyInput.value.trim();
  const selectedModel = modelSelect.value;

  if (!openrouterKey) {
    showStatus('error', 'OpenRouter API key is required');
    return;
  }

  if (!openrouterKey.startsWith('sk-or-')) {
    showStatus('error', 'Invalid OpenRouter API key format (should start with sk-or-)');
    return;
  }

  saveSettingsButton.disabled = true;
  saveSettingsButton.textContent = 'Saving...';

  try {
    const settings = {
      openrouterKey: openrouterKey,
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
