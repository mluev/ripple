/**
 * Simple AI button injector - no JSON loading, no complex timing
 */

const injectedPosts = new WeakSet();

// Hardcoded selectors
const SELECTORS = {
  tweet: 'article[data-testid="tweet"]',
  actionBar: 'div[role="group"][aria-label]'
};

function createAIButton() {
  const button = document.createElement('div');
  button.className = 'ripple-ai-button';
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  button.setAttribute('aria-label', 'AI Reply');
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ripple-icon">
      <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path>
      <path d="M16 8 2 22"></path>
      <path d="M17.5 15H9"></path>
    </svg>
  `;
  return button;
}

function setButtonState(button, state) {
  button.setAttribute('data-state', state);
}

async function handleButtonClick(event, button, postElement) {
  event.preventDefault();
  event.stopPropagation();

  console.log('🔵 AI button clicked');
  setButtonState(button, 'loading');

  try {
    const result = await chrome.storage.sync.get('settings');
    let apiKey = result.settings?.apiKey || result.settings?.openrouterKey;
    let model = result.settings?.model || 'claude-sonnet-4-20250514';

    // Migrate old model format
    if (model && model.includes('/')) {
      model = model.split('/')[1];
    }

    if (!apiKey) {
      throw new Error('Please configure your Anthropic API key in settings');
    }

    const tweetData = await extractTweetData(postElement);
    if (!tweetData) {
      throw new Error('Could not extract tweet data');
    }

    console.log('✅ Tweet:', tweetData.text);

    chrome.runtime.sendMessage({
      action: 'generate-reply',
      tweetText: tweetData.text,
      apiKey: apiKey,
      model: model
    }, (response) => {
      setButtonState(button, 'default');

      if (chrome.runtime.lastError) {
        console.error('❌ Runtime error:', chrome.runtime.lastError);
        showNotification('error', 'Communication error');
        return;
      }

      if (response.success) {
        console.log('✅ Replies:', response.replies);
        showReplyModal(response.replies, postElement);
      } else {
        console.error('❌ Error:', response.error);
        showNotification('error', response.error);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    setButtonState(button, 'error');
    showNotification('error', error.message || 'An unexpected error occurred');
  }
}

function injectButton(post) {
  if (injectedPosts.has(post)) return;

  const actionBar = post.querySelector(SELECTORS.actionBar);
  if (!actionBar) return;

  if (actionBar.querySelector('.ripple-ai-button')) {
    injectedPosts.add(post);
    return;
  }

  const button = createAIButton();
  button.addEventListener('click', (e) => handleButtonClick(e, button, post));
  actionBar.appendChild(button);
  injectedPosts.add(post);
  console.log('✅ AI button injected');
}

function checkPosts() {
  const posts = document.querySelectorAll(SELECTORS.tweet);
  console.log(`Found ${posts.length} posts`);
  posts.forEach(post => injectButton(post));
}

function initButtonInjection() {
  console.log('Initializing AI button injection...');

  // Initial check
  setTimeout(checkPosts, 1000);
  setTimeout(checkPosts, 3000);

  // Watch for new posts
  const observer = new MutationObserver(() => {
    clearTimeout(observer.timeout);
    observer.timeout = setTimeout(checkPosts, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('DOM observer started');
}

// Make globally accessible
window.initButtonInjection = initButtonInjection;
