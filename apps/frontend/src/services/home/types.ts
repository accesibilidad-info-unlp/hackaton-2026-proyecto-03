export interface AuditViolation {
  id: string
  impact?: 'critical' | 'serious' | 'moderate' | 'minor'
  ruleId: string
  description: string
  helpUrl?: string
  html?: string
  disabilities?: string[]
  tags?: string[]
  translatedName?: string
  translatedDescription?: string
  url?: string
  selector?: string
}

export interface AuditSummary {
  totalPagesVisited: number
  totalViolations: number
  durationMs?: number
  severityBreakdown: {
    critical: number
    serious: number
    moderate: number
    minor: number
  }
}

export interface AuditReport {
  summary: AuditSummary;
  violations: AuditViolation[];
  durationMs?: number;
}

export interface AuditIssue {
  id: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  category: 'contraste' | 'images' | 'structure' | 'keyboard' | 'other'
  title: string
  description: string
  recommendation: string
  codeSnippet?: string
  disabilities?: string[]
  tags?: string[]
  translatedName?: string
  translatedDescription?: string
  url?: string
  selector?: string
}

export interface GroupedIssue {
  ruleId: string;
  translatedName: string;
  translatedDescription: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  category: 'contraste' | 'images' | 'structure' | 'keyboard' | 'other';
  disabilities: string[];
  recommendation: string;
  instances: AuditIssue[];
}

export interface AuditOptions {
  url?: string;
  urls?: string[];
  maxPages?: number;
  maxDepth?: number;
  maxDurationMs?: number;
}
