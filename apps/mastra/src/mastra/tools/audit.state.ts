import { AuditState, StopConfig, StopReason } from '../../types/audit.types';
import { mastraEnv } from '../../shared/config/env';

let currentAuditState: AuditState | null = null;

function getDefaultStopConfig(): StopConfig {
  return {
    maxPages: mastraEnv.MAX_PAGES,
    maxDepth: mastraEnv.MAX_DEPTH,
    maxDurationMs: mastraEnv.MAX_DURATION_MS,
  };
}

let currentStopConfig: StopConfig = getDefaultStopConfig();

export function initAuditState(initialUrl: string, config?: Partial<StopConfig>): AuditState {
  const defaults = getDefaultStopConfig();
  currentStopConfig = {
    maxPages: config?.maxPages ?? defaults.maxPages,
    maxDepth: config?.maxDepth ?? defaults.maxDepth,
    maxDurationMs: config?.maxDurationMs ?? defaults.maxDurationMs,
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
  if (state.currentDepth > config.maxDepth) return 'max_depth';
  if (Date.now() - state.startTime >= config.maxDurationMs) return 'timeout';
  return null;
}
