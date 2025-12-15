// Get current active tab
async function getCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
}

// Extract domain from URL
function getDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return '';
    }
}

// Format cookies for display
function formatCookies(cookies) {
    if (!cookies || cookies.length === 0) {
        return '';
    }
    
    return cookies.map(cookie => {
        return `${cookie.name}=${cookie.value}`;
    }).join('; ');
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

// Show status message
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
    
    if (type !== 'info') {
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'status';
        }, 3000);
    }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    const tab = await getCurrentTab();
    const domain = getDomain(tab.url);
    
    document.getElementById('domain').textContent = `Domain: ${domain || 'Unknown'}`;
    
    // Get all cookies for this domain
    if (domain) {
        try {
            const cookies = await chrome.cookies.getAll({ domain: domain });
            document.getElementById('count').textContent = `Cookies found: ${cookies.length}`;
            
            // Store cookies in popup for later use
            window.currentCookies = cookies;
        } catch (err) {
            console.error('Error getting cookies:', err);
            document.getElementById('count').textContent = 'Cookies found: 0';
        }
    }
});

// Extract & Copy button
document.getElementById('extractBtn').addEventListener('click', async () => {
    if (!window.currentCookies || window.currentCookies.length === 0) {
        showStatus('No cookies found for this domain', 'error');
        return;
    }
    
    const formattedCookies = formatCookies(window.currentCookies);
    const copied = await copyToClipboard(formattedCookies);
    
    if (copied) {
        showStatus(`✓ Copied ${window.currentCookies.length} cookies to clipboard!`, 'success');
    } else {
        showStatus('Failed to copy to clipboard', 'error');
    }
});

// View Cookies button
document.getElementById('viewBtn').addEventListener('click', () => {
    if (!window.currentCookies || window.currentCookies.length === 0) {
        showStatus('No cookies found', 'error');
        return;
    }
    
    const formattedCookies = formatCookies(window.currentCookies);
    document.getElementById('cookiesText').value = formattedCookies;
    document.getElementById('cookiesList').classList.remove('hidden');
});

// Copy from textarea
document.getElementById('copyBtn').addEventListener('click', async () => {
    const text = document.getElementById('cookiesText').value;
    const copied = await copyToClipboard(text);
    
    if (copied) {
        showStatus('✓ Copied to clipboard!', 'success');
    } else {
        showStatus('Failed to copy', 'error');
    }
});

// Close cookies list
document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('cookiesList').classList.add('hidden');
});
