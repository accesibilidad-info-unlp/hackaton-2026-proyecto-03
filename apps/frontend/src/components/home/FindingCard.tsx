import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert, AlertTriangle, Info, ChevronRight, Copy } from 'lucide-react';
import type { GroupedIssue } from '@/services/home/types';
import { DisabilityBadge } from '@/components/home/DisabilityBadge';

interface FindingCardProps {
  group: GroupedIssue;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function FindingCard({ group, isExpanded, onToggleExpand }: FindingCardProps) {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Código copiado al portapapeles');
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 border-border bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            {group.impact === 'critical' && (
              <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-md border border-destructive/20 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Crítico
              </span>
            )}
            {group.impact === 'serious' && (
              <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-md border border-orange-500/20 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Serio
              </span>
            )}
            {group.impact === 'moderate' && (
              <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-md border border-yellow-500/20 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Moderado
              </span>
            )}
            {group.impact === 'minor' && (
              <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md border border-border flex items-center gap-1">
                <Info className="w-3 h-3" /> Menor
              </span>
            )}
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mr-1">
              Categoría: {group.category}
            </span>
            {group.disabilities && group.disabilities.map((disability, idx) => (
              <DisabilityBadge key={idx} disability={disability} />
            ))}
          </div>
          {/* Title in Spanish with ruleId in badge */}
          <div className="flex items-baseline justify-between flex-wrap gap-2 mt-1">
            <CardTitle className="text-base font-bold text-foreground leading-tight">
              {group.translatedName}
            </CardTitle>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border font-bold">
              {group.ruleId}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Description in Spanish */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {group.translatedDescription}
        </p>

        {/* Recommendation block for the type of problem */}
        <div className="mt-3 bg-secondary/30 rounded-lg p-3 border border-border">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-primary" />
            Recomendación de corrección general:
          </h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {group.recommendation}
          </p>
        </div>

        {/* Expandable occurrences section */}
        <div className="mt-4 border-t border-border/60 pt-3">
          <button
            onClick={onToggleExpand}
            className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground transition-all border border-border/80 cursor-pointer"
          >
            <span>
              {isExpanded ? 'Ocultar' : 'Mostrar'} las {group.instances.length} {group.instances.length === 1 ? 'ocurrencia encontrada' : 'ocurrencias encontradas'}
            </span>
            <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              {group.instances.length}
            </span>
          </button>

          {isExpanded && (
            <div className="flex flex-col gap-3 mt-3 pl-3 border-l-2 border-primary/40 transition-all duration-300">
              {group.instances.map((instance, instIdx) => (
                <div key={instance.id} className="bg-card p-3 rounded-lg border border-border/60 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold flex-wrap gap-2">
                    <span>Instancia #{instIdx + 1}</span>
                    {instance.url && (
                      <span className="break-all font-mono">
                        URL: <a href={instance.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{instance.url}</a>
                      </span>
                    )}
                  </div>
                  {instance.selector && (
                    <div className="text-xs text-foreground/90">
                      <strong>Selector:</strong> <code className="font-mono text-primary text-[11px] bg-primary/5 px-1.5 py-0.5 rounded break-all">{instance.selector}</code>
                    </div>
                  )}
                  {instance.codeSnippet && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[9px] font-semibold text-muted-foreground">CÓDIGO INVOLUCRADO:</label>
                        <button
                          onClick={() => handleCopyCode(instance.codeSnippet || '')}
                          className="text-[9px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-2.5 h-2.5" /> Copiar Código
                        </button>
                      </div>
                      <pre className="bg-muted p-2 rounded text-[11px] font-mono text-foreground overflow-x-auto border border-border/50 max-h-32">
                        <code>{instance.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
