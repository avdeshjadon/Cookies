# Cookies Extractor

A Chrome browser extension that allows you to extract, view, copy, and insert cookies from any website with a clean and modern interface.

## Features

- **Extract Cookies**: View all cookies from the current website domain
- **Copy Individual Cookies**: Copy any single cookie with one click
- **Copy All Cookies**: Copy all cookies in `name=value; name=value` format
- **Insert Cookies**: Paste and insert cookies into the current domain
- **Real-time Count**: Display the total number of cookies found
- **Modern UI**: Clean, minimalist interface with smooth animations
- **Privacy Focused**: All operations are performed locally, no data sent to external servers

## Installation

### From Source

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the extension folder
6. The extension icon will appear in your toolbar

## Usage

### Viewing Cookies

1. Navigate to any website
2. Click the extension icon in your Chrome toolbar
3. All cookies from the current domain will be displayed
4. The cookie count is shown in the header

### Copying Cookies

- **Copy All**: Click the "COPY ALL" button to copy all cookies in semicolon-separated format
- **Copy Individual**: Click "Copy" next to any cookie to copy just that cookie

### Inserting Cookies

1. Click the **+** button in the header to open the insert panel
2. Paste your cookies in the format: `name=value; name2=value2`
3. Click **Insert Cookies** to add them to the current domain
4. The cookie list will refresh automatically

## File Structure

```
Cookies/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI structure
├── popup.css            # Styles for popup interface
├── popup.js             # Popup logic and cookie operations
├── background.js         # Service worker
├── images/
│   ├── icon-16.png      # Icon (16x16)
│   ├── icon-48.png      # Icon (48x48)
│   └── icon-128.png     # Icon (128x128)
├── LICENSE              # MIT License
└── README.md            # This file
```

## Permissions Used

- `cookies` - To read and set cookies on websites
- `activeTab` - To access the current active tab
- `scripting` - For content scripts (future use)
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

## Security Notes

⚠️ **Important**: Cookies often contain sensitive information like:
- Session tokens
- Authentication credentials
- Personal user data

**Be careful where you paste your cookies!** Only use them in trusted applications or testing environments.

## Development

To modify this extension:

1. Edit the files in the extension directory
2. Refresh the extension in `chrome://extensions/`
3. Test on any website

The extension uses no external dependencies and runs entirely locally.

## License

MIT License - Copyright (c) 2025 Avdesh Jadon

See [LICENSE](LICENSE) file for details.

## Author

**Avdesh Jadon**

## Support

If you encounter issues:
1. Check the Chrome DevTools console for errors
2. Ensure all files are in the correct directory
3. Try refreshing the extension in Chrome
4. Reload the webpage you're trying to extract cookies from


---

Made with ❤️ for cookie management
