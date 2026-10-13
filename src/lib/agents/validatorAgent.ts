import { GeneratedFile, ValidationCheck, ValidationReport } from '@/types/extension';

interface ManifestV3 {
  manifest_version?: number;
  name?: string;
  version?: string;
  description?: string;
  action?: {
    default_popup?: string;
    default_icon?: string | Record<string, string>;
  };
  icons?: Record<string, string>;
  background?: {
    service_worker?: string;
    type?: string;
  };
  content_scripts?: Array<{
    matches?: string[];
    js?: string[];
    css?: string[];
  }>;
  options_page?: string;
  options_ui?: {
    page?: string;
  };
  side_panel?: {
    default_path?: string;
  };
  permissions?: string[];
  host_permissions?: string[];
}

export function validateExtension(files: GeneratedFile[]): ValidationReport {
  const checks: ValidationCheck[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  const fileMap = new Map<string, GeneratedFile>();
  for (const f of files) {
    fileMap.set(f.path, f);
  }

  // 1. Manifest Presence & JSON Syntax Check
  const manifestFile = fileMap.get('manifest.json');
  if (!manifestFile) {
    checks.push({
      id: 'manifest_present',
      name: 'Manifest File Existence',
      status: 'failed',
      details: 'Critical: manifest.json is missing from extension package.'
    });
    errors.push('manifest.json does not exist in the generated files.');
    return {
      passed: false,
      checks,
      errors,
      warnings,
      timestamp: new Date().toISOString()
    };
  }

  let manifest: ManifestV3 | null = null;
  try {
    manifest = JSON.parse(manifestFile.content) as ManifestV3;
    checks.push({
      id: 'manifest_json',
      name: 'Manifest JSON Syntax',
      status: 'passed',
      details: 'manifest.json is valid, well-formed JSON.'
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    checks.push({
      id: 'manifest_json',
      name: 'Manifest JSON Syntax',
      status: 'failed',
      details: `JSON syntax error: ${errorMsg}`
    });
    errors.push(`manifest.json JSON parsing error: ${errorMsg}`);
    return {
      passed: false,
      checks,
      errors,
      warnings,
      timestamp: new Date().toISOString()
    };
  }

  // 2. Manifest V3 Requirements
  if (manifest.manifest_version !== 3) {
    checks.push({
      id: 'manifest_version',
      name: 'Manifest V3 Specification',
      status: 'failed',
      details: `manifest_version must be integer 3, found ${manifest.manifest_version}.`
    });
    errors.push('Extension must use Manifest V3.');
  } else {
    checks.push({
      id: 'manifest_version',
      name: 'Manifest V3 Specification',
      status: 'passed',
      details: 'manifest_version is correctly set to 3.'
    });
  }

  if (!manifest.name || !manifest.version) {
    checks.push({
      id: 'manifest_metadata',
      name: 'Required Metadata (Name & Version)',
      status: 'failed',
      details: 'Extension must specify both "name" and "version" in manifest.json.'
    });
    errors.push('Missing "name" or "version" in manifest.json.');
  } else {
    checks.push({
      id: 'manifest_metadata',
      name: 'Required Metadata (Name & Version)',
      status: 'passed',
      details: `Identified extension: "${manifest.name}" v${manifest.version}.`
    });
  }

  // 3. File Reference Integrity Check
  const referencedFiles: { path: string; source: string }[] = [];

  // Popup
  if (manifest.action?.default_popup) {
    referencedFiles.push({ path: manifest.action.default_popup, source: 'action.default_popup' });
  }

  // Background service worker
  if (manifest.background?.service_worker) {
    referencedFiles.push({ path: manifest.background.service_worker, source: 'background.service_worker' });
  }

  // Options page
  if (manifest.options_page) {
    referencedFiles.push({ path: manifest.options_page, source: 'options_page' });
  }
  if (manifest.options_ui?.page) {
    referencedFiles.push({ path: manifest.options_ui.page, source: 'options_ui.page' });
  }

  // Side panel
  if (manifest.side_panel?.default_path) {
    referencedFiles.push({ path: manifest.side_panel.default_path, source: 'side_panel.default_path' });
  }

  // Content scripts
  if (Array.isArray(manifest.content_scripts)) {
    manifest.content_scripts.forEach((cs, idx) => {
      if (Array.isArray(cs.js)) {
        cs.js.forEach(jsPath => referencedFiles.push({ path: jsPath, source: `content_scripts[${idx}].js` }));
      }
      if (Array.isArray(cs.css)) {
        cs.css.forEach(cssPath => referencedFiles.push({ path: cssPath, source: `content_scripts[${idx}].css` }));
      }
    });
  }

  // Icons
  if (manifest.icons) {
    Object.entries(manifest.icons).forEach(([size, iconPath]) => {
      referencedFiles.push({ path: iconPath, source: `icons.${size}` });
    });
  }

  const missingFiles: string[] = [];
  for (const ref of referencedFiles) {
    // Normalise leading slash or ./
    const cleanPath = ref.path.replace(/^\.\//, '').replace(/^\//, '');
    if (!fileMap.has(cleanPath)) {
      missingFiles.push(`${cleanPath} (referenced by ${ref.source})`);
    }
  }

  if (missingFiles.length > 0) {
    checks.push({
      id: 'file_references',
      name: 'Referenced File Integrity',
      status: 'failed',
      details: `Manifest references non-existent files: ${missingFiles.join(', ')}`
    });
    errors.push(`Manifest references non-existent files: ${missingFiles.join(', ')}`);
  } else {
    checks.push({
      id: 'file_references',
      name: 'Referenced File Integrity',
      status: 'passed',
      details: `All ${referencedFiles.length} referenced files exist in the extension package.`
    });
  }

  // 4. Source Files Syntax & Sanity Check
  for (const file of files) {
    if (file.language === 'javascript') {
      // Basic brace balance check
      let braceCount = 0;
      let bracketCount = 0;
      let parenCount = 0;

      for (let i = 0; i < file.content.length; i++) {
        const char = file.content[i];
        if (char === '{') braceCount++;
        else if (char === '}') braceCount--;
        else if (char === '[') bracketCount++;
        else if (char === ']') bracketCount--;
        else if (char === '(') parenCount++;
        else if (char === ')') parenCount--;
      }

      if (braceCount !== 0 || bracketCount !== 0 || parenCount !== 0) {
        warnings.push(`Potential syntax imbalance in ${file.path}: unbalanced brackets or braces.`);
      }

      // Check chrome.action requirement (skill rule 11)
      if (file.content.includes('chrome.action.') && !manifest.action) {
        errors.push(`${file.path} calls chrome.action APIs but manifest.json is missing the "action" key.`);
        checks.push({
          id: 'action_key',
          name: 'Action API Declaration',
          status: 'failed',
          details: `${file.path} uses chrome.action without "action" defined in manifest.json.`
        });
      }
    }
  }

  const passed = errors.length === 0;

  return {
    passed,
    checks,
    errors,
    warnings,
    timestamp: new Date().toISOString()
  };
}
