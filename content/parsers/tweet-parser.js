/**
 * Robust tweet parser with fallbacks
 */

async function extractTweetData(element) {
  console.log('Extracting tweet data from:', element);

  // Find tweet container
  let tweetContainer = element;
  if (!tweetContainer.matches('article[data-testid="tweet"]')) {
    tweetContainer = element.closest('article[data-testid="tweet"]');
  }

  if (!tweetContainer) {
    console.error('Could not find tweet container');
    return null;
  }

  console.log('Found tweet container:', tweetContainer);

  // Try multiple selectors for tweet text
  let text = '';
  const textSelectors = [
    '[data-testid="tweetText"]',
    'div[lang]',
    'div[dir="auto"]'
  ];

  for (const selector of textSelectors) {
    const textElement = tweetContainer.querySelector(selector);
    if (textElement && textElement.textContent.trim()) {
      text = textElement.textContent.trim();
      console.log(`Found text with selector "${selector}":`, text);
      break;
    }
  }

  // Last resort - get any text from the article
  if (!text) {
    const allText = tweetContainer.innerText || tweetContainer.textContent;
    // Take first meaningful chunk of text (skip short meta text)
    const lines = allText.split('\n').filter(line => line.trim().length > 10);
    text = lines[0] || '';
    console.log('Using fallback text extraction:', text);
  }

  if (!text) {
    console.error('Could not extract tweet text from container:', tweetContainer.innerHTML.substring(0, 500));
    return null;
  }

  console.log('✅ Extracted tweet text:', text);

  return {
    text: text,
    author: 'unknown',
    authorName: 'Unknown',
    timestamp: new Date().toISOString()
  };
}

// Make globally accessible
window.extractTweetData = extractTweetData;
