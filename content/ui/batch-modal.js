/**
 * Reply Cards - Show replies at bottom of posts
 */

// Show replies for a single post (single mode)
function showRepliesForPost(postElement, replies) {
  // Remove existing reply cards for this post
  const existing = postElement.querySelector('.ripple-replies-container');
  if (existing) {
    existing.remove();
  }

  // Find the article's child div (first child)
  const articleChild = postElement.querySelector(':scope > div');
  if (!articleChild) {
    console.error('Could not find article child div');
    return;
  }

  // Create replies container
  const container = createRepliesContainer(postElement, replies);
  articleChild.appendChild(container);
}

// Show replies for multiple posts (batch mode)
function showBatchRepliesPanel(repliesDataArray) {
  repliesDataArray.forEach(data => {
    showRepliesForPost(data.postElement, data.replies);
  });
  showNotification('success', `Generated replies for ${repliesDataArray.length} posts`);
}

function createRepliesContainer(postElement, replies) {
  const container = document.createElement('div');
  container.className = 'ripple-replies-container';

  const header = document.createElement('div');
  header.className = 'ripple-replies-header';
  header.innerHTML = `
    <span class="ripple-replies-title">Generated Replies</span>
    <button class="ripple-replies-close" aria-label="Close">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"/>
      </svg>
    </button>
  `;

  const repliesGrid = document.createElement('div');
  repliesGrid.className = 'ripple-replies-grid';

  replies.forEach((reply, index) => {
    const card = createReplyCard(postElement, reply, index);
    repliesGrid.appendChild(card);
  });

  container.appendChild(header);
  container.appendChild(repliesGrid);

  // Close button handler
  header.querySelector('.ripple-replies-close').addEventListener('click', () => {
    container.remove();
  });

  return container;
}

function createReplyCard(postElement, reply, replyIndex) {
  const card = document.createElement('div');
  card.className = 'ripple-reply-card';

  const charCount = reply.length;
  const isOver = charCount > 280;

  card.innerHTML = `
    <div class="ripple-reply-text">${escapeHTML(reply)}</div>
    <div class="ripple-reply-footer">
      <span class="ripple-reply-count ${isOver ? 'ripple-reply-count--over' : ''}">${charCount}/280</span>
      <button class="ripple-save-example" title="Save as example">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/>
        </svg>
      </button>
    </div>
  `;

  // Click handler for the card
  card.addEventListener('click', async (e) => {
    // Stop propagation to prevent article click (going to post page)
    e.stopPropagation();
    e.preventDefault();

    if (e.target.closest('.ripple-save-example')) {
      await saveExample(reply);
      return;
    }
    await handleReplyClick(postElement, reply);
  });

  return card;
}

async function handleReplyClick(postElement, reply) {
  console.log('=== REPLY CLICK DEBUG ===');
  console.log('Reply text:', reply);
  console.log('Post element:', postElement);
  console.log('Post element in DOM:', document.contains(postElement));

  try {
    // Find and click reply button
    const replyButton = postElement.querySelector('[data-testid="reply"]');
    console.log('Reply button found:', replyButton);

    if (!replyButton) {
      showNotification('error', 'Could not find reply button');
      return;
    }

    console.log('Clicking reply button...');
    replyButton.click();
    await new Promise(resolve => setTimeout(resolve, 800));

    // Insert text
    const replyBox = document.querySelector('[data-testid="tweetTextarea_0"]');
    console.log('Reply box found:', replyBox);

    if (!replyBox) {
      showNotification('error', 'Could not find reply box');
      return;
    }

    replyBox.focus();
    document.execCommand('insertText', false, reply);
    showNotification('success', 'Reply inserted!');
    console.log('=== REPLY CLICK SUCCESS ===');
  } catch (error) {
    console.error('=== REPLY CLICK ERROR ===');
    console.error('Error inserting reply:', error);
    showNotification('error', 'Failed to insert reply');
  }
}

function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function saveExample(text) {
  try {
    const result = await chrome.storage.local.get('examples');
    const examples = result.examples || [];

    const newExample = {
      id: Date.now().toString(),
      text: text,
      createdAt: new Date().toISOString()
    };

    examples.push(newExample);
    await chrome.storage.local.set({ examples });

    showNotification('success', 'Example saved!');
  } catch (error) {
    console.error('Error saving example:', error);
    showNotification('error', 'Failed to save example');
  }
}

window.showBatchRepliesPanel = showBatchRepliesPanel;
window.closeBatchPanel = closeBatchPanel;
