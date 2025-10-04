/**
 * Modal controller - X style
 */

async function insertTextIntoReply(text, postElement) {
  try {
    const replyButton = postElement.querySelector('[data-testid="reply"]');
    if (!replyButton) {
      showNotification('error', 'Could not find reply button');
      return;
    }

    replyButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));

    const replyBox = document.querySelector('[data-testid="tweetTextarea_0"]');
    if (!replyBox) {
      showNotification('error', 'Could not find reply box');
      return;
    }

    replyBox.focus();
    document.execCommand('insertText', false, text);
    showNotification('success', 'Reply inserted!');
  } catch (error) {
    console.error('Error inserting text:', error);
    showNotification('error', 'Failed to insert reply');
  }
}

function createReplyCard(reply, index) {
  const charCount = reply.length;
  const isOver = charCount > 280;
  return `
    <div class="reply-card" data-index="${index}">
      <div class="reply-card__text">${escapeHTML(reply)}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
        <div class="reply-card__count ${isOver ? 'reply-card__count--over' : ''}">
          ${charCount} / 280
        </div>
        <button class="save-example-btn" data-index="${index}" title="Save as example">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createModalElement(replies) {
  const modal = document.createElement('div');
  modal.className = 'ripple-modal-overlay';
  const replyCards = replies.map((reply, index) => createReplyCard(reply, index)).join('');

  modal.innerHTML = `
    <div class="ripple-modal-container">
      <div class="ripple-modal-header">
        <button class="ripple-modal-close" aria-label="Close">&times;</button>
        <h2 class="ripple-modal-title">AI Replies</h2>
      </div>
      <div class="ripple-modal-body">
        ${replyCards}
      </div>
    </div>
  `;

  return modal;
}

function closeModal(modal) {
  modal.classList.remove('ripple-modal-visible');
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }, 200);
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

function showReplyModal(replies, postElement) {
  // Use the new bottom-of-post UI instead of modal
  showRepliesForPost(postElement, replies);
}

window.showReplyModal = showReplyModal;

/**
 * Batch mode reply modal - shows post info and handles callback after reply
 */
function showBatchReplyModal(replies, postElement, tweetData, onReplySent) {
  const existingModals = document.querySelectorAll('.ripple-modal-overlay');
  existingModals.forEach(m => m.remove());

  const modal = createBatchModalElement(replies, tweetData);

  // Close button
  modal.querySelector('.ripple-modal-close').addEventListener('click', () => closeBatchModal(modal));

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeBatchModal(modal);
  });

  // Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeBatchModal(modal);
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Save example buttons
  modal.querySelectorAll('.save-example-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.getAttribute('data-index'));
      saveExample(replies[index]);
    });
  });

  // Reply card clicks - different flow for batch mode
  modal.querySelectorAll('.reply-card').forEach((card, index) => {
    card.addEventListener('click', async (e) => {
      // Don't trigger if clicking save button
      if (e.target.closest('.save-example-btn')) return;

      // Keep modal data in memory
      const selectedReply = replies[index];

      // Close modal temporarily
      closeBatchModal(modal);

      // Insert reply and wait for user to send
      await insertTextAndWaitForSend(selectedReply, postElement, () => {
        // Callback after user sends the reply
        if (onReplySent) {
          onReplySent();
        }
      });
    });
  });

  document.body.appendChild(modal);
  requestAnimationFrame(() => {
    modal.classList.add('ripple-modal-visible');
  });
}

function createBatchModalElement(replies, tweetData) {
  const modal = document.createElement('div');
  modal.className = 'ripple-modal-overlay';
  const replyCards = replies.map((reply, index) => createReplyCard(reply, index)).join('');

  modal.innerHTML = `
    <div class="ripple-modal-container">
      <div class="ripple-modal-header">
        <button class="ripple-modal-close" aria-label="Close">&times;</button>
        <h2 class="ripple-modal-title">AI Replies</h2>
      </div>
      <div class="ripple-modal-tweet-preview">
        <div class="tweet-preview-text">${escapeHTML(tweetData.text.substring(0, 100))}${tweetData.text.length > 100 ? '...' : ''}</div>
      </div>
      <div class="ripple-modal-body">
        ${replyCards}
      </div>
    </div>
  `;

  return modal;
}

function closeBatchModal(modal) {
  modal.classList.remove('ripple-modal-visible');
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }, 200);
}

async function insertTextAndWaitForSend(text, postElement, onSent) {
  try {
    const replyButton = postElement.querySelector('[data-testid="reply"]');
    if (!replyButton) {
      showNotification('error', 'Could not find reply button');
      return;
    }

    replyButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));

    const replyBox = document.querySelector('[data-testid="tweetTextarea_0"]');
    if (!replyBox) {
      showNotification('error', 'Could not find reply box');
      return;
    }

    replyBox.focus();
    document.execCommand('insertText', false, text);

    // Monitor for reply being sent
    // Watch for the reply dialog to close
    const dialogObserver = new MutationObserver((mutations) => {
      // Check if reply modal is gone
      const replyModal = document.querySelector('[role="dialog"]');
      const tweetTextarea = document.querySelector('[data-testid="tweetTextarea_0"]');

      if (!replyModal || !tweetTextarea) {
        // Reply was sent or canceled
        dialogObserver.disconnect();

        // Small delay to ensure the reply was sent (not canceled)
        setTimeout(() => {
          const stillOpen = document.querySelector('[data-testid="tweetTextarea_0"]');
          if (!stillOpen) {
            // Reply was actually sent
            showNotification('success', 'Reply sent!');
            if (onSent) {
              onSent();
            }
          }
        }, 100);
      }
    });

    dialogObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

  } catch (error) {
    console.error('Error inserting text:', error);
    showNotification('error', 'Failed to insert reply');
  }
}

window.showBatchReplyModal = showBatchReplyModal;
