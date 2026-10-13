export type ExtensionComponent = 
  | 'popup' 
  | 'options' 
  | 'content_script' 
  | 'service_worker' 
  | 'side_panel';

export interface GeneratedFile {
  path: string;
  content: string;
  language: 'json' | 'javascript' | 'html' | 'css' | 'markdown' | 'image';
  description: string;
  modifiedByUser?: boolean;
}

export interface ExtensionSpecification {
  name: string;
  version: string;
  description: string;
  targetSites: string[];
  permissions: string[];
  hostPermissions: string[];
  components: ExtensionComponent[];
  features: string[];
  limitations: string[];
}

export interface ExtensionArchitecture {
  manifestVersion: 3;
  fileStructure: string[];
  messagingModel: string;
  storageStrategy: string;
  securityPractices: string[];
  componentsRationale: Record<string, string>;
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'permissions' | 'csp' | 'dom_safety' | 'data_privacy' | 'network' | 'secrets';
  message: string;
  file?: string;
  recommendation: string;
}

export interface SecurityAuditReport {
  passed: boolean;
  score: number; // 0 to 100
  issues: SecurityIssue[];
  permissionsAudit: {
    permission: string;
    riskLevel: 'safe' | 'moderate' | 'elevated' | 'high';
    justification: string;
  }[];
  hostPermissionsAudit: {
    pattern: string;
    riskLevel: 'scoped' | 'broad' | 'critical';
    notes: string;
  }[];
  timestamp: string;
}

export interface ValidationCheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
}

export interface ValidationReport {
  passed: boolean;
  checks: ValidationCheck[];
  errors: string[];
  warnings: string[];
  timestamp: string;
}

export interface BuildLog {
  id: string;
  stage: string;
  severity: 'info' | 'warn' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export type BuildStage = 
  | 'requirements'
  | 'architecture'
  | 'code_generation'
  | 'security_audit'
  | 'validation'
  | 'self_repair'
  | 'packaging';

export interface BuildStep {
  id: BuildStage;
  number: string;
  title: string;
  agent: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'repaired';
  durationMs?: number;
  summary?: string;
}

export interface ExtensionProject {
  id: string;
  name: string;
  description: string;
  prompt: string;
  status: 'draft' | 'building' | 'validated' | 'repaired' | 'failed';
  createdAt: string;
  updatedAt: string;
  specification?: ExtensionSpecification;
  architecture?: ExtensionArchitecture;
  files: GeneratedFile[];
  securityReport?: SecurityAuditReport;
  validationReport?: ValidationReport;
  repairLogs?: string[];
  logs: BuildLog[];
  steps: BuildStep[];
}

export interface AgentGenerateRequest {
  prompt: string;
  templateId?: string;
  projectId?: string;
  apiKey?: string;
  model?: string;
}
