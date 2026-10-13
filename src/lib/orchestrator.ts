import {
  ExtensionProject,
  BuildStep,
  BuildLog,
  GeneratedFile
} from '@/types/extension';
import { analyzeRequirements } from './agents/requirementsAgent';
import { planArchitecture } from './agents/architectAgent';
import { generateExtensionFiles } from './agents/codeGeneratorAgent';
import { runSecurityAudit } from './agents/securityAuditorAgent';
import { validateExtension } from './agents/validatorAgent';
import { runSelfRepair } from './agents/repairAgent';
import { callGeminiForExtension } from './gemini';

export async function runAgentOrchestration(
  prompt: string,
  apiKey?: string,
  model = 'gemini-2.5-flash'
): Promise<ExtensionProject> {
  const projectId = 'proj_' + Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();
  const logs: BuildLog[] = [];

  function addLog(stage: string, severity: 'info' | 'warn' | 'error' | 'success', message: string) {
    logs.push({
      id: 'log_' + Math.random().toString(36).substring(2, 7),
      stage,
      severity,
      message,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  const steps: BuildStep[] = [
    {
      id: 'requirements',
      number: '01',
      title: 'Requirements Analysis',
      agent: 'Requirements Analyst Agent',
      description: 'Parsing natural language, identifying host scopes, capabilities, and Manifest V3 constraints.',
      status: 'pending'
    },
    {
      id: 'architecture',
      number: '02',
      title: 'Architecture Blueprint',
      agent: 'Extension Architect Agent',
      description: 'Designing MV3 structure, component selection (popup, content, worker), and storage models.',
      status: 'pending'
    },
    {
      id: 'code_generation',
      number: '03',
      title: 'Source Code Generation',
      agent: 'Code Generator Agent',
      description: 'Generating Manifest V3 compliant source files, HTML, CSS, JavaScript, and binary icons.',
      status: 'pending'
    },
    {
      id: 'security_audit',
      number: '04',
      title: 'Security & Privacy Audit',
      agent: 'Security Auditor Agent',
      description: 'Auditing permissions, detecting unsafe eval/DOM manipulation, secrets, and CSP compliance.',
      status: 'pending'
    },
    {
      id: 'validation',
      number: '05',
      title: 'Automated Build Validation',
      agent: 'Build & Test Agent',
      description: 'Static validation of manifest structure, file existence, and syntax integrity.',
      status: 'pending'
    },
    {
      id: 'self_repair',
      number: '06',
      title: 'Self-Repair Loop',
      agent: 'Self-Repair Agent',
      description: 'Automated patch application and regression validation if diagnostics identify defects.',
      status: 'pending'
    },
    {
      id: 'packaging',
      number: '07',
      title: 'Extension Packaging',
      agent: 'Packaging Agent',
      description: 'ZIP archive compilation, manifest bundle preparation, and developer guide.',
      status: 'pending'
    }
  ];

  // Stage 1: Requirements Analysis
  steps[0].status = 'running';
  const t0 = Date.now();
  addLog('Requirements Analysis', 'info', `Ingesting prompt: "${prompt.slice(0, 80)}..."`);
  const specification = analyzeRequirements(prompt);
  steps[0].status = 'completed';
  steps[0].durationMs = Date.now() - t0;
  steps[0].summary = `Identified: ${specification.name} | Target: ${specification.targetSites.join(', ')}`;
  addLog('Requirements Analysis', 'success', `Extracted specification for "${specification.name}".`);

  // Stage 2: Architecture Planning
  steps[1].status = 'running';
  const t1 = Date.now();
  addLog('Architecture Planning', 'info', 'Formulating Manifest V3 architectural blueprint...');
  const architecture = planArchitecture(specification);
  steps[1].status = 'completed';
  steps[1].durationMs = Date.now() - t1;
  steps[1].summary = `Blueprint formulated for ${architecture.fileStructure.length} components.`;
  addLog('Architecture Planning', 'success', `Mapped architecture with ${architecture.fileStructure.length} files.`);

  // Stage 3: Code Generation
  steps[2].status = 'running';
  const t2 = Date.now();
  addLog('Code Generation', 'info', 'Generating extension source files...');
  
  let files: GeneratedFile[] = [];
  let aiUsed = false;

  if (apiKey && apiKey.trim().length > 0) {
    addLog('Code Generation', 'info', `Querying Gemini AI (${model}) for customized extension synthesis...`);
    const aiResult = await callGeminiForExtension(prompt, apiKey, model);
    if (aiResult.success && aiResult.data) {
      const data = aiResult.data as { name?: string; files?: GeneratedFile[] };
      if (Array.isArray(data.files) && data.files.length > 0) {
        files = data.files;
        aiUsed = true;
        addLog('Code Generation', 'success', `Gemini AI generated ${files.length} custom files.`);
      }
    } else {
      addLog('Code Generation', 'warn', `AI call failed (${aiResult.error}). Utilizing high-fidelity agent generator engine.`);
    }
  }

  if (!aiUsed || files.length === 0) {
    files = generateExtensionFiles(specification, architecture);
    addLog('Code Generation', 'success', `Generated ${files.length} production files via agent generator.`);
  }

  steps[2].status = 'completed';
  steps[2].durationMs = Date.now() - t2;
  steps[2].summary = `Synthesized ${files.length} files (HTML, CSS, JS, Manifest, Icons).`;

  // Stage 4: Security Audit
  steps[3].status = 'running';
  const t3 = Date.now();
  addLog('Security Audit', 'info', 'Scanning permissions, CSP, network boundaries, and DOM operations...');
  let securityReport = runSecurityAudit(files, specification.permissions, specification.hostPermissions);
  steps[3].status = 'completed';
  steps[3].durationMs = Date.now() - t3;
  steps[3].summary = `Security Score: ${securityReport.score}/100. Issues flagged: ${securityReport.issues.length}.`;
  addLog('Security Audit', securityReport.passed ? 'success' : 'warn', `Audit completed with score ${securityReport.score}/100.`);

  // Stage 5: Validation
  steps[4].status = 'running';
  const t4 = Date.now();
  addLog('Validation', 'info', 'Testing Manifest V3 integrity and file references...');
  let validationReport = validateExtension(files);
  steps[4].status = validationReport.passed ? 'completed' : 'failed';
  steps[4].durationMs = Date.now() - t4;
  steps[4].summary = validationReport.passed ? 'All Manifest V3 static tests passed.' : `Found ${validationReport.errors.length} build errors.`;
  addLog('Validation', validationReport.passed ? 'success' : 'error', steps[4].summary);

  // Stage 6: Self-Repair Loop
  steps[5].status = 'running';
  const t5 = Date.now();
  let repairLogs: string[] = [];

  if (!validationReport.passed || !securityReport.passed) {
    addLog('Self-Repair', 'warn', 'Initiating self-repair agent to resolve validation and security findings...');
    const repairResult = runSelfRepair(files, validationReport, securityReport, specification.permissions, specification.hostPermissions);
    files = repairResult.files;
    validationReport = repairResult.finalValidation;
    securityReport = repairResult.finalSecurity;
    repairLogs = repairResult.repairLogs;

    repairLogs.forEach(rl => addLog('Self-Repair', 'info', rl));

    if (repairResult.repaired) {
      steps[5].status = 'repaired';
      steps[5].summary = `Successfully patched ${repairResult.attemptCount} issues in code.`;
      addLog('Self-Repair', 'success', 'All issues rectified by self-repair agent.');
    } else {
      steps[5].status = 'failed';
      steps[5].summary = 'Repair attempts exceeded bound limit without full clearance.';
      addLog('Self-Repair', 'error', 'Self-repair completed with unresolved warnings.');
    }
  } else {
    steps[5].status = 'completed';
    steps[5].summary = 'Zero repairs needed. Clean pass on first evaluation.';
    addLog('Self-Repair', 'info', 'No repairs required.');
  }
  steps[5].durationMs = Date.now() - t5;

  // Stage 7: Packaging Preparation
  steps[6].status = 'running';
  const t6 = Date.now();
  addLog('Packaging', 'info', 'Assembling extension bundle and developer installation documentation...');
  steps[6].status = 'completed';
  steps[6].durationMs = Date.now() - t6;
  steps[6].summary = `Ready for instant ZIP packaging (${files.length} files bundled).`;
  addLog('Packaging', 'success', 'Extension project ready for deployment.');

  return {
    id: projectId,
    name: specification.name,
    description: specification.description,
    prompt,
    status: validationReport.passed ? (steps[5].status === 'repaired' ? 'repaired' : 'validated') : 'failed',
    createdAt: now,
    updatedAt: now,
    specification,
    architecture,
    files,
    securityReport,
    validationReport,
    repairLogs,
    logs,
    steps
  };
}
