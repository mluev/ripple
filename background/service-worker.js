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
    handleGenerateReply(message.tweetText, message.apiKey, message.model)
      .then(replies => sendResponse({ success: true, replies }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.action === 'generate-batch-replies') {
    handleBatchGenerateReplies(message.tweets, message.apiKey, message.model, message.systemPrompt, message.examples)
      .then(repliesArray => sendResponse({ success: true, repliesArray }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function handleGenerateReply(tweetText, apiKey, model = 'claude-sonnet-4-20250514', systemPrompt = '') {
  console.log('\n\n🚀 ========================================');
  console.log('🚀 SINGLE REPLY REQUEST TO AI');
  console.log('🚀 ========================================');
  console.log('Tweet:', tweetText);
  console.log('Model:', model);

  if (!apiKey) {
    throw new Error('No auth credentials found');
  }

  // Get system prompt from storage if not provided
  if (!systemPrompt) {
    const result = await chrome.storage.sync.get('settings');
    systemPrompt = result.settings?.systemPrompt || '';
  }

  const userPrompt = systemPrompt
    ? `${systemPrompt}\n\nTweet: "${tweetText}"`
    : `Generate 3 natural, conversational replies to this tweet:\n\nTweet: "${tweetText}"`;

  // Comprehensive logging
  console.log('\n📝 SYSTEM PROMPT:', systemPrompt ? '✅ YES' : '❌ NO');
  if (systemPrompt) {
    console.log('   Length:', systemPrompt.length, 'characters');
    console.log('   Preview:', systemPrompt.substring(0, 150) + '...\n');
  }

  const requestBody = {
    model: model,
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: userPrompt
    }]
  };

  console.log('📦 EXACT REQUEST BODY:');
  console.log(JSON.stringify(requestBody, null, 2));
  console.log('\n📨 FULL MESSAGE CONTENT SENT TO AI:');
  console.log('---START---');
  console.log(requestBody.messages[0].content);
  console.log('---END---');
  console.log('========================================\n\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  const text = data.content[0].text;

  console.log('=== RAW API RESPONSE ===');
  console.log(text);
  console.log('=== END RESPONSE ===');

  // Try to parse "Option 1:" format first
  const optionMatches = text.match(/Option \d+:\s*(.+?)(?=\nOption \d+:|$)/gs);
  if (optionMatches && optionMatches.length >= 3) {
    const parsed = optionMatches.slice(0, 3).map(match => {
      // Extract just the reply text, remove "Option X:" prefix
      let replyText = match.replace(/Option \d+:\s*/, '').trim();
      // Remove any trailing newlines or extra whitespace
      replyText = replyText.replace(/\n+$/, '').trim();
      // Remove numbering at the start (1., 2., 3. etc)
      replyText = replyText.replace(/^\d+\.\s*/, '');
      // Remove bullets at the start (•, -, * etc)
      replyText = replyText.replace(/^[•\-*]\s*/, '');
      return replyText;
    });
    console.log('✅ Parsed replies (Option format):', parsed);
    return parsed;
  }

  // Fallback to JSON format
  const jsonMatch = text.match(/\[.*\]/s);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    console.log('✅ Parsed replies (JSON format):', parsed);
    return parsed;
  }

  // Last resort: split by newlines and take first 3 non-empty lines
  // Skip any preamble text (lines that look like instructions)
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => {
      // Skip empty lines
      if (!line) return false;
      // Skip lines that look like preamble (e.g., "Here are 3 natural replies:")
      if (line.toLowerCase().includes('here are') ||
          line.toLowerCase().includes('natural replies') ||
          line.toLowerCase().includes('conversational')) {
        return false;
      }
      return true;
    });

  if (lines.length >= 3) {
    const parsed = lines.slice(0, 3);
    console.log('✅ Parsed replies (line-by-line):', parsed);
    return parsed;
  }

  console.error('❌ Could not parse response');
  throw new Error('Invalid API response format');
}

async function handleBatchGenerateReplies(tweets, apiKey, model = 'claude-sonnet-4-20250514', systemPrompt = '', examples = []) {
  console.log('\n\n🚀 ========================================');
  console.log('🚀 BATCH REPLY REQUEST TO AI');
  console.log('🚀 ========================================');
  console.log('Number of tweets:', tweets.length);
  console.log('Model:', model);
  console.log('📝 SYSTEM PROMPT:', systemPrompt ? '✅ YES' : '❌ NO');
  console.log('📚 EXAMPLES:', examples?.length || 0);

  if (!apiKey) {
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
    console.log('\n📚 EXAMPLES ADDED TO PROMPT:');
    examples.slice(0, 5).forEach((ex, i) => {
      console.log(`   ${i + 1}. "${ex.text}"`);
    });
  }

  promptContent += `Generate replies for ${tweets.length} tweets below. For EACH tweet, provide 3 reply options in this exact format:

Tweet 1: [tweet text]
Option 1: [reply]
Option 2: [reply]
Option 3: [reply]

Tweet 2: [tweet text]
Option 1: [reply]
Option 2: [reply]
Option 3: [reply]

Tweets:
${tweets.map((t, i) => `Tweet ${i + 1}: "${t}"`).join('\n\n')}`;

  // Comprehensive logging
  if (systemPrompt) {
    console.log('\n📝 SYSTEM PROMPT DETAILS:');
    console.log('   Length:', systemPrompt.length, 'characters');
    console.log('   Preview:', systemPrompt.substring(0, 150) + '...\n');
  }

  const requestBody = {
    model: model,
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: promptContent
    }]
  };

  console.log('📦 EXACT REQUEST BODY:');
  console.log(JSON.stringify(requestBody, null, 2));
  console.log('\n📨 FULL MESSAGE CONTENT SENT TO AI:');
  console.log('---START---');
  console.log(requestBody.messages[0].content);
  console.log('---END---');
  console.log('========================================\n\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  const text = data.content[0].text;

  console.log('=== RAW BATCH API RESPONSE ===');
  console.log(text);
  console.log('=== END BATCH RESPONSE ===');

  // Parse the "Tweet X: / Option 1/2/3:" format
  const repliesArray = [];
  const tweetSections = text.split(/Tweet \d+:/g).filter(s => s.trim());

  console.log('Found', tweetSections.length, 'tweet sections');

  for (const section of tweetSections) {
    const optionMatches = section.match(/Option \d+:\s*(.+?)(?=\nOption \d+:|$)/gs);
    if (optionMatches && optionMatches.length >= 3) {
      const replies = optionMatches.slice(0, 3).map(match => {
        // Extract just the reply text, remove "Option X:" prefix
        let replyText = match.replace(/Option \d+:\s*/, '').trim();
        // Remove any trailing newlines or extra whitespace
        replyText = replyText.replace(/\n+$/, '').trim();
        // Remove numbering at the start (1., 2., 3. etc)
        replyText = replyText.replace(/^\d+\.\s*/, '');
        // Remove bullets at the start (•, -, * etc)
        replyText = replyText.replace(/^[•\-*]\s*/, '');
        return replyText;
      });
      console.log('✅ Parsed section replies:', replies);
      repliesArray.push(replies);
    }
  }

  // Fallback to JSON format
  if (repliesArray.length === 0) {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  }

  // Validate that we got the right number of reply sets
  if (repliesArray.length !== tweets.length) {
    throw new Error(`Expected ${tweets.length} reply sets, got ${repliesArray.length}`);
  }

  return repliesArray;
}
