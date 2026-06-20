import { Activity, FileText, Globe, RefreshCw } from 'lucide-react';
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

  return (
    <Card className="shadow-lg border-border p-6 flex flex-col justify-between md:col-span-2">
      <div>
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-primary" />
          Resumen de Auditoría
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 break-all">
          Analizado para: <span className="font-mono text-foreground">{scanUrl}</span>
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

      <div className="text-xs text-muted-foreground flex flex-col gap-2 mt-auto">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-primary shrink-0" />
          <span>Normas aplicadas: <strong>WCAG 2.2</strong></span>
        </div>
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
