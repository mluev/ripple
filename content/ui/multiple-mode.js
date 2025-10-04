/**
 * Multiple Mode - Select and reply to multiple posts at once
 */

let multipleMode = false;
let selectedPosts = new Map(); // Map of post element -> { element, tweetData, replies }
let generatedReplies = new Map(); // Store generated replies for persistence

const MULTIPLE_SELECTORS = {
  tweet: 'article[data-testid="tweet"]',
  primaryColumn: '[data-testid="primaryColumn"]'
};

function createMultipleToggleButton() {
  const button = document.createElement('button');
  button.id = 'ripple-multiple-toggle';
  button.className = 'ripple-multiple-toggle';
  button.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7" rx="1"></rect>
      <rect x="14" y="3" width="7" height="7" rx="1"></rect>
      <rect x="14" y="14" width="7" height="7" rx="1"></rect>
      <rect x="3" y="14" width="7" height="7" rx="1"></rect>
    </svg>
  `;
  button.setAttribute('aria-label', 'Multiple mode');
  button.addEventListener('click', toggleMultipleMode);
  return button;
}

function createGenerateButton() {
  const button = document.createElement('button');
  button.id = 'ripple-generate-batch';
  button.className = 'ripple-generate-batch';
  button.style.display = 'none';
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path>
      <path d="M16 8 2 22"></path>
      <path d="M17.5 15H9"></path>
    </svg>
    <span>Generate Replies (<span id="selected-count">0</span>)</span>
  `;
  button.addEventListener('click', handleBatchGenerate);
  return button;
}

function createCheckbox(postElement) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ripple-checkbox-wrapper';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'ripple-post-checkbox';
  checkbox.addEventListener('change', (e) => handleCheckboxChange(e, postElement));

  wrapper.appendChild(checkbox);
  return wrapper;
}

function toggleMultipleMode() {
  multipleMode = !multipleMode;
  const toggleBtn = document.getElementById('ripple-multiple-toggle');
  const generateBtn = document.getElementById('ripple-generate-batch');

  if (multipleMode) {
    toggleBtn.classList.add('active');
    generateBtn.style.display = 'flex';
    addCheckboxesToPosts();
  } else {
    toggleBtn.classList.remove('active');
    generateBtn.style.display = 'none';
    removeCheckboxesFromPosts();
    selectedPosts.clear();
    updateSelectedCount();
  }
}

function addCheckboxesToPosts() {
  const posts = document.querySelectorAll(MULTIPLE_SELECTORS.tweet);
  posts.forEach(post => {
    if (!post.querySelector('.ripple-post-checkbox')) {
      const checkboxWrapper = createCheckbox(post);

      // Find the action bar (where like, retweet, reply buttons are)
      const actionBar = post.querySelector('div[role="group"][aria-label]');
      if (actionBar) {
        actionBar.style.position = 'relative';
        actionBar.appendChild(checkboxWrapper);
      }
    }
  });
}

function removeCheckboxesFromPosts() {
  const checkboxes = document.querySelectorAll('.ripple-checkbox-wrapper');
  checkboxes.forEach(cb => cb.remove());
}

async function handleCheckboxChange(event, postElement) {
  if (event.target.checked) {
    if (selectedPosts.size >= 10) {
      event.target.checked = false;
      showNotification('error', 'Maximum 10 posts can be selected');
      return;
    }

    const tweetData = await extractTweetData(postElement);
    if (tweetData) {
      selectedPosts.set(postElement, { element: postElement, tweetData, replies: null });
    }
  } else {
    selectedPosts.delete(postElement);
  }
  updateSelectedCount();
}

function updateSelectedCount() {
  const countSpan = document.getElementById('selected-count');
  if (countSpan) {
    countSpan.textContent = selectedPosts.size;
  }
}

async function handleBatchGenerate() {
  if (selectedPosts.size === 0) {
    showNotification('error', 'Please select at least one post');
    return;
  }

  const generateBtn = document.getElementById('ripple-generate-batch');
  generateBtn.disabled = true;
  generateBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ripple-spin">
      <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path>
      <path d="M16 8 2 22"></path>
      <path d="M17.5 15H9"></path>
    </svg>
    <span>Generating...</span>
  `;

  try {
    const result = await chrome.storage.sync.get('settings');
    let apiKey = result.settings?.apiKey || result.settings?.openrouterKey;
    let model = result.settings?.model || 'claude-sonnet-4-20250514';
    const systemPrompt = result.settings?.systemPrompt || '';

    // Migrate old model format
    if (model && model.includes('/')) {
      model = model.split('/')[1];
    }

    if (!apiKey) {
      throw new Error('Please configure your Anthropic API key in settings');
    }

    // Get examples
    const examplesResult = await chrome.storage.local.get('examples');
    const examples = examplesResult.examples || [];

    // Prepare tweets array
    const tweets = Array.from(selectedPosts.values()).map(item => item.tweetData.text);

    // Send to background for batch generation
    chrome.runtime.sendMessage({
      action: 'generate-batch-replies',
      tweets: tweets,
      apiKey: apiKey,
      model: model,
      systemPrompt: systemPrompt,
      examples: examples
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Runtime error:', chrome.runtime.lastError);
        showNotification('error', 'Communication error');
        resetGenerateButton();
        return;
      }

      if (response.success) {
        console.log('✅ Batch replies:', response.repliesArray);

        // Store replies for each post
        const postsArray = Array.from(selectedPosts.keys());
        const repliesData = [];

        response.repliesArray.forEach((replies, index) => {
          const postElement = postsArray[index];
          const postData = selectedPosts.get(postElement);
          postData.replies = replies;
          selectedPosts.set(postElement, postData);

          // Prepare data for batch panel
          repliesData.push({
            postElement: postElement,
            tweetData: postData.tweetData,
            replies: replies
          });

          // Also store in persistent map
          generatedReplies.set(postElement, {
            tweetData: postData.tweetData,
            replies: replies
          });
        });

        showNotification('success', `Generated replies for ${selectedPosts.size} posts!`);

        // Show batch replies panel
        showBatchRepliesPanel(repliesData);

        // Clear selections and exit multiple mode
        selectedPosts.clear();
        updateSelectedCount();
        removeCheckboxesFromPosts();
        toggleMultipleMode();

        resetGenerateButton();
      } else {
        console.error('❌ Error:', response.error);
        showNotification('error', response.error);
        resetGenerateButton();
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    showNotification('error', error.message);
    resetGenerateButton();
  }
}

function resetGenerateButton() {
  const generateBtn = document.getElementById('ripple-generate-batch');
  generateBtn.disabled = false;
  generateBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"></path>
      <path d="M16 8 2 22"></path>
      <path d="M17.5 15H9"></path>
    </svg>
    <span>Generate Replies (<span id="selected-count">${selectedPosts.size}</span>)</span>
  `;
}


function initMultipleMode() {
  if (document.getElementById('ripple-multiple-toggle')) {
    return; // Already initialized
  }

  const toggleButton = createMultipleToggleButton();
  const generateButton = createGenerateButton();

  // Create container for buttons - add to body with fixed positioning
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'ripple-multiple-controls';
  buttonContainer.appendChild(toggleButton);

  // Add both buttons to body
  document.body.appendChild(buttonContainer);
  document.body.appendChild(generateButton);

  console.log('✅ Multiple Mode initialized');
}

// Re-add checkboxes when new posts load
const observer = new MutationObserver(() => {
  if (multipleMode) {
    addCheckboxesToPosts();
  }
});

// Only start observing after a delay to let the page load
setTimeout(() => {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}, 2000);

window.initMultipleMode = initMultipleMode;
