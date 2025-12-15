async function getCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
}

function getDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return '';
    }
}

function formatCookies(cookies) {
    if (!cookies || cookies.length === 0) {
        return '';
    }
    
    return cookies.map(cookie => {
        return `${cookie.name}=${cookie.value}`;
    }).join('; ');
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
    
    setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'status';
    }, 2000);
}

function parseCookieString(cookieStr) {
    const cookies = [];
    const pairs = cookieStr.split(';');
    
    for (let pair of pairs) {
        pair = pair.trim();
        if (!pair) continue;
        
        const eqIndex = pair.indexOf('=');
        if (eqIndex === -1) continue;
        
        const name = pair.substring(0, eqIndex).trim();
        const value = pair.substring(eqIndex + 1).trim();
        
        if (name) {
            cookies.push({ name, value });
        }
    }
    
    return cookies;
}

async function insertCookies(cookiesStr, url) {
    const cookies = parseCookieString(cookiesStr);
    if (cookies.length === 0) {
        return { success: false, message: 'No valid cookies found' };
    }
    
    const urlObj = new URL(url);
    let successCount = 0;
    let failCount = 0;
    
    for (const cookie of cookies) {
        try {
            const cookieDetails = {
                url: url,
                name: cookie.name,
                value: cookie.value,
                path: '/'
            };
            
            if (urlObj.protocol === 'https:') {
                cookieDetails.secure = false;
            }
            
            await chrome.cookies.set(cookieDetails);
            successCount++;
        } catch (err) {
            console.error(`Failed to set cookie ${cookie.name}:`, err);
            
            try {
                const fallbackDetails = {
                    url: url,
                    name: cookie.name,
                    value: cookie.value
                };
                await chrome.cookies.set(fallbackDetails);
                successCount++;
            } catch (fallbackErr) {
                console.error(`Fallback also failed for ${cookie.name}:`, fallbackErr);
                failCount++;
            }
        }
    }
    
    return {
        success: successCount > 0,
        message: `Inserted ${successCount} cookie${successCount !== 1 ? 's' : ''}${failCount > 0 ? `, ${failCount} failed` : ''}`,
        count: successCount
    };
}

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

document.addEventListener('DOMContentLoaded', async () => {
    const tab = await getCurrentTab();
    const domain = getDomain(tab.url);
    
    document.getElementById('domain').textContent = domain || 'unknown';
    
    if (domain) {
        try {
            const cookies = await chrome.cookies.getAll({ url: tab.url });
            document.getElementById('count').textContent = cookies.length;
            
            window.currentCookies = cookies;
            
            renderCookies(cookies);
        } catch (err) {
            console.error('Error getting cookies:', err);
            document.getElementById('count').textContent = '0';
            renderCookies([]);
        }
    }
});

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

document.getElementById('insertToggle').addEventListener('click', () => {
    const panel = document.getElementById('insertPanel');
    const toggleBtn = document.getElementById('insertToggle');
    
    panel.classList.toggle('hidden');
    toggleBtn.classList.toggle('active');
    
    if (!panel.classList.contains('hidden')) {
        document.getElementById('cookiesInput').focus();
    }
});

document.getElementById('insertBtn').addEventListener('click', async () => {
    const cookiesStr = document.getElementById('cookiesInput').value.trim();
    
    if (!cookiesStr) {
        showStatus('Please paste cookies', 'error');
        return;
    }
    
    const tab = await getCurrentTab();
    const result = await insertCookies(cookiesStr, tab.url);
    
    if (result.success) {
        showStatus(result.message, 'success');
        
        document.getElementById('cookiesInput').value = '';
        document.getElementById('insertPanel').classList.add('hidden');
        document.getElementById('insertToggle').classList.remove('active');
        
        setTimeout(async () => {
            const cookies = await chrome.cookies.getAll({ url: tab.url });
            document.getElementById('count').textContent = cookies.length;
            window.currentCookies = cookies;
            renderCookies(cookies);
        }, 300);
    } else {
        showStatus(result.message, 'error');
    }
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('cookiesInput').value = '';
    document.getElementById('insertPanel').classList.add('hidden');
    document.getElementById('insertToggle').classList.remove('active');
});
