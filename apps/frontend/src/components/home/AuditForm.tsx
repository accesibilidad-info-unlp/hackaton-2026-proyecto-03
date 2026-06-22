import React, { useState } from 'react';
import { 
  Globe, 
  RefreshCw, 
  Sparkles, 
  ShieldAlert, 
  Link2, 
  Settings, 
  ChevronDown, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface AuditFormProps {
  scanMode: 'crawl' | 'list';
  onScanModeChange: (mode: 'crawl' | 'list') => void;
  scanUrl: string;
  onUrlChange: (url: string) => void;
  urlList: string[];
  onUrlListChange: (urls: string[]) => void;
  maxPages: number;
  onMaxPagesChange: (pages: number) => void;
  maxDepth: number;
  onMaxDepthChange: (depth: number) => void;
  maxDurationMinutes: number;
  onMaxDurationMinutesChange: (minutes: number) => void;
  isScanning: boolean;
  onSubmit: (e: React.FormEvent) => void;
  variant?: 'hero' | 'compact';
}

export function AuditForm({
  scanMode,
  onScanModeChange,
  scanUrl,
  onUrlChange,
  urlList,
  onUrlListChange,
  maxPages,
  onMaxPagesChange,
  maxDepth,
  onMaxDepthChange,
  maxDurationMinutes,
  onMaxDurationMinutesChange,
  isScanning,
  onSubmit,
  variant = 'hero'
}: AuditFormProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleUrlListChange = (index: number, val: string) => {
    const newList = [...urlList];
    newList[index] = val;
    onUrlListChange(newList);
  };

  const addUrlField = () => {
    onUrlListChange([...urlList, '']);
  };

  const removeUrlField = (index: number) => {
    const newList = urlList.filter((_, i) => i !== index);
    onUrlListChange(newList);
  };

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  const isFormInvalid = scanMode === 'crawl' 
    ? !scanUrl.trim() 
    : urlList.filter(u => u.trim() !== '').length === 0;

  // TAB SELECTOR COMPONENT (Segmented Control)
  const renderTabSwitcher = () => (
    <div className="flex p-1 bg-muted/60 dark:bg-muted/30 backdrop-blur rounded-xl border border-border/40 mb-6 max-w-md mx-auto w-full">
      <button
        type="button"
        disabled={isScanning}
        onClick={() => onScanModeChange('crawl')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
          scanMode === 'crawl' 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'text-muted-foreground hover:text-foreground disabled:opacity-50'
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        Rastreo de Dominio
      </button>
      <button
        type="button"
        disabled={isScanning}
        onClick={() => onScanModeChange('list')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
          scanMode === 'list' 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'text-muted-foreground hover:text-foreground disabled:opacity-50'
        }`}
      >
        <Link2 className="w-3.5 h-3.5" />
        Lista de URLs
      </button>
    </div>
  );

  // ADVANCED SETTINGS FOR CRAWL MODE
  const renderAdvancedSettings = () => {
    if (scanMode !== 'crawl') return null;

    return (
      <div className="mt-4 border-t border-border/50 pt-4">
        <button
          type="button"
          onClick={toggleAdvanced}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          Configuración Avanzada
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
        </button>

        {isAdvancedOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 p-4 rounded-xl bg-muted/20 border border-border/30 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="maxPages" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Límite de Páginas
              </label>
              <input
                id="maxPages"
                type="number"
                min="1"
                max="100"
                value={maxPages}
                disabled={isScanning}
                onChange={(e) => onMaxPagesChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-background border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary rounded-lg px-3 py-2 text-xs text-foreground transition-all"
              />
              <span className="text-[9px] text-muted-foreground/80">Cantidad máxima a escanear</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="maxDepth" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Profundidad de Rastreo
              </label>
              <input
                id="maxDepth"
                type="number"
                min="0"
                max="10"
                value={maxDepth}
                disabled={isScanning}
                onChange={(e) => onMaxDepthChange(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-background border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary rounded-lg px-3 py-2 text-xs text-foreground transition-all"
              />
              <span className="text-[9px] text-muted-foreground/80">Niveles de enlaces a seguir</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="maxDuration" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Tiempo Límite (minutos)
              </label>
              <input
                id="maxDuration"
                type="number"
                min="1"
                max="60"
                value={maxDurationMinutes}
                disabled={isScanning}
                onChange={(e) => onMaxDurationMinutesChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-background border border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary rounded-lg px-3 py-2 text-xs text-foreground transition-all"
              />
              <span className="text-[9px] text-muted-foreground/80">Detención por timeout</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // URL INPUT FOR CRAWL MODE
  const renderCrawlInput = () => (
    <div className="relative flex-grow">
      <input
        type="url"
        value={scanUrl}
        onChange={(e) => onUrlChange(e.target.value)}
        required={scanMode === 'crawl'}
        disabled={isScanning}
        placeholder="https://ejemplo.com"
        className="w-full pl-3 pr-3 py-3 text-sm rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
      />
    </div>
  );

  // DYNAMIC URLS INPUT FOR LIST MODE
  const renderListInputs = () => (
    <div className="flex flex-col gap-3 w-full">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
        URLs a Auditar
      </span>
      {urlList.map((url, index) => (
        <div key={index} className="flex gap-2 items-center w-full animate-in fade-in duration-150">
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlListChange(index, e.target.value)}
            required={scanMode === 'list'}
            disabled={isScanning}
            placeholder="https://ejemplo.com/pagina-especifica"
            className="flex-grow pl-3 pr-3 py-2.5 text-sm rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
          />
          {urlList.length > 1 && (
            <button
              type="button"
              disabled={isScanning}
              onClick={() => removeUrlField(index)}
              className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Eliminar URL"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        disabled={isScanning}
        onClick={addUrlField}
        className="self-start flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 hover:bg-primary/20 disabled:opacity-50 px-3 py-2 rounded-lg transition-colors cursor-pointer mt-1"
      >
        <Plus className="w-3.5 h-3.5" />
        Agregar otra URL
      </button>
    </div>
  );

  // Compact Variant (Top bar)
  if (variant === 'compact') {
    return (
      <Card className="shadow-lg border-border bg-card/65 backdrop-blur-xl transition-all duration-300">
        <CardContent className="py-4 px-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-3">
            <div className="flex items-center gap-2.5 shrink-0">
              <Globe className="w-5 h-5 text-primary animate-pulse" />
              <div>
                <h2 className="font-bold text-sm text-foreground">Auditar Sitio Web</h2>
                <p className="text-[10px] text-muted-foreground">Analizar nivel de accesibilidad WCAG 2.2</p>
              </div>
            </div>
            {renderTabSwitcher()}
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full">
              {scanMode === 'crawl' ? renderCrawlInput() : renderListInputs()}
              
              <button
                type="submit"
                disabled={isScanning || isFormInvalid}
                className="bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10 shrink-0 w-full md:w-auto self-stretch md:self-auto"
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
            </div>
            {renderAdvancedSettings()}
          </form>
        </CardContent>
      </Card>
    );
  }

  // Hero / Initial Variant
  return (
    <div className="w-full max-w-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="text-center space-y-4">
        <div className="inline-flex p-3.5 rounded-2xl bg-primary/10 text-primary mb-1 shadow-inner border border-primary/20">
          <ShieldAlert className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground bg-gradient-to-r from-foreground via-foreground to-foreground bg-clip-text">
          Auditoría de Accesibilidad IA
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Ingrese la dirección de su sitio web para analizar el nivel de cumplimiento de las pautas WCAG 2.2 de accesibilidad en tiempo real.
        </p>
      </div>

      <Card className="shadow-2xl border border-white/10 dark:border-white/5 bg-card/65 backdrop-blur-xl transition-all duration-300 relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Globe className="w-5 h-5 text-primary" />
            Configurar Auditoría
          </CardTitle>
          <CardDescription>
            Seleccione el modo de análisis y las opciones de accesibilidad a evaluar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderTabSwitcher()}

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {scanMode === 'crawl' ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  {renderCrawlInput()}
                  <button
                    type="submit"
                    disabled={isScanning || isFormInvalid}
                    className="bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 shrink-0"
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
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {renderListInputs()}
                  <button
                    type="submit"
                    disabled={isScanning || isFormInvalid}
                    className="w-full bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 mt-2"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-primary-foreground" />
                        Analizando URLs...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                        Comenzar Auditoría de URLs
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            {renderAdvancedSettings()}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
