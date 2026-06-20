import { Activity, Check, RefreshCw } from 'lucide-react';

interface AuditProgressProps {
  scanUrl: string;
  currentStep: number;
}

export function AuditProgress({ scanUrl, currentStep }: AuditProgressProps) {
  const steps = [
    'Conectando con el sitio y cargando DOM',
    'Ejecutando reglas de accesibilidad Axe-Core',
    'Mapeando impacto por tipo de discapacidad',
    'Generando reporte de recomendaciones con IA'
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-8 py-12">
      <div className="relative flex items-center justify-center mb-6">
        <div className="relative w-20 h-20 rounded-full bg-card/80 backdrop-blur border border-border shadow-xl flex items-center justify-center">
          <Activity className="w-10 h-10 text-primary" />
        </div>
      </div>

      <div className="text-center max-w-md space-y-3">
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
          <span>Analizando sitio web...</span>
        </h3>
        <p className="text-xs text-muted-foreground font-mono break-all px-4 bg-muted/50 py-1.5 rounded-lg border border-border/50">
          {scanUrl}
        </p>
        <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
          Evaluando accesibilidad por teclado, contraste de colores, estructura de encabezados y pautas WCAG 2.2
        </p>
      </div>

      {/* Dynamic steps showing audit progress */}
      <div className="w-full max-w-md bg-card/40 backdrop-blur-sm rounded-2xl border border-border/80 p-5 shadow-sm space-y-4">
        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Progreso de la Auditoría</div>
        <div className="space-y-3">
          {steps.map((label, stepIdx) => {
            const isCompleted = currentStep > stepIdx;
            const isActive = currentStep === stepIdx;

            return (
              <div key={stepIdx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    </div>
                  )}
                  <span className={`transition-colors duration-300 ${isActive ? 'text-foreground font-semibold' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                    {label}
                  </span>
                </div>
                {isActive && <span className="text-[10px] text-primary font-mono">En curso...</span>}
                {isCompleted && <span className="text-[10px] text-emerald-500 font-semibold">Listo</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
