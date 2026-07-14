import { Activity, Globe, RefreshCw, Eye, Keyboard, Brain, Volume2, ExternalLink } from 'lucide-react';
import { Card } from "@/components/ui/card";
import type { AuditSummary, AuditIssue } from '@/services/home/types';

interface AuditSummaryCardProps {
  summaryData: AuditSummary | null;
  issues: AuditIssue[];
  scanUrl: string;
}

export function AuditSummaryCard({ summaryData, issues, scanUrl }: AuditSummaryCardProps) {
  const criticalCount = summaryData?.severityBreakdown?.critical ?? issues.filter(i => i.impact === 'critical').length;
  const seriousCount = summaryData?.severityBreakdown?.serious ?? issues.filter(i => i.impact === 'serious').length;
  const moderateCount = summaryData?.severityBreakdown?.moderate ?? issues.filter(i => i.impact === 'moderate').length;
  const minorCount = summaryData?.severityBreakdown?.minor ?? issues.filter(i => i.impact === 'minor').length;

  // Aggregate issues by disability category
  const disabilityCounts = {
    visual: 0,
    motriz: 0,
    cognitiva: 0,
    auditiva: 0
  };

  issues.forEach(issue => {
    if (!issue.disabilities) return;
    
    let hasVisual = false;
    let hasMotriz = false;
    let hasCognitiva = false;
    let hasAuditiva = false;

    issue.disabilities.forEach(d => {
      const normalized = d.toLowerCase();
      if (normalized.includes('lector') || normalized.includes('ceguera') || normalized.includes('visión') || normalized.includes('contraste') || normalized.includes('daltonismo')) {
        hasVisual = true;
      }
      if (normalized.includes('teclado') || normalized.includes('motriz')) {
        hasMotriz = true;
      }
      if (normalized.includes('cognitiva') || normalized.includes('estructura') || normalized.includes('comprensión')) {
        hasCognitiva = true;
      }
      if (normalized.includes('auditiva') || normalized.includes('subtítulo') || normalized.includes('audio')) {
        hasAuditiva = true;
      }
    });

    if (hasVisual) disabilityCounts.visual++;
    if (hasMotriz) disabilityCounts.motriz++;
    if (hasCognitiva) disabilityCounts.cognitiva++;
    if (hasAuditiva) disabilityCounts.auditiva++;
  });

  const maxIssuesCount = issues.length;
  const visualPct = maxIssuesCount > 0 ? (disabilityCounts.visual / maxIssuesCount) * 100 : 0;
  const motrizPct = maxIssuesCount > 0 ? (disabilityCounts.motriz / maxIssuesCount) * 100 : 0;
  const cognitivaPct = maxIssuesCount > 0 ? (disabilityCounts.cognitiva / maxIssuesCount) * 100 : 0;
  const auditivaPct = maxIssuesCount > 0 ? (disabilityCounts.auditiva / maxIssuesCount) * 100 : 0;

  return (
    <Card className="shadow-lg border-border p-6 flex flex-col justify-between md:col-span-2">
      <div>
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-primary" />
          Resumen de Auditoría
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 break-all">
          Analizado para:{' '}
          {scanUrl.startsWith('http://') || scanUrl.startsWith('https://') ? (
            <a
              href={scanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-primary hover:underline inline-flex items-center gap-1 font-semibold"
            >
              {scanUrl}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          ) : (
            <span className="font-mono text-foreground">{scanUrl}</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-center flex flex-col justify-center">
          <span className="text-xl font-extrabold text-destructive block leading-none">
            {criticalCount}
          </span>
          <span className="text-[9px] font-bold text-destructive/80 uppercase tracking-wider block mt-1.5">Críticos</span>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center flex flex-col justify-center">
          <span className="text-xl font-extrabold text-orange-500 block leading-none">
            {seriousCount}
          </span>
          <span className="text-[9px] font-bold text-orange-500/80 uppercase tracking-wider block mt-1.5">Serios</span>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center flex flex-col justify-center">
          <span className="text-xl font-extrabold text-yellow-500 block leading-none">
            {moderateCount}
          </span>
          <span className="text-[9px] font-bold text-yellow-500/80 uppercase tracking-wider block mt-1.5">Moderad.</span>
        </div>
        <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center flex flex-col justify-center">
          <span className="text-xl font-extrabold text-foreground block leading-none">
            {minorCount}
          </span>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mt-1.5">Menores</span>
        </div>
      </div>

      {/* Impacto por tipo de discapacidad */}
      <div className="mt-2 mb-6 border-t border-border/40 pt-4">
        <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Impacto por Tipo de Discapacidad
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Visual */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/40 border border-border/60 shadow-sm transition-all duration-300 hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">Visual</span>
              </div>
              <span className="text-xs font-extrabold text-foreground">
                {disabilityCounts.visual} {disabilityCounts.visual === 1 ? 'problema' : 'problemas'}
              </span>
            </div>
            <div 
              className="w-full h-1.5 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={disabilityCounts.visual}
              aria-valuemin={0}
              aria-valuemax={maxIssuesCount}
              aria-label={`Progreso de problemas visuales: ${disabilityCounts.visual} de ${maxIssuesCount}`}
            >
              <div 
                className="h-full bg-purple-500 dark:bg-purple-400 rounded-full transition-all duration-500" 
                style={{ width: `${visualPct}%` }}
              />
            </div>
          </div>

          {/* Motriz */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/40 border border-border/60 shadow-sm transition-all duration-300 hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Keyboard className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">Motriz</span>
              </div>
              <span className="text-xs font-extrabold text-foreground">
                {disabilityCounts.motriz} {disabilityCounts.motriz === 1 ? 'problema' : 'problemas'}
              </span>
            </div>
            <div 
              className="w-full h-1.5 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={disabilityCounts.motriz}
              aria-valuemin={0}
              aria-valuemax={maxIssuesCount}
              aria-label={`Progreso de problemas motrices: ${disabilityCounts.motriz} de ${maxIssuesCount}`}
            >
              <div 
                className="h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-500" 
                style={{ width: `${motrizPct}%` }}
              />
            </div>
          </div>

          {/* Cognitiva */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/40 border border-border/60 shadow-sm transition-all duration-300 hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">Cognitiva</span>
              </div>
              <span className="text-xs font-extrabold text-foreground">
                {disabilityCounts.cognitiva} {disabilityCounts.cognitiva === 1 ? 'problema' : 'problemas'}
              </span>
            </div>
            <div 
              className="w-full h-1.5 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={disabilityCounts.cognitiva}
              aria-valuemin={0}
              aria-valuemax={maxIssuesCount}
              aria-label={`Progreso de problemas cognitivos: ${disabilityCounts.cognitiva} de ${maxIssuesCount}`}
            >
              <div 
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500" 
                style={{ width: `${cognitivaPct}%` }}
              />
            </div>
          </div>

          {/* Auditiva */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/40 border border-border/60 shadow-sm transition-all duration-300 hover:border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-pink-500/10 text-pink-600 dark:text-pink-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">Auditiva</span>
              </div>
              <span className="text-xs font-extrabold text-foreground">
                {disabilityCounts.auditiva} {disabilityCounts.auditiva === 1 ? 'problema' : 'problemas'}
              </span>
            </div>
            <div 
              className="w-full h-1.5 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={disabilityCounts.auditiva}
              aria-valuemin={0}
              aria-valuemax={maxIssuesCount}
              aria-label={`Progreso de problemas auditivos: ${disabilityCounts.auditiva} de ${maxIssuesCount}`}
            >
              <div 
                className="h-full bg-pink-500 dark:bg-pink-400 rounded-full transition-all duration-500" 
                style={{ width: `${auditivaPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex flex-col gap-2 mt-auto">
        {summaryData && (
          <div className="flex items-center gap-4 mt-1 border-t border-border/50 pt-2.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary/70" /> {summaryData.totalPagesVisited} pág.
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primary/70" /> {summaryData.totalViolations} violaciones
            </span>
            {summaryData.durationMs !== undefined && (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-primary/70" /> {(summaryData.durationMs / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
