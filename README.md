# Cookies Extractor Extension 🍪

A Chrome browser extension that extracts all cookies from any website and automatically copies them to your clipboard.

## Features

✨ **One-Click Cookie Extraction** - Extract all cookies from the current website instantly
📋 **View Cookies** - View the extracted cookies in a formatted textarea
📋 **Auto-Copy** - Automatically copy cookies to clipboard
🎨 **Beautiful UI** - Modern, user-friendly interface with gradient design
🔒 **Privacy Focused** - Works locally, no data sent to external servers

## How to Install

### Method 1: Load Unpacked Extension (Development)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Navigate to the `CookiesExtractor` folder and select it
5. The extension will appear in your Chrome extensions list

### Method 2: Manual Installation from Files

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Drag and drop the `CookiesExtractor` folder into the extensions page

## How to Use

1. **Install the extension** using one of the methods above
2. Navigate to any website
3. Click the **Cookies Extractor icon** in your Chrome toolbar
4. Click **"Extract & Copy Cookies"** to automatically copy all cookies to clipboard
5. Or click **"View Cookies"** to see the cookies before copying

## What It Does

- Reads all cookies from the current website's domain
- Formats them as `name=value; name=value; ...`
- Automatically copies them to your clipboard
- Shows the number of cookies found
- Displays the current domain

## File Structure

```
CookiesExtractor/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI
├── popup.css             # Styling
├── popup.js              # Popup logic
├── background.js         # Service worker
├── images/
│   ├── icon-16.png      # Icon (16x16)
│   ├── icon-48.png      # Icon (48x48)
│   └── icon-128.png     # Icon (128x128)
└── README.md            # This file
```

## Permissions Used

- `cookies` - To read cookies from websites
- `activeTab` - To access the current active tab
- `scripting` - For content scripts
- `<all_urls>` - To work on any website

## Technical Details

- **Manifest Version**: 3 (Latest Chrome extension standard)
- **Language**: JavaScript (Vanilla, no dependencies)
- **Compatibility**: Chrome 88+, Edge, and Chromium-based browsers

## Cookie Format

Cookies are copied in the following format:
```
session_id=abc123; user_token=xyz789; preferences=dark_mode
```

This format is compatible with:
- HTTP headers (Cookie)
- JavaScript (document.cookie)
- API requests
- Browser console testing

## Troubleshooting

### "No cookies found for this domain"
- Some websites may not set cookies (especially static content)
- Third-party cookies might be blocked by browser settings
- Reload the page and try again

### Extension not appearing in toolbar
- Ensure Developer mode is enabled in `chrome://extensions/`
- Check that the extension loaded without errors
- Refresh the page

### Copy to clipboard not working
- Check your browser permissions for the website
- Ensure you're using a secure context (https)
- Try clicking the button again

## Security Notes

⚠️ **Important**: Cookies often contain sensitive information like:
- Session tokens
- Authentication credentials
- Personal user data

**Be careful where you paste your cookies!** Only paste them in trusted applications or testing environments.

## Development

To modify this extension:

1. Edit the files in the extension directory
2. Refresh the extension in `chrome://extensions/`
3. Test on any website

The extension uses no external dependencies and runs entirely locally.

## Support

If you encounter issues:
1. Check the Chrome DevTools console for errors
2. Ensure all files are in the correct directory
3. Try refreshing the extension
4. Clear your browser cache

## License

Free to use and modify for personal use.

---

Made with ❤️ for cookie management
