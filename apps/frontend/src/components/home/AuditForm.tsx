import React from 'react';
import { Globe, RefreshCw, Sparkles, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface AuditFormProps {
  scanUrl: string;
  onUrlChange: (url: string) => void;
  isScanning: boolean;
  useAgent: 'fast' | 'recursive';
  onUseAgentChange: (agent: 'fast' | 'recursive') => void;
  onSubmit: (e: React.FormEvent) => void;
  variant?: 'hero' | 'compact';
}

export function AuditForm({
  scanUrl,
  onUrlChange,
  isScanning,
  useAgent,
  onUseAgentChange,
  onSubmit,
  variant = 'hero'
}: AuditFormProps) {
  
  const toggleAgent = () => {
    onUseAgentChange(useAgent === 'fast' ? 'recursive' : 'fast');
  };

  if (variant === 'compact') {
    return (
      <Card className="shadow-md border-border bg-card/60 backdrop-blur-md">
        <CardContent className="py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <Globe className="w-5 h-5 text-primary" />
            <div>
              <h2 className="font-bold text-sm text-foreground">Auditar Sitio Web</h2>
              <p className="text-xs text-muted-foreground">Analizar nivel de accesibilidad</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex-grow flex flex-col md:flex-row gap-3 max-w-3xl w-full">
            <div className="flex items-center justify-center gap-2 px-2 bg-muted/50 rounded-lg">
              <span className={`text-xs ${useAgent === 'recursive' ? 'text-foreground' : 'text-muted-foreground'}`}>Recur.</span>
              <button
                type="button"
                onClick={toggleAgent}
                className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary/80 transition-colors cursor-pointer"
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${useAgent === 'fast' ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
              <span className={`text-xs ${useAgent === 'fast' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>Fast</span>
            </div>
            <div className="relative flex-grow">
              <input
                type="url"
                value={scanUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                required
                disabled={isScanning}
                placeholder="https://ejemplo.com"
                className="w-full pl-3 pr-3 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md shadow-primary/10 shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-primary-foreground" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                  Escanear
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Hero / Initial Variant
  return (
    <div className="w-full max-w-2xl flex flex-col gap-8">
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
          <ShieldAlert className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Auditoría de Accesibilidad IA
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Ingrese la dirección de su sitio web para analizar el nivel de cumplimiento de las pautas WCAG 2.2 de accesibilidad en tiempo real.
        </p>
      </div>

      <Card className="shadow-2xl border-border bg-card/60 backdrop-blur-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Globe className="w-5 h-5 text-primary" />
            Auditar Sitio Web
          </CardTitle>
          <CardDescription>
            Analice contraste de color, estructura de encabezados, alternativas de imágenes y accesibilidad por teclado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className={`text-sm font-medium ${useAgent === 'recursive' ? 'text-foreground' : 'text-muted-foreground'}`}>IA Recursiva</span>
            <button
              type="button"
              onClick={toggleAgent}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/80 hover:bg-primary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useAgent === 'fast' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium ${useAgent === 'fast' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>IA Rápida (Determinista)</span>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="url"
                value={scanUrl}
                onChange={(e) => onUrlChange(e.target.value)}
                required
                disabled={isScanning}
                placeholder="https://ejemplo.com"
                className="w-full pl-3 pr-3 py-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-primary-foreground" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                  Comenzar Auditoría
                </>
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
