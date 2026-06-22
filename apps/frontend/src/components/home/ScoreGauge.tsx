import { Card } from "@/components/ui/card";
import type { AuditIssue } from "@/services/home/types";

interface ScoreGaugeProps {
  score: number;
  issues: AuditIssue[];
}

function getWcagLevel(ruleId: string, tags: string[] = []): 'A' | 'AA' | 'AAA' {
  for (const tag of tags) {
    const t = tag.toLowerCase();
    if (t.includes('wcag2aaa') || t.includes('wcag21aaa') || t.includes('wcag22aaa')) {
      return 'AAA';
    }
    if (t.includes('wcag2aa') || t.includes('wcag21aa') || t.includes('wcag22aa')) {
      return 'AA';
    }
    if (t.includes('wcag2a') || t.includes('wcag21a') || t.includes('wcag22a')) {
      return 'A';
    }
  }

  const id = ruleId.toLowerCase();
  if (id.includes('enhanced') || id.includes('aaa')) {
    return 'AAA';
  }
  if (
    id.includes('contrast') || 
    id.includes('zoom') || 
    id.includes('focus-visible') || 
    id.includes('resize') ||
    id.includes('orientation')
  ) {
    return 'AA';
  }
  return 'A';
}

export function ScoreGauge({ score, issues }: ScoreGaugeProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);

  let countA = 0;
  let countAA = 0;
  let countAAA = 0;

  issues.forEach(issue => {
    const level = getWcagLevel(issue.title, issue.tags || []);
    if (level === 'AAA') countAAA++;
    else if (level === 'AA') countAA++;
    else countA++;
  });

  return (
    <Card className="shadow-lg border-border flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth="8"
            className="stroke-border"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="var(--primary)"
            strokeWidth="8"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${strokeDashoffset}`}
            strokeLinecap="round"
            className="stroke-primary transition-all duration-1000 ease-in-out"
          />
        </svg>
        <span className="text-3xl font-extrabold text-foreground tracking-tight">{score}</span>
      </div>
      <h3 className="font-bold text-sm text-foreground mt-4 leading-none">Puntaje Global</h3>
      <p className="text-xs text-muted-foreground mt-1">Cumplimiento WCAG 2.2</p>

      {/* Conformidad WCAG */}
      <div className="w-full mt-6 pt-4 border-t border-border/40 text-left">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3 text-center">
          Conformidad WCAG
        </span>
        <div className="flex flex-col gap-2.5">
          {/* Nivel A */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-500/10 text-red-500 font-extrabold flex items-center justify-center text-[9px] shrink-0">A</span>
              Nivel A (Básico)
            </span>
            <span className="font-bold text-foreground">
              {countA} {countA === 1 ? 'error' : 'errores'}
            </span>
          </div>

          {/* Nivel AA */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-5 h-4 rounded bg-amber-500/10 text-amber-500 font-extrabold flex items-center justify-center text-[9px] shrink-0">AA</span>
              Nivel AA (Estándar)
            </span>
            <span className="font-bold text-foreground">
              {countAA} {countAA === 1 ? 'error' : 'errores'}
            </span>
          </div>

          {/* Nivel AAA */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-4 rounded bg-blue-500/10 text-blue-500 font-extrabold flex items-center justify-center text-[9px] shrink-0">AAA</span>
              Nivel AAA (Avanzado)
            </span>
            <span className="font-bold text-foreground">
              {countAAA} {countAAA === 1 ? 'error' : 'errores'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
