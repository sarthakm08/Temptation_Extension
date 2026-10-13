import { ExtensionArchitecture, ExtensionSpecification, GeneratedFile } from '@/types/extension';

// Minimal valid transparent/neon PNG byte data in base64
// Purple cyber square with crisp icon styling
const ICON_16_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZElEQVQ4T2NkoBAwUqifYdQADgX/GT7e/8/w4P9/hj///jP8ZfgPJUFsgKrn+3+GPwz/Gf4wMGBRQcgAHuTjBxg+wA1kYGBg8P//n2EI42Y4Ff6H6sVjAFg5b6i7k4Fq/ic/3wMAy7E14+P8YqYAAAAASUVORK5CYII=';
const ICON_48_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAhUlEQVR42u3QMQ7AIAxF0d7/0jmD1g4tQ+XoQ6yA73lBkgwAAAAAAAC40yfpVlXyWJ08x6yT51d1M1WdPOeom6nq5Lk16lq/U9XJc2vUtX6nqpPn1qhr/U5VJ8+tUdf6napOnlujrvU7VZ08t0Zd63eqOnlujbrW71R18twadS0AAAAAmOUFq3g64V1TjDMAAAAASUVORK5CYII=';
const ICON_128_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAnUlEQVR42u3QAQ0AAAjAMMC/adLh+AgkYMmqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp69AAd72Xy7yNfXAAAAABJRU5ErkJggg==';

export function generateExtensionFiles(
  spec: ExtensionSpecification,
  arch: ExtensionArchitecture
): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const isYouTube = spec.targetSites.some(s => s.includes('youtube'));

  // 1. Manifest V3
  const manifestObject = {
    manifest_version: 3,
    name: spec.name,
    version: spec.version,
    description: spec.description,
    permissions: spec.permissions,
    host_permissions: spec.hostPermissions,
    action: {
      default_popup: 'popup.html',
      default_icon: {
        '16': 'icons/icon-16.png',
        '48': 'icons/icon-48.png',
        '128': 'icons/icon-128.png'
      }
    },
    icons: {
      '16': 'icons/icon-16.png',
      '48': 'icons/icon-48.png',
      '128': 'icons/icon-128.png'
    },
    ...(spec.components.includes('service_worker') ? {
      background: {
        service_worker: 'background.js',
        type: 'module'
      }
    } : {}),
    ...(spec.components.includes('content_script') ? {
      content_scripts: [
        {
          matches: spec.targetSites,
          js: ['content.js'],
          css: ['content.css'],
          run_at: 'document_idle'
        }
      ]
    } : {}),
    ...(spec.components.includes('options') ? {
      options_ui: {
        page: 'options.html',
        open_in_tab: true
      }
    } : {})
  };

  files.push({
    path: 'manifest.json',
    language: 'json',
    description: 'Manifest V3 configuration declaring extension metadata, permissions, and entrypoints.',
    content: JSON.stringify(manifestObject, null, 2)
  });

  // 2. Icons
  files.push({
    path: 'icons/icon-16.png',
    language: 'image',
    description: '16x16 Extension toolbar icon binary.',
    content: ICON_16_BASE64
  });
  files.push({
    path: 'icons/icon-48.png',
    language: 'image',
    description: '48x48 Extension management page icon binary.',
    content: ICON_48_BASE64
  });
  files.push({
    path: 'icons/icon-128.png',
    language: 'image',
    description: '128x128 Chrome Web Store & installation icon binary.',
    content: ICON_128_BASE64
  });

  // 3. Popup HTML & CSS & JS
  files.push({
    path: 'popup.html',
    language: 'html',
    description: 'Dark Temptation styled popup interface.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${spec.name}</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="popup-container">
    <header class="header">
      <div class="logo-badge">
        <span class="pulse-dot"></span>
        <span class="logo-title">TEMPTATION // CORE</span>
      </div>
      <span class="status-tag">ACTIVE</span>
    </header>

    <div class="hero-stats">
      <div class="stat-box">
        <span class="stat-label">SESSION TIME</span>
        <span class="stat-value" id="watchTimeDisplay">00:00:00</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">FOCUS LEVEL</span>
        <span class="stat-value highlight-cyan" id="focusLevel">MAX</span>
      </div>
    </div>

    <section class="controls-section">
      <h3 class="section-title">FEATURE PROTOCOLS</h3>

      <div class="control-row">
        <div class="control-info">
          <label for="toggleShorts" class="control-name">Hide YouTube Shorts</label>
          <span class="control-desc">Suppresses shorts shelves and reels</span>
        </div>
        <label class="switch">
          <input type="checkbox" id="toggleShorts" checked>
          <span class="slider"></span>
        </label>
      </div>

      <div class="control-row">
        <div class="control-info">
          <label for="toggleTheme" class="control-name">Dark Temptation Neon Theme</label>
          <span class="control-desc">Deep obsidian & purple neon styling</span>
        </div>
        <label class="switch">
          <input type="checkbox" id="toggleTheme" checked>
          <span class="slider"></span>
        </label>
      </div>

      <div class="control-row">
        <div class="control-info">
          <label for="toggleDistractions" class="control-name">Hide Sidebar Distractions</label>
          <span class="control-desc">Focus purely on current content</span>
        </div>
        <label class="switch">
          <input type="checkbox" id="toggleDistractions" checked>
          <span class="slider"></span>
        </label>
      </div>

      <div class="control-row">
        <div class="control-info">
          <label for="toggleShortcuts" class="control-name">Speed Shortcuts ([ / ])</label>
          <span class="control-desc">Fast playback rate adjustments</span>
        </div>
        <label class="switch">
          <input type="checkbox" id="toggleShortcuts" checked>
          <span class="slider"></span>
        </label>
      </div>
    </section>

    <footer class="footer">
      <button id="resetStatsBtn" class="btn-secondary">Reset Telemetry</button>
      <a href="options.html" target="_blank" class="btn-primary">Settings</a>
    </footer>
  </div>
  <script src="popup.js"></script>
</body>
</html>`
  });

  files.push({
    path: 'popup.css',
    language: 'css',
    description: 'Sleek cyber-luxury Dark Temptation styles for the extension popup.',
    content: `:root {
  --bg-dark: #08080D;
  --bg-card: #12121D;
  --neon-violet: #A855F7;
  --neon-crimson: #FF3158;
  --neon-cyan: #35E7FF;
  --text-main: #F5F5FA;
  --text-dim: #8B8BA3;
  --border-color: rgba(168, 85, 247, 0.2);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  width: 340px;
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 16px;
  user-select: none;
}

.popup-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.logo-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--neon-crimson);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--neon-crimson);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.logo-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-main);
}

