/**
 * Minimal background service worker - just proxies API calls
 */

console.log('Ripple - Background service worker loaded');

// Open settings when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'generate-reply') {
    handleGenerateReply(message.tweetText, message.openrouterKey, message.model)
      .then(replies => sendResponse({ success: true, replies }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleGenerateReply(tweetText, openrouterKey, model = 'anthropic/claude-sonnet-4-20250514') {
  console.log('Generating replies for:', tweetText);
  console.log('Using model:', model);

  if (!openrouterKey) {
    throw new Error('No auth credentials found');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openrouterKey}`,
      'HTTP-Referer': 'https://github.com/yourusername/ripple',
      'X-Title': 'Ripple'
    },
    body: JSON.stringify({
      model: model,
      messages: [{
        role: 'user',
        content: `Generate 3 different short, engaging replies to this tweet. Make them conversational and varied in tone (friendly, thoughtful, funny). Return ONLY a JSON array with no other text:

Tweet: "${tweetText}"

Format: ["reply 1", "reply 2", "reply 3"]`
      }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  const jsonMatch = text.match(/\[.*\]/s);
  if (!jsonMatch) {
    throw new Error('Invalid API response format');
  }

  return JSON.parse(jsonMatch[0]);
}
