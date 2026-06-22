import type { AuditViolation, AuditSummary, AuditReport, AuditIssue, AuditOptions } from './types';

/**
 * Runs an accessibility audit via the Mastra API.
 * Supports 'fast' (deterministic) and 'recursive' (agent-based) crawls.
 */
export async function runAccessibilityAudit(options: AuditOptions): Promise<AuditReport> {
  const response = await fetch('/api/tools/deterministicAudit/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: options
    })
  });

  if (!response.ok) {
    throw new Error(`Error de red llamando a la herramienta: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Calculates accessibility score based on violations severity breakdown.
 */
export function calculateAccessibilityScore(summary: AuditSummary): number {
  const criticalCount = summary.severityBreakdown.critical || 0;
  const seriousCount = summary.severityBreakdown.serious || 0;
  const moderateCount = summary.severityBreakdown.moderate || 0;
  const minorCount = summary.severityBreakdown.minor || 0;
  return Math.max(0, 100 - (criticalCount * 8 + seriousCount * 5 + moderateCount * 2 + minorCount));
}

/**
 * Maps raw violations from the Mastra report to the processed AuditIssue interface.
 */
export function mapViolationsToIssues(violations: AuditViolation[]): AuditIssue[] {
  return violations.map((violation) => {
    let category: 'contraste' | 'images' | 'structure' | 'keyboard' | 'other' = 'other';
    const ruleId = violation.ruleId.toLowerCase();

    if (ruleId.includes('color') || ruleId.includes('contrast')) {
      category = 'contraste';
    } else if (ruleId.includes('image') || ruleId.includes('alt') || ruleId.includes('aria-img') || ruleId.includes('button-name') || ruleId.includes('link-name')) {
      category = 'images';
    } else if (ruleId.includes('keyboard') || ruleId.includes('focus') || ruleId.includes('tabindex') || ruleId.includes('bypass')) {
      category = 'keyboard';
    } else if (ruleId.includes('heading') || ruleId.includes('region') || ruleId.includes('landmark')) {
      category = 'structure';
    }

    return {
      id: violation.id,
      impact: violation.impact || 'moderate',
      category,
      title: violation.ruleId,
      description: violation.description,
      recommendation: `Consulte más detalles en: ${violation.helpUrl}`,
      codeSnippet: violation.html,
      disabilities: violation.disabilities || [],
      tags: violation.tags || [],
      translatedName: violation.translatedName,
      translatedDescription: violation.translatedDescription,
      url: violation.url,
      selector: violation.selector
    };
  });
}