.status-tag {
  font-size: 10px;
  font-weight: 700;
  color: var(--neon-cyan);
  background: rgba(53, 231, 255, 0.1);
  padding: 3px 8px;
  border-radius: 12px;
  border: 1px solid rgba(53, 231, 255, 0.25);
}

.hero-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 9px;
  color: var(--text-dim);
  letter-spacing: 0.5px;
  font-weight: 600;
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  font-family: monospace;
  color: var(--neon-violet);
}

.stat-value.highlight-cyan {
  color: var(--neon-cyan);
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-dim);
  font-weight: 700;
}

.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(18, 18, 29, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.control-row:hover {
  border-color: var(--border-color);
  background: rgba(24, 24, 38, 0.8);
}

.control-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 220px;
}

.control-name {
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.control-desc {
  font-size: 10px;
  color: var(--text-dim);
}

/* Switch styling */
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #252538;
  transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #F5F5FA;
  transition: .3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--neon-violet);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
}

input:checked + .slider:before {
  transform: translateX(18px);
}

.footer {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, var(--neon-violet), #7C3AED);
  color: #FFF;
  border: none;
}

.btn-primary:hover {
  filter: brightness(1.15);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.5);
}

.btn-secondary {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  color: var(--text-main);
  background: rgba(168, 85, 247, 0.1);
}
`
  });

  files.push({
    path: 'popup.js',
    language: 'javascript',
    description: 'Popup controller wiring toggle states to chrome.storage and live telemetry updates.',
    content: `// TEMPTATION AI — Chrome Extension Controller
