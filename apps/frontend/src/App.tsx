import { useState, useEffect } from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  FileText,
  Sun,
  Moon,
  RefreshCw,
  Globe,
  Check,
  Copy,
  ChevronRight,
  Sparkles,
  Info,
  Eye,
  Keyboard,
  Brain,
  Volume2,
  Accessibility
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"

interface AuditViolation {
  id: string
  impact?: 'critical' | 'serious' | 'moderate' | 'minor'
  ruleId: string
  description: string
  helpUrl?: string
  html?: string
  disabilities?: string[]
  translatedName?: string
  translatedDescription?: string
  url?: string
  selector?: string
}

interface AuditSummary {
  totalPagesVisited: number
  totalViolations: number
  durationMs?: number
  severityBreakdown: {
    critical: number
    serious: number
    moderate: number
    minor: number
  }
}

interface AuditReport {
  summary: AuditSummary;
  violations: AuditViolation[];
  durationMs?: number;
}

interface AuditIssue {
  id: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  category: 'contraste' | 'images' | 'structure' | 'keyboard' | 'other'
  title: string
  description: string
  recommendation: string
  codeSnippet?: string
  disabilities?: string[]
  translatedName?: string
  translatedDescription?: string
  url?: string
  selector?: string
}

function getDisabilityStyle(disability: string) {
  const normalized = disability.toLowerCase();
  if (normalized.includes('lector') || normalized.includes('ceguera')) {
    return {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30',
      icon: Eye
    };
  }
  if (normalized.includes('visión') || normalized.includes('contraste') || normalized.includes('daltonismo')) {
    return {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30',
      icon: Eye
    };
  }
  if (normalized.includes('teclado') || normalized.includes('motriz')) {
    return {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30',
      icon: Keyboard
    };
  }
  if (normalized.includes('cognitiva') || normalized.includes('estructura') || normalized.includes('comprensión')) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30',
      icon: Brain
    };
  }
  if (normalized.includes('auditiva') || normalized.includes('subtítulo') || normalized.includes('audio')) {
    return {
      bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 dark:border-pink-500/30',
      icon: Volume2
    };
  }
  return {
    bg: 'bg-muted text-muted-foreground border-border',
    icon: Accessibility
  };
}

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme-dark') === 'true')
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'serious' | 'moderate' | 'minor'>('all')
  const [scanUrl, setScanUrl] = useState<string>('https://www.info.unlp.edu.ar/')
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [score, setScore] = useState<number>(100)
  const [summaryData, setSummaryData] = useState<AuditSummary | null>(null)
  const [hasScanned, setHasScanned] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({})
  const [useAgent, setUseAgent] = useState<'fast' | 'recursive'>('fast')

  const toggleRuleExpanded = (ruleId: string) => {
    setExpandedRules(prev => ({ ...prev, [ruleId]: !prev[ruleId] }))
  }

  // Read the active CSS file from theme.css dynamically on mount
  useEffect(() => {
    const isDark = localStorage.getItem('theme-dark') === 'true'
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Dynamic Google Font Loader
  useEffect(() => {
    const getActiveFont = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue('--font-sans');
      if (!value) return '';
      // Clean quotes and take the first font family
      return value.split(',')[0].replace(/['"]/g, '').trim();
    };

    const loadFont = (fontName: string) => {
      if (!fontName) return;
      const systemFonts = [
        'sans-serif', 'serif', 'monospace', 'system-ui', '-apple-system',
        'blinkmacsystemfont', 'segoe ui', 'roboto', 'helvetica', 'arial'
      ];
      const normalizedFont = fontName.toLowerCase();
      if (systemFonts.includes(normalizedFont)) return;

      const linkId = 'dynamic-google-font';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      // Load Google Fonts dynamically
      const fontUrlName = fontName.replace(/\s+/g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${fontUrlName}:wght@300;400;500;600;700;800&display=swap`;
    };

    // Load initial font
    const initialFont = getActiveFont();
    if (initialFont) loadFont(initialFont);

    // Watch for variable changes on documentElement style/class
    const observer = new MutationObserver(() => {
      const activeFont = getActiveFont();
      if (activeFont) loadFont(activeFont);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Timeout fallback for dynamically loaded CSS style tags
    const timer = setTimeout(() => {
      const activeFont = getActiveFont();
      if (activeFont) loadFont(activeFont);
    }, 120);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 2500);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning]);

  const toggleDarkMode = () => {
    const nextDark = !darkMode
    setDarkMode(nextDark)
    localStorage.setItem('theme-dark', String(nextDark))
    if (nextDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scanUrl.trim()) return
    setIsScanning(true)
    setCurrentStep(0)
    const wasScanned = hasScanned
    setHasScanned(true)

    try {
      let report: AuditReport | null = null

      if (useAgent === 'fast') {
        // Bypass LLM completely for fast/deterministic crawl to avoid token outputs/timeout bottleneck
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

        report = await response.json();
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
        report = JSON.parse(cleanJson);
      }

      if (report && Array.isArray(report.violations)) {
        const mappedIssues: AuditIssue[] = report.violations.map((violation: AuditViolation) => {
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

        setIssues(mappedIssues);
        setSummaryData({ ...report.summary, durationMs: report.durationMs });

        // Calcular puntaje de accesibilidad dinámico
        const criticalCount = report.summary.severityBreakdown.critical || 0;
        const seriousCount = report.summary.severityBreakdown.serious || 0;
        const moderateCount = report.summary.severityBreakdown.moderate || 0;
        const minorCount = report.summary.severityBreakdown.minor || 0;
        const calculatedScore = Math.max(0, 100 - (criticalCount * 8 + seriousCount * 5 + moderateCount * 2 + minorCount));
        setScore(calculatedScore);
        setHasScanned(true);
      } else {
        throw new Error('El reporte de auditoría no tiene el formato esperado.');
      }
    } catch (error) {
      console.error('Error al realizar el escaneo:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Hubo un error al ejecutar la auditoría de accesibilidad: ${errorMessage}. Asegúrate de que el backend de Mastra esté corriendo.`);
      if (!wasScanned) {
        setHasScanned(false);
      }
    } finally {
      setIsScanning(false);
    }
  }

  const [issues, setIssues] = useState<AuditIssue[]>([])

  const filteredIssues = issues.filter(issue => {
    if (activeTab === 'all') return true
    return issue.impact === activeTab
  })

  // Group filtered issues by ruleId (stored in issue.title)
  const groupedIssues = filteredIssues.reduce((acc, issue) => {
    const key = issue.title;
    if (!acc[key]) {
      acc[key] = {
        ruleId: key,
        translatedName: issue.translatedName || key,
        translatedDescription: issue.translatedDescription || issue.description,
        impact: issue.impact,
        category: issue.category,
        disabilities: issue.disabilities || [],
        recommendation: issue.recommendation,
        instances: []
      };
    }
    acc[key].instances.push(issue);
    return acc;
  }, {} as Record<string, {
    ruleId: string;
    translatedName: string;
    translatedDescription: string;
    impact: 'critical' | 'serious' | 'moderate' | 'minor';
    category: 'contraste' | 'images' | 'structure' | 'keyboard' | 'other';
    disabilities: string[];
    recommendation: string;
    instances: AuditIssue[];
  }>);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-16">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldAlert className="w-6 h-6 animate-pulse text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight flex items-center gap-1.5">
                Auditor de Accesibilidad IA
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
              title="Alternar Modo Oscuro"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-primary" /> : <Moon className="w-4.5 h-4.5 text-primary" />}
            </button>
          </div>
        </div>
      </header>

      {!hasScanned ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex flex-col items-center justify-center min-h-[50vh]">
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
                    onClick={() => setUseAgent(useAgent === 'fast' ? 'recursive' : 'fast')}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary/80 hover:bg-primary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useAgent === 'fast' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className={`text-sm font-medium ${useAgent === 'fast' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>IA Rápida (Determinista)</span>
                </div>
                <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <input
                      type="url"
                      value={scanUrl}
                      onChange={(e) => setScanUrl(e.target.value)}
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
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-8">

          {/* Fila 1: Compact horizontal Audit Bar */}
          <Card className="shadow-md border-border bg-card/60 backdrop-blur-md">
            <CardContent className="py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 shrink-0">
                <Globe className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="font-bold text-sm text-foreground">Auditar Sitio Web</h2>
                  <p className="text-xs text-muted-foreground">Analizar nivel de accesibilidad</p>
                </div>
              </div>

              <form onSubmit={handleScan} className="flex-grow flex flex-col md:flex-row gap-3 max-w-3xl w-full">
                <div className="flex items-center justify-center gap-2 px-2 bg-muted/50 rounded-lg">
                  <span className={`text-xs ${useAgent === 'recursive' ? 'text-foreground' : 'text-muted-foreground'}`}>Recur.</span>
                  <button
                    type="button"
                    onClick={() => setUseAgent(useAgent === 'fast' ? 'recursive' : 'fast')}
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
                    onChange={(e) => setScanUrl(e.target.value)}
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

          {isScanning ? (
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
                  {/* Step 1 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {currentStep > 0 ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : currentStep === 0 ? (
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                          <RefreshCw className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        </div>
                      )}
                      <span className={`transition-colors duration-300 ${currentStep === 0 ? 'text-foreground font-semibold' : currentStep > 0 ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        Conectando con el sitio y cargando DOM
                      </span>
                    </div>
                    {currentStep === 0 && <span className="text-[10px] text-primary font-mono">En curso...</span>}
                    {currentStep > 0 && <span className="text-[10px] text-emerald-500 font-semibold">Listo</span>}
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {currentStep > 1 ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : currentStep === 1 ? (
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                          <RefreshCw className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        </div>
                      )}
                      <span className={`transition-colors duration-300 ${currentStep === 1 ? 'text-foreground font-semibold' : currentStep > 1 ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        Ejecutando reglas de accesibilidad Axe-Core
                      </span>
                    </div>
                    {currentStep === 1 && <span className="text-[10px] text-primary font-mono">En curso...</span>}
                    {currentStep > 1 && <span className="text-[10px] text-emerald-500 font-semibold">Listo</span>}
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {currentStep > 2 ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : currentStep === 2 ? (
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                          <RefreshCw className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        </div>
                      )}
                      <span className={`transition-colors duration-300 ${currentStep === 2 ? 'text-foreground font-semibold' : currentStep > 2 ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        Mapeando impacto por tipo de discapacidad
                      </span>
                    </div>
                    {currentStep === 2 && <span className="text-[10px] text-primary font-mono">En curso...</span>}
                    {currentStep > 2 && <span className="text-[10px] text-emerald-500 font-semibold">Listo</span>}
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {currentStep > 3 ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : currentStep === 3 ? (
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                          <RefreshCw className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        </div>
                      )}
                      <span className={`transition-colors duration-300 ${currentStep === 3 ? 'text-foreground font-semibold' : currentStep > 3 ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        Generando reporte de recomendaciones con IA
                      </span>
                    </div>
                    {currentStep === 3 && <span className="text-[10px] text-primary font-mono">En curso...</span>}
                    {currentStep > 3 && <span className="text-[10px] text-emerald-500 font-semibold">Listo</span>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Fila 2: Dos columnas (Puntaje Global y Resumen de Auditoría) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Score circle card (col-span-1) */}
            <Card className="shadow-lg border-border flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="var(--border)"
                    strokeWidth="8"
                    className="stroke-border"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="var(--primary)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                    strokeLinecap="round"
                    className="stroke-primary transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <span className="text-3xl font-extrabold text-foreground tracking-tight">{score}</span>
              </div>
              <h3 className="font-bold text-sm text-foreground mt-4 leading-none">Puntaje Global</h3>
              <p className="text-xs text-muted-foreground mt-1">Cumplimiento WCAG 2.2</p>
            </Card>

            {/* General metrics summary (col-span-2) */}
            <Card className="shadow-lg border-border p-6 flex flex-col justify-between md:col-span-2">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-primary" />
                  Resumen de Auditoría
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 break-all">Analizado para: <span className="font-mono text-foreground">{scanUrl}</span></p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-center flex flex-col justify-center">
                  <span className="text-xl font-extrabold text-destructive block leading-none">
                    {summaryData?.severityBreakdown?.critical ?? issues.filter(i => i.impact === 'critical').length}
                  </span>
                  <span className="text-[9px] font-bold text-destructive/80 uppercase tracking-wider block mt-1.5">Críticos</span>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center flex flex-col justify-center">
                  <span className="text-xl font-extrabold text-orange-500 block leading-none">
                    {summaryData?.severityBreakdown?.serious ?? issues.filter(i => i.impact === 'serious').length}
                  </span>
                  <span className="text-[9px] font-bold text-orange-500/80 uppercase tracking-wider block mt-1.5">Serios</span>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center flex flex-col justify-center">
                  <span className="text-xl font-extrabold text-yellow-500 block leading-none">
                    {summaryData?.severityBreakdown?.moderate ?? issues.filter(i => i.impact === 'moderate').length}
                  </span>
                  <span className="text-[9px] font-bold text-yellow-500/80 uppercase tracking-wider block mt-1.5">Moderad.</span>
                </div>
                <div className="bg-secondary/50 border border-border rounded-xl p-3 text-center flex flex-col justify-center">
                  <span className="text-xl font-extrabold text-foreground block leading-none">
                    {summaryData?.severityBreakdown?.minor ?? issues.filter(i => i.impact === 'minor').length}
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
                  <div className="flex items-center gap-4 mt-1 border-t border-border/50 pt-2.5">
                    <span className="flex items-center gap-1.5 font-medium"><Globe className="w-3.5 h-3.5 text-primary/70" /> {summaryData.totalPagesVisited} pág.</span>
                    <span className="flex items-center gap-1.5 font-medium"><Activity className="w-3.5 h-3.5 text-primary/70" /> {summaryData.totalViolations} violaciones</span>
                    {summaryData.durationMs && <span className="flex items-center gap-1.5 font-medium"><RefreshCw className="w-3.5 h-3.5 text-primary/70" /> {(summaryData.durationMs / 1000).toFixed(1)}s</span>}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Fila 3: Detalle de Hallazgos (Ancho Completo) */}
          <div className="flex flex-col gap-6">

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-bold text-base text-foreground">Detalle de Hallazgos</h3>

              {/* Tabs */}
              <div className="flex bg-muted p-1 rounded-lg border border-border flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${activeTab === 'all'
                    ? 'bg-card text-foreground shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Todos ({issues.length})
                </button>
                <button
                  onClick={() => setActiveTab('critical')}
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'critical'
                    ? 'bg-destructive text-destructive-foreground shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-destructive'
                    }`}
                >
                  Críticos ({issues.filter(i => i.impact === 'critical').length})
                </button>
                <button
                  onClick={() => setActiveTab('serious')}
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'serious'
                    ? 'bg-orange-500 text-white shadow-sm border border-orange-500/20 font-bold'
                    : 'text-muted-foreground hover:text-orange-500'
                    }`}
                >
                  Serios ({issues.filter(i => i.impact === 'serious').length})
                </button>
                <button
                  onClick={() => setActiveTab('moderate')}
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'moderate'
                    ? 'bg-yellow-500 text-white shadow-sm border border-yellow-500/20 font-bold'
                    : 'text-muted-foreground hover:text-yellow-500'
                    }`}
                >
                  Moderados ({issues.filter(i => i.impact === 'moderate').length})
                </button>
                <button
                  onClick={() => setActiveTab('minor')}
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'minor'
                    ? 'bg-secondary text-secondary-foreground shadow-sm border border-border font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Menores ({issues.filter(i => i.impact === 'minor').length})
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4">
              {Object.values(groupedIssues).map((group) => {
                const isExpanded = !!expandedRules[group.ruleId];
                return (
                  <Card key={group.ruleId} className="shadow-md hover:shadow-lg transition-all duration-200 border-border bg-card/60 backdrop-blur-md">
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
                          {group.disabilities && group.disabilities.map((disability, idx) => {
                            const style = getDisabilityStyle(disability);
                            const Icon = style.icon;
                            return (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all duration-200 hover:scale-105 ${style.bg}`}
                              >
                                <Icon className="w-3 h-3" />
                                {disability}
                              </span>
                            );
                          })}
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
                          onClick={() => toggleRuleExpanded(group.ruleId)}
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
                                        onClick={() => {
                                          navigator.clipboard.writeText(instance.codeSnippet || '');
                                          alert('Código copiado al portapapeles');
                                        }}
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
              })}

              {Object.keys(groupedIssues).length === 0 && (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground text-sm">No se encontraron elementos de este tipo en la auditoría.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
      )}
    </div>
  )
}

export default App
