import { AuditState, StopConfig, StopReason } from '../../types/audit.types';

let currentAuditState: AuditState | null = null;
let currentStopConfig: StopConfig = {
  maxPages: 1,
  maxDepth: 3,
  maxDurationMs: 5 * 60 * 1000, // 5 min
};

export function initAuditState(initialUrl: string, config?: Partial<StopConfig>): AuditState {
  currentStopConfig = {
    maxPages: config?.maxPages ?? 1,
    maxDepth: config?.maxDepth ?? 3,
    maxDurationMs: config?.maxDurationMs ?? 5 * 60 * 1000,
  };

  currentAuditState = {
    visited: [],
    queue: [{ url: initialUrl, depth: 0 }],
    findings: [],
    currentDepth: 0,
    startTime: Date.now(),
    stopped: null,
  };

  return currentAuditState;
}

export function getAuditState(): AuditState {
  if (!currentAuditState) {
    throw new Error('Audit state has not been initialized');
  }
  return currentAuditState;
}

export function getStopConfig(): StopConfig {
  return currentStopConfig;
}

export function checkStopSignals(state: AuditState, config: StopConfig): StopReason | null {
  if (state.stopped) return state.stopped;
  if (state.visited.length >= config.maxPages) return 'max_pages';
  if (state.currentDepth >= config.maxDepth) return 'max_depth';
  if (Date.now() - state.startTime >= config.maxDurationMs) return 'timeout';
  return null;
}
