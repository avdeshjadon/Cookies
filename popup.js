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
    
    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'status';
    }, 2000);
}

// Render cookies list
function renderCookies(cookies) {
    const listEl = document.getElementById('cookiesList');
    listEl.innerHTML = '';
    
    if (!cookies || cookies.length === 0) {
        listEl.innerHTML = '<div style="font-size: 11px; color: #666; text-align: center;">No cookies found</div>';
        return;
    }
    
    cookies.forEach((cookie) => {
        const item = document.createElement('div');
        item.className = 'cookie-item';
        
        const info = document.createElement('div');
        info.className = 'cookie-info';
        
        const name = document.createElement('div');
        name.className = 'cookie-name';
        name.textContent = cookie.name;
        
        const value = document.createElement('div');
        value.className = 'cookie-value';
        value.textContent = cookie.value;
        
        info.appendChild(name);
        info.appendChild(value);
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'cookie-copy';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = async () => {
            const cookieStr = `${cookie.name}=${cookie.value}`;
            const copied = await copyToClipboard(cookieStr);
            if (copied) {
                copyBtn.textContent = '✓';
                setTimeout(() => copyBtn.textContent = 'Copy', 1500);
            }
        };
        
        item.appendChild(info);
        item.appendChild(copyBtn);
        listEl.appendChild(item);
    });
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    const tab = await getCurrentTab();
    const domain = getDomain(tab.url);
    
    document.getElementById('domain').textContent = domain || 'unknown';
    
    // Get all cookies for this domain
    if (domain) {
        try {
            const cookies = await chrome.cookies.getAll({ url: tab.url });
            document.getElementById('count').textContent = cookies.length;
            
            // Store cookies in popup for later use
            window.currentCookies = cookies;
            
            // Render cookies list
            renderCookies(cookies);
        } catch (err) {
            console.error('Error getting cookies:', err);
            document.getElementById('count').textContent = '0';
            renderCookies([]);
        }
    }
});

// Copy all cookies button
document.getElementById('copyAllBtn').addEventListener('click', async () => {
    if (!window.currentCookies || window.currentCookies.length === 0) {
        showStatus('No cookies', 'error');
        return;
    }
    
    const formattedCookies = formatCookies(window.currentCookies);
    const copied = await copyToClipboard(formattedCookies);
    
    if (copied) {
        showStatus(`Copied ${window.currentCookies.length} cookies`, 'success');
    } else {
        showStatus('Failed to copy', 'error');
    }
});