document.addEventListener('DOMContentLoaded', async () => {
  const toggleShorts = document.getElementById('toggleShorts');
  const toggleTheme = document.getElementById('toggleTheme');
  const toggleDistractions = document.getElementById('toggleDistractions');
  const toggleShortcuts = document.getElementById('toggleShortcuts');
  const watchTimeDisplay = document.getElementById('watchTimeDisplay');
  const resetStatsBtn = document.getElementById('resetStatsBtn');

  // Load persistent user preferences
  const defaults = {
    hideShorts: true,
    darkTheme: true,
    hideDistractions: true,
    customShortcuts: true,
    secondsSpent: 0
  };

  const stored = await chrome.storage.local.get(defaults);

  if (toggleShorts) toggleShorts.checked = stored.hideShorts;
  if (toggleTheme) toggleTheme.checked = stored.darkTheme;
  if (toggleDistractions) toggleDistractions.checked = stored.hideDistractions;
  if (toggleShortcuts) toggleShortcuts.checked = stored.customShortcuts;

  formatSeconds(stored.secondsSpent);

  // Bind change events
  toggleShorts.addEventListener('change', async () => {
    await chrome.storage.local.set({ hideShorts: toggleShorts.checked });
    notifyActiveTab();
  });

  toggleTheme.addEventListener('change', async () => {
    await chrome.storage.local.set({ darkTheme: toggleTheme.checked });
    notifyActiveTab();
  });

  toggleDistractions.addEventListener('change', async () => {
    await chrome.storage.local.set({ hideDistractions: toggleDistractions.checked });
    notifyActiveTab();
  });

  toggleShortcuts.addEventListener('change', async () => {
    await chrome.storage.local.set({ customShortcuts: toggleShortcuts.checked });
    notifyActiveTab();
  });

  resetStatsBtn.addEventListener('click', async () => {
    await chrome.storage.local.set({ secondsSpent: 0 });
    formatSeconds(0);
  });

  // Live timer update
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.secondsSpent) {
      formatSeconds(changes.secondsSpent.newValue || 0);
    }
  });

  function formatSeconds(totalSec) {
    const hours = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(totalSec % 60).toString().padStart(2, '0');
    watchTimeDisplay.textContent = \`\${hours}:\${minutes}:\${seconds}\`;
  }

  async function notifyActiveTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'TEMPTATION_CONFIG_UPDATED' }).catch(() => {
          // Tab may not have content script injected (e.g. settings page)
        });
      }
    } catch {
      // Ignored if unsupported context
    }
  }
});
`
  });

  // 4. Content Script & Content CSS
  files.push({
    path: 'content.js',
    language: 'javascript',
    description: 'Dynamic DOM observer and feature engine for target webpage.',
    content: `// TEMPTATION AI — Content Engine
(async () => {
  console.log('[TEMPTATION AI] Extension loaded on target page.');

  let config = {
    hideShorts: true,
    darkTheme: true,
    hideDistractions: true,
    customShortcuts: true
  };

  // Sync initial configuration
  const stored = await chrome.storage.local.get(config);
  config = { ...config, ...stored };

  applyFeatures();

  // Listen for real-time config changes
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TEMPTATION_CONFIG_UPDATED') {
      chrome.storage.local.get(config).then(latest => {
        config = { ...config, ...latest };
        applyFeatures();
      });
      sendResponse({ status: 'ok' });
    }
    return true;
  });

  // Track session viewing time
  let sessionSeconds = 0;
  setInterval(async () => {
    if (!document.hidden) {
      sessionSeconds++;
      if (sessionSeconds % 5 === 0) {
        const { secondsSpent = 0 } = await chrome.storage.local.get('secondsSpent');
        await chrome.storage.local.set({ secondsSpent: secondsSpent + 5 });
      }
    }
  }, 1000);

  // Playback keyboard shortcuts ([ slows down, ] speeds up)
  window.addEventListener('keydown', (e) => {
    if (!config.customShortcuts) return;
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
      return;
    }

    const video = document.querySelector('video');
    if (!video) return;

    if (e.key === '[') {
      video.playbackRate = Math.max(0.25, Number((video.playbackRate - 0.25).toFixed(2)));
      showToast(\`Playback: \${video.playbackRate}x\`);
    } else if (e.key === ']') {
      video.playbackRate = Math.min(3.0, Number((video.playbackRate + 0.25).toFixed(2)));
      showToast(\`Playback: \${video.playbackRate}x\`);
    }
  });

  function applyFeatures() {
    // Theme application
    if (config.darkTheme) {
      document.documentElement.classList.add('temptation-neon-theme');
    } else {
      document.documentElement.classList.remove('temptation-neon-theme');
    }

    // Shorts hiding
    if (config.hideShorts) {
      document.documentElement.classList.add('temptation-hide-shorts');
    } else {
      document.documentElement.classList.remove('temptation-hide-shorts');
    }

    // Distraction hiding
    if (config.hideDistractions) {
      document.documentElement.classList.add('temptation-focus-mode');
    } else {
      document.documentElement.classList.remove('temptation-focus-mode');
    }
  }

  // Toast indicator
  function showToast(text) {
    let toast = document.getElementById('temptation-hud-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'temptation-hud-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 1200);
  }
})();
`
  });

  files.push({
    path: 'content.css',
    language: 'css',
    description: 'DOM override stylesheets for distraction elimination and neon styling.',
    content: `/* TEMPTATION AI — Injected Styling */

/* 1. Hide YouTube Shorts */
.temptation-hide-shorts ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
.temptation-hide-shorts ytd-reel-shelf-renderer,
.temptation-hide-shorts ytd-guide-entry-renderer:has(a[title="Shorts"]),
.temptation-hide-shorts ytd-mini-guide-entry-renderer[aria-label="Shorts"],
.temptation-hide-shorts a[href^="/shorts"] {
  display: none !important;
}

/* 2. Hide Distractions & Focus Mode */
.temptation-focus-mode #comments,
.temptation-focus-mode ytd-live-chat-frame,
.temptation-focus-mode #secondary #related {
  opacity: 0.15;
  transition: opacity 0.3s ease;
}

.temptation-focus-mode #comments:hover,
.temptation-focus-mode #secondary #related:hover {
  opacity: 1;
}

/* 3. Dark Temptation Neon Palette */
.temptation-neon-theme {
  --yt-spec-base-background: #08080D !important;
  --yt-spec-raised-background: #11111B !important;
  --yt-spec-menu-background: #161622 !important;
}

.temptation-neon-theme #page-manager,
.temptation-neon-theme ytd-app {
  background-color: #08080D !important;
}

.temptation-neon-theme #logo-icon {
  filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.6)) hue-rotate(270deg) !important;
}

/* On-screen HUD Toast */
#temptation-hud-toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: rgba(8, 8, 13, 0.95);
  color: #35E7FF;
  border: 1px solid rgba(53, 231, 255, 0.4);
  padding: 8px 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 0 16px rgba(53, 231, 255, 0.3);
  z-index: 9999999;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.25s ease;
  pointer-events: none;
}

#temptation-hud-toast.visible {
  opacity: 1;
  transform: translateY(0);
}
`
  });

  // 5. Service Worker (Background)
  if (spec.components.includes('service_worker')) {
    files.push({
      path: 'background.js',
      language: 'javascript',
      description: 'Ephemeral background service worker handling alarms and telemetry.',
      content: `// TEMPTATION AI — Background Service Worker
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[TEMPTATION AI] Service Worker installed:', details.reason);
  const current = await chrome.storage.local.get({
    hideShorts: true,
    darkTheme: true,
    hideDistractions: true,
    customShortcuts: true,
    secondsSpent: 0
  });
  await chrome.storage.local.set(current);
});

// Periodic heartbeat alarm
chrome.alarms.create('temptation_telemetry_heartbeat', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'temptation_telemetry_heartbeat') {
    const { secondsSpent = 0 } = await chrome.storage.local.get('secondsSpent');
    const minutes = Math.floor(secondsSpent / 60);
    if (minutes > 0) {
      await chrome.action.setBadgeText({ text: \`\${minutes}m\` });
      await chrome.action.setBadgeBackgroundColor({ color: '#A855F7' });
    }
  }
});
`
    });
  }

  // 6. Options Page & Script
  if (spec.components.includes('options')) {
    files.push({
      path: 'options.html',
      language: 'html',
      description: 'Options configuration page.',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${spec.name} - Preferences</title>
  <style>
    body {
      background-color: #08080D;
      color: #F5F5FA;
      font-family: sans-serif;
      padding: 40px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 { color: #A855F7; margin-bottom: 20px; font-size: 24px; }
    .card { background: #11111B; border: 1px solid rgba(168,85,247,0.2); padding: 20px; border-radius: 8px; }
    p { color: #9292A6; font-size: 14px; margin-bottom: 20px; }
    button { background: #A855F7; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    button:hover { background: #9333EA; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${spec.name}</h1>
    <p>Fine-tune extension behaviors and telemetry storage.</p>
    <button id="clearData">Clear Stored Extension Telemetry</button>
  </div>
  <script src="options.js"></script>
</body>
</html>`
    });

    files.push({
      path: 'options.js',
      language: 'javascript',
      description: 'Options page controller.',
      content: `document.getElementById('clearData').addEventListener('click', async () => {
  await chrome.storage.local.clear();
  alert('Telemetry data cleared successfully.');
});
`
    });
  }

  // 7. README.md & CHROMEWEBSTORE.md
  files.push({
    path: 'README.md',
    language: 'markdown',
    description: 'Extension documentation and developer installation instructions.',
    content: `# ${spec.name}

> Generated by **TEMPTATION AI** — Autonomous Chrome Extension Laboratory

## 📦 Extension Overview
- **Manifest Version**: 3
- **Version**: ${spec.version}
- **Target URL Pattern**: \`${spec.targetSites.join('`, `')}\`
- **Permissions**: \`${spec.permissions.join('`, `')}\`

## ✨ Features
${spec.features.map(f => `- ${f}`).join('\n')}

## 🚀 How to Install in Google Chrome
1. Extract this ZIP archive to a folder on your computer.
2. Open Google Chrome and navigate to \`chrome://extensions/\` in the address bar.
3. In the top-right corner, toggle **Developer mode** to ON.
4. Click **Load unpacked** in the top-left corner.
5. Select the unzipped folder containing \`manifest.json\`.
6. Open your target website (${spec.targetSites[0]}) and enjoy!

## 🛡️ Security & Privacy
- **Zero Remote Code**: Operates entirely offline with bundled code.
- **Local Storage Only**: Preferences are stored locally via \`chrome.storage.local\`.
- **Manifest V3 Compliant**: Ephemeral service worker, CSP compliant, zero eval.
`
  });

  return files;
}
