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

  if (message.action === 'generate-batch-replies') {
    handleBatchGenerateReplies(message.tweets, message.openrouterKey, message.model, message.systemPrompt, message.examples)
      .then(repliesArray => sendResponse({ success: true, repliesArray }))
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

async function handleBatchGenerateReplies(tweets, openrouterKey, model = 'anthropic/claude-sonnet-4-20250514', systemPrompt = '', examples = []) {
  console.log('Generating batch replies for', tweets.length, 'tweets');
  console.log('Using model:', model);

  if (!openrouterKey) {
    throw new Error('No auth credentials found');
  }

  // Build prompt with system instructions and examples
  let promptContent = systemPrompt ? `${systemPrompt}\n\n` : '';

  if (examples.length > 0) {
    promptContent += 'Here are some example replies to match the style:\n';
    examples.slice(0, 5).forEach((ex, i) => {
      promptContent += `${i + 1}. "${ex.text}"\n`;
    });
    promptContent += '\n';
  }

  promptContent += `Generate 3 different short, engaging replies for EACH of the following tweets. Make them conversational and varied in tone (friendly, thoughtful, funny).

Return ONLY a JSON array of arrays, where each inner array contains 3 replies for the corresponding tweet:

Tweets:
${tweets.map((t, i) => `${i + 1}. "${t}"`).join('\n')}

Format: [["reply1", "reply2", "reply3"], ["reply1", "reply2", "reply3"], ...]`;

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
        content: promptContent
      }]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Invalid API response format');
  }

  const repliesArray = JSON.parse(jsonMatch[0]);

  // Validate that we got the right number of reply sets
  if (repliesArray.length !== tweets.length) {
    throw new Error(`Expected ${tweets.length} reply sets, got ${repliesArray.length}`);
  }

  return repliesArray;
}
