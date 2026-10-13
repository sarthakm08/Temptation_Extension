import { ExtensionArchitecture, ExtensionSpecification } from '@/types/extension';

export function planArchitecture(spec: ExtensionSpecification): ExtensionArchitecture {
  const fileStructure: string[] = ['manifest.json', 'README.md', 'icons/icon-16.png', 'icons/icon-48.png', 'icons/icon-128.png'];
  const componentsRationale: Record<string, string> = {};

  if (spec.components.includes('popup')) {
    fileStructure.push('popup.html', 'popup.css', 'popup.js');
    componentsRationale['popup'] = 'Provides instant cyber control panel for users to toggle features and view statistics.';
  }

  if (spec.components.includes('content_script')) {
    fileStructure.push('content.js', 'content.css');
    componentsRationale['content_script'] = 'Runs in the webpage context to adapt DOM elements, inject neon styles, and handle shortcuts.';
  }

  if (spec.components.includes('service_worker')) {
    fileStructure.push('background.js');
    componentsRationale['service_worker'] = 'Handles background alarms, cross-tab session tracking, and badge updates in an ephemeral lifecycle.';
  }

  if (spec.components.includes('options')) {
    fileStructure.push('options.html', 'options.js');
    componentsRationale['options'] = 'Dedicated options page for granular feature tuning and persistent preferences.';
  }

  return {
    manifestVersion: 3,
    fileStructure,
    messagingModel: 'Bidirectional message passing via chrome.runtime.sendMessage with async response listeners.',
    storageStrategy: 'Asynchronous persistence using chrome.storage.local with defaults and live change listeners (chrome.storage.onChanged).',
    securityPractices: [
      'Strict Manifest V3 Content Security Policy (no eval, no inline scripts)',
      'Narrow host permissions matching only targeted URLs',
      'XSS prevention by avoiding unescaped innerHTML assignments',
      'Zero remote code downloads; 100% self-contained extension bundle'
    ],
    componentsRationale
  };
}
