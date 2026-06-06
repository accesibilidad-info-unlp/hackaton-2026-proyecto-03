export interface Finding {
  id: string; // Stable hash of ruleId + selector + url
  ruleId: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  selector: string;
  html: string;
  url: string;
  description: string;
  helpUrl: string;
}

export type StopReason = 'max_pages' | 'max_depth' | 'timeout' | 'browser_crash' | 'agent_decision';

export interface QueueItem {
  url: string;
  depth: number;
}

export interface AuditState {
  visited: string[];
  queue: QueueItem[];
  findings: Finding[];
  currentDepth: number;
  startTime: number;
  stopped: StopReason | null;
}

export interface StopConfig {
  maxPages: number;
  maxDepth: number;
  maxDurationMs: number;
}

export interface AuditReport {
  summary: {
    totalPagesVisited: number;
    totalViolations: number;
    severityBreakdown: {
      critical: number;
      serious: number;
      moderate: number;
      minor: number;
    };
  };
  violations: Finding[];
  byPage: Record<string, number>;
  byRule: Record<string, number>;
  stopReason: StopReason;
  durationMs: number;
}
