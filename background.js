// Service worker for background operations
chrome.runtime.onInstalled.addListener(() => {
    console.log('Cookies Extractor extension installed');
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getCookies') {
        const domain = request.domain;
        
        chrome.cookies.getAll({ domain: domain }, (cookies) => {
            sendResponse({ cookies: cookies });
        });
        
        return true; // Keep channel open for async response
    }
});
