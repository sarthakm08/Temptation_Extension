import { GeneratedFile, SecurityAuditReport, SecurityIssue } from '@/types/extension';

export function runSecurityAudit(files: GeneratedFile[], permissions: string[], hostPermissions: string[]): SecurityAuditReport {
  const issues: SecurityIssue[] = [];
  let score = 100;

  // 1. Audit Permissions
  const permissionsAudit = permissions.map(perm => {
    let riskLevel: 'safe' | 'moderate' | 'elevated' | 'high' = 'safe';
    let justification = 'Standard extension operation.';

    if (perm === 'storage') {
      riskLevel = 'safe';
      justification = 'Stores user preferences locally without remote exfiltration.';
    } else if (perm === 'activeTab') {
      riskLevel = 'safe';
      justification = 'Temporary access to active tab only on direct user interaction.';
    } else if (perm === 'scripting') {
      riskLevel = 'moderate';
      justification = 'Allows injecting content scripts or styles into authorized targets.';
    } else if (perm === 'tabs') {
      riskLevel = 'elevated';
      justification = 'Grants full URL/title access across tabs. Evaluated against narrow usage.';
      score -= 5;
    } else if (perm === 'webRequest' || perm === 'webRequestBlocking') {
      riskLevel = 'high';
      justification = 'Network request interception. Manifest V3 prefers declarativeNetRequest.';
      score -= 20;
      issues.push({
        severity: 'high',
        category: 'permissions',
        message: 'Potentially risky network intercept permission requested.',
        recommendation: 'Migrate to declarativeNetRequest where possible in Manifest V3.'
      });
    } else if (perm === 'cookies') {
      riskLevel = 'high';
      score -= 15;
      issues.push({
        severity: 'medium',
        category: 'permissions',
        message: 'Cookie read/write permission requested.',
        recommendation: 'Ensure cookies are accessed strictly for user-consented session features.'
      });
    }

    return { permission: perm, riskLevel, justification };
  });

  // 2. Audit Host Permissions
  const hostPermissionsAudit = hostPermissions.map(pattern => {
    let riskLevel: 'scoped' | 'broad' | 'critical' = 'scoped';
    let notes = 'Scoped to specific domain.';

    if (pattern === '<all_urls>' || pattern === '*://*/*' || pattern === 'http://*/*' || pattern === 'https://*/*') {
      riskLevel = 'broad';
      notes = 'Broad host permissions request access to every website visited.';
      score -= 15;
      issues.push({
        severity: 'medium',
        category: 'permissions',
        message: `Broad host permission '${pattern}' requested.`,
        recommendation: 'Restrict host permissions to only the specific URLs the extension requires (e.g. *://*.youtube.com/*).'
      });
    }

    return { pattern, riskLevel, notes };
  });

  // 3. Scan File Contents for Risky Code Patterns
  for (const file of files) {
    if (file.language === 'javascript') {
      const code = file.content;

      // Check eval / Function constructor
      if (/\beval\s*\(/.test(code) || /new\s+Function\s*\(/.test(code)) {
        score -= 25;
        issues.push({
          severity: 'critical',
          category: 'csp',
          file: file.path,
          message: 'Dynamic code execution (eval or new Function) detected. Manifest V3 CSP strictly forbids this.',
          recommendation: 'Remove eval/new Function. Execute structured logic or use sandboxed iframe messaging if necessary.'
        });
      }

      // Check innerHTML injection without sanitization
      if (/\.innerHTML\s*=/.test(code)) {
        score -= 10;
        issues.push({
          severity: 'medium',
          category: 'dom_safety',
          file: file.path,
          message: 'Direct assignment to innerHTML detected, which poses an XSS vulnerability.',
          recommendation: 'Use textContent, document.createElement, or sanitize before DOM insertion.'
        });
      }

      // Check for hardcoded API keys or credentials
      if (/["'][A-Za-z0-9_-]{32,}["']/.test(code) && /(api_?key|secret|token|password|auth)/i.test(code)) {
        score -= 30;
        issues.push({
          severity: 'critical',
          category: 'secrets',
          file: file.path,
          message: 'Potential hardcoded API token or credential detected in source code.',
          recommendation: 'Remove hardcoded secrets from client extensions. Request user-entered keys in options or use backend proxy.'
        });
      }

      // Check deprecated MV2 APIs
      if (/chrome\.browserAction\b/.test(code)) {
        score -= 15;
        issues.push({
          severity: 'high',
          category: 'csp',
          file: file.path,
          message: 'Deprecated Manifest V2 API chrome.browserAction detected.',
          recommendation: 'Upgrade to chrome.action for Manifest V3.'
        });
      }

      if (/chrome\.tabs\.executeScript\b/.test(code)) {
        score -= 15;
        issues.push({
          severity: 'high',
          category: 'csp',
          file: file.path,
          message: 'Deprecated Manifest V2 API chrome.tabs.executeScript detected.',
          recommendation: 'Upgrade to chrome.scripting.executeScript for Manifest V3.'
        });
      }
    }
  }

  // Ensure score stays within 0..100
  score = Math.max(0, Math.min(100, score));
  const passed = score >= 70 && !issues.some(i => i.severity === 'critical');

  return {
    passed,
    score,
    issues,
    permissionsAudit,
    hostPermissionsAudit,
    timestamp: new Date().toISOString()
  };
}
