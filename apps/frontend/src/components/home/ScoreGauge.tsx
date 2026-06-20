import { Card } from "@/components/ui/card";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - score / 100);

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
    </Card>
  );
}
