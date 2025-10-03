# Smart Reply - AI Twitter Assistant

AI-powered Twitter reply generation using Claude. Generate personalized, natural-sounding replies with just one click.

## Features

- 🤖 **AI-Powered Replies**: Generate 3 reply variations using Claude AI
- ✨ **Personalization**: Save example replies to match your writing style
- ⚡ **Fast & Easy**: One-click button integrated into Twitter's interface
- 🎨 **Beautiful UI**: Matches Twitter's design language perfectly
- 🔒 **Private & Secure**: API key encrypted, no external tracking

## Installation

### Development Setup

1. **Clone or download this repository**

2. **Install icons** (Required before loading):
   The extension needs PNG icons. Convert the SVG icon:
   ```bash
   # Install ImageMagick (if not installed)
   # macOS: brew install imagemagick
   # Ubuntu: sudo apt-get install imagemagick

   # Convert SVG to PNGs
   convert -background none -resize 16x16 assets/icons/icon.svg assets/icons/icon16.png
   convert -background none -resize 48x48 assets/icons/icon.svg assets/icons/icon48.png
   convert -background none -resize 128x128 assets/icons/icon.svg assets/icons/icon128.png
   ```

   Alternatively, you can create simple placeholder images:
   - Create 16x16, 48x48, and 128x128 PNG files
   - Fill with purple (#7856FF) and add a sparkle emoji ✨

3. **Load extension in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `smart-reply-extension` directory
   - Extension should load without errors

4. **Configure API Key**:
   - Click the extension icon
   - Click "Settings"
   - Enter your Anthropic Claude API key
   - Get one at: https://console.anthropic.com/
   - Click "Test Connection" to verify
   - Click "Save Settings"

## Usage

### Basic Usage

1. **Go to Twitter/X** (twitter.com or x.com)
2. **Open any tweet** and click the reply button
3. **Look for the purple "AI Reply" button** in the composer toolbar
4. **Click it** to generate 3 reply variations
5. **Select your favorite** and it will be inserted into the reply box
6. **Review and post** (you can edit it first)

### Adding Examples

To personalize replies to match your style:

1. Open **Settings** (click extension icon → Settings)
2. Scroll to **"Saved Examples"**
3. Click **"+ Add Example"**
4. Paste a reply you've written that represents your style
5. Save up to 10 examples

The AI will learn from your examples and generate replies that sound more like you!

### Custom System Prompt

For advanced users:

1. Go to **Settings**
2. Edit the **"System Prompt"** section
3. Customize how the AI behaves
4. Click **"Reset to Default"** to restore original

## Project Structure

```
smart-reply-extension/
├── manifest.json                    # Extension configuration
├── background/
│   ├── service-worker.js           # Background service worker
│   ├── message-handler.js          # Message routing
│   └── api-client.js               # Claude API client
├── content/
│   ├── content-script.js           # Content script entry
│   ├── ui/
│   │   ├── button-injector.js      # Button injection logic
│   │   ├── modal-controller.js     # Reply modal
│   │   └── notification.js         # Toast notifications
│   ├── parsers/
│   │   └── tweet-parser.js         # Tweet data extraction
│   └── styles/                     # CSS files
├── settings/
│   ├── settings.html               # Settings page
│   ├── settings.js                 # Settings logic
│   └── styles/                     # Settings styles
├── popup/
│   ├── popup.html                  # Extension popup
│   ├── popup.js                    # Popup logic
│   └── popup.css                   # Popup styles
├── utils/
│   ├── constants.js                # App constants
│   ├── storage.js                  # Storage utilities
│   ├── validation.js               # Input validation
│   └── prompt-builder.js           # AI prompt builder
└── config/
    ├── models.json                 # AI model config
    ├── default-prompts.json        # Default prompts
    └── twitter-selectors.json      # DOM selectors
```

## Development

### Architecture

- **Message-driven**: All communication between content scripts and background uses Chrome's message passing
- **Modular**: Each component has a single responsibility
- **ES Modules**: Uses modern JavaScript modules
- **No external dependencies**: Minimal dependencies, vanilla JS where possible

### Key Technologies

- Chrome Extension Manifest V3
- Anthropic Claude API
- Modern JavaScript (ES6+)
- Chrome Storage API (sync + local)

### Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension
4. Test on Twitter/X

### Debugging

- **Background scripts**: Check `chrome://extensions/` → "Inspect views: service worker"
- **Content scripts**: Right-click on Twitter → "Inspect" → Console tab
- **Settings page**: Right-click on settings → "Inspect"

Look for console logs prefixed with "Smart Reply Extension"

## Configuration Files

### models.json
Defines AI models and their configurations. Currently supports Claude 3.5 Sonnet.

### default-prompts.json
Contains default system prompts and instructions for the AI.

### twitter-selectors.json
CSS selectors for finding elements on Twitter. May need updates if Twitter changes their DOM structure.

## Troubleshooting

### Extension won't load
- Make sure icons are created (see Installation step 2)
- Check `chrome://extensions/` for error messages
- Verify manifest.json is valid JSON

### AI button doesn't appear
- Refresh the Twitter page
- Check if extension is enabled
- Look for console errors in DevTools
- Twitter may have changed their DOM structure - update selectors

### API errors
- Verify API key is correct (starts with `sk-ant-`)
- Test connection in Settings
- Check Anthropic API status
- Verify you have API credits

### Replies are generic
- Add more examples to personalize
- Customize the system prompt
- Examples should represent your writing style

## Security & Privacy

- ✅ API key encrypted in storage
- ✅ No external tracking or analytics
- ✅ Data stays local (except API calls to Anthropic)
- ✅ Open source - verify the code yourself
- ✅ No permissions beyond what's needed

## License

MIT License - see LICENSE file

## Credits

Built with Claude Code by Anthropic

## Support

For issues or questions:
- Check this README first
- Review the code (it's well documented)
- Open an issue on GitHub

---

**Note**: This extension is not affiliated with Twitter/X or Anthropic. It's an independent tool that uses the Claude API.
