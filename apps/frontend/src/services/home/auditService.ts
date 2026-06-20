import type { AuditViolation, AuditSummary, AuditReport, AuditIssue } from './types';

/**
 * Runs an accessibility audit via the Mastra API.
 * Supports 'fast' (deterministic) and 'recursive' (agent-based) crawls.
 */
export async function runAccessibilityAudit(scanUrl: string, useAgent: 'fast' | 'recursive'): Promise<AuditReport> {
  if (useAgent === 'fast') {
    const response = await fetch('/api/tools/deterministicAudit/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          url: scanUrl,
          maxPages: 3,
          maxDepth: 2
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Error de red llamando a la herramienta: ${response.statusText}`);
    }

    return await response.json();
  } else {
    const response = await fetch('/api/agents/accessibility-agent/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [`Please audit the following URL: ${scanUrl}`],
        maxSteps: 30
      })
    });

    if (!response.ok) {
      throw new Error(`Error de red: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.text) {
      throw new Error('No se recibió texto de respuesta del agente.');
    }

    const reportText = data.text;

    // Intentar extraer el bloque JSON en caso de que el modelo haya incluido marcas Markdown (```json ... ```)
    const jsonMatch = reportText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : reportText;
    return JSON.parse(cleanJson);
  }
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
      translatedName: violation.translatedName,
      translatedDescription: violation.translatedDescription,
      url: violation.url,
      selector: violation.selector
    };
  });
}
