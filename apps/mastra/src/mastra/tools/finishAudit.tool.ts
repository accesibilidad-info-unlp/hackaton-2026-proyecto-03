import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { closeBrowserInstance } from './browser.manager';
import { getAuditState } from './audit.state';
import { StopReason } from '../../types/audit.types';

export const finishAuditTool = createTool({
  id: 'finishAudit',
  description: 'Finalize the audit, close the browser, and compile the final JSON report.',
  inputSchema: z.object({
    stopReason: z.string().describe('The final stop reason for this audit (e.g. max_pages, max_depth, timeout, browser_crash, agent_decision).'),
  }),
  outputSchema: z.object({
    summary: z.object({
      totalPagesVisited: z.number(),
      totalViolations: z.number(),
      severityBreakdown: z.object({
        critical: z.number(),
        serious: z.number(),
        moderate: z.number(),
        minor: z.number(),
      }),
    }),
    violations: z.array(z.object({
      id: z.string(),
      ruleId: z.string(),
      impact: z.string().nullable(),
      selector: z.string(),
      html: z.string(),
      url: z.string(),
      description: z.string(),
      helpUrl: z.string(),
      tags: z.array(z.string()).optional(),
      disabilities: z.array(z.string()).optional(),
    })),
    byPage: z.record(z.string(), z.number()),
    byRule: z.record(z.string(), z.number()),
    stopReason: z.string(),
    durationMs: z.number(),
  }),
  execute: async ({ stopReason }) => {
    const state = getAuditState();
    
    // Close browser to free resources
    await closeBrowserInstance();

    // Compile metrics
    const totalPagesVisited = state.visited.length;
    const totalViolations = state.findings.length;

    const severityBreakdown = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    };

    const byPage: Record<string, number> = {};
    const byRule: Record<string, number> = {};

    for (const finding of state.findings) {
      // Impact count
      const impact = finding.impact;
      if (impact === 'critical' || impact === 'serious' || impact === 'moderate' || impact === 'minor') {
        severityBreakdown[impact]++;
      }

      // Group by page
      byPage[finding.url] = (byPage[finding.url] || 0) + 1;

      // Group by rule
      byRule[finding.ruleId] = (byRule[finding.ruleId] || 0) + 1;
    }

    const durationMs = Date.now() - state.startTime;
    const finalStopReason = (stopReason || state.stopped || 'agent_decision') as StopReason;

    // Set stop reason in state
    state.stopped = finalStopReason;

    return {
      summary: {
        totalPagesVisited,
        totalViolations,
        severityBreakdown,
      },
      violations: state.findings,
      byPage,
      byRule,
      stopReason: finalStopReason,
      durationMs,
    };
  },
});
