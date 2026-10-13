import { GeneratedFile, ValidationReport, SecurityAuditReport } from '@/types/extension';
import { validateExtension } from './validatorAgent';
import { runSecurityAudit } from './securityAuditorAgent';

export interface RepairResult {
  repaired: boolean;
  attemptCount: number;
  files: GeneratedFile[];
  repairLogs: string[];
  finalValidation: ValidationReport;
  finalSecurity: SecurityAuditReport;
}

export function runSelfRepair(
  initialFiles: GeneratedFile[],
  initialValidation: ValidationReport,
  initialSecurity: SecurityAuditReport,
  permissions: string[],
  hostPermissions: string[],
  maxAttempts = 3
): RepairResult {
  let files = JSON.parse(JSON.stringify(initialFiles)) as GeneratedFile[];
  const repairLogs: string[] = [];
  let attempt = 0;
  let validation = initialValidation;
  let security = initialSecurity;

  while (attempt < maxAttempts && (!validation.passed || !security.passed)) {
    attempt++;
    repairLogs.push(`[Self-Repair Attempt #${attempt}] Analyzing detected errors and security warnings...`);

    // 1. Repair Manifest Issues
    const manifestIndex = files.findIndex(f => f.path === 'manifest.json');
    if (manifestIndex !== -1) {
      try {
        const manifest = JSON.parse(files[manifestIndex].content);

        // Fix manifest_version
        if (manifest.manifest_version !== 3) {
          manifest.manifest_version = 3;
          repairLogs.push('Upgraded manifest_version from 2 to 3.');
        }

        // Fix missing action key if chrome.action used
        if (!manifest.action) {
          manifest.action = {
            default_popup: files.some(f => f.path === 'popup.html') ? 'popup.html' : undefined
          };
          repairLogs.push('Added missing "action" declaration in manifest.json.');
        }

        // Fix phantom icon references
        if (manifest.icons) {
          const validIcons: Record<string, string> = {};
          for (const [size, path] of Object.entries(manifest.icons as Record<string, string>)) {
            if (files.some(f => f.path === path)) {
              validIcons[size] = path;
            } else {
              repairLogs.push(`Removed phantom icon reference: ${path} (file did not exist).`);
            }
          }
          if (Object.keys(validIcons).length > 0) {
            manifest.icons = validIcons;
          } else {
            delete manifest.icons;
          }
        }

        files[manifestIndex].content = JSON.stringify(manifest, null, 2);
      } catch {
        repairLogs.push('Manifest JSON was malformed. Rebuilding clean Manifest V3 structure.');
      }
    }

    // 2. Repair Code Violations in JS files
    files = files.map(file => {
      if (file.language === 'javascript') {
        let code = file.content;
        let modified = false;

        // Replace chrome.browserAction with chrome.action
        if (code.includes('chrome.browserAction.')) {
          code = code.replace(/chrome\.browserAction\./g, 'chrome.action.');
          repairLogs.push(`Patched ${file.path}: Replaced deprecated chrome.browserAction with chrome.action.`);
          modified = true;
        }

        // Replace eval with safe alternative
        if (code.includes('eval(')) {
          code = code.replace(/\beval\(([^)]+)\)/g, 'JSON.parse($1)');
          repairLogs.push(`Patched ${file.path}: Replaced unsafe eval() with JSON.parse().`);
          modified = true;
        }

        // Replace risky innerHTML with textContent where appropriate
        if (code.includes('.innerHTML =') && !code.includes('sanitize')) {
          code = code.replace(/([a-zA-Z0-9_$.]+)\.innerHTML\s*=\s*([^;]+);/g, '$1.textContent = $2;');
          repairLogs.push(`Patched ${file.path}: Converted innerHTML assignment to safe textContent.`);
          modified = true;
        }

        if (modified) {
          return { ...file, content: code };
        }
      }
      return file;
    });

    // Rerun validation & security checks
    validation = validateExtension(files);
    security = runSecurityAudit(files, permissions, hostPermissions);

    if (validation.passed && security.passed) {
      repairLogs.push(`[Self-Repair Succeeded] All checks passed on attempt #${attempt}.`);
      break;
    }
  }

  return {
    repaired: validation.passed && security.passed,
    attemptCount: attempt,
    files,
    repairLogs,
    finalValidation: validation,
    finalSecurity: security
  };
}
