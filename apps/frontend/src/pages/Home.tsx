import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { AuditForm } from '@/components/home/AuditForm';
import { AuditProgress } from '@/components/home/AuditProgress';
import { ScoreGauge } from '@/components/home/ScoreGauge';
import { AuditSummaryCard } from '@/components/home/AuditSummaryCard';
import { FindingsList } from '@/components/home/FindingsList';
import {
  runAccessibilityAudit,
  calculateAccessibilityScore,
  mapViolationsToIssues
} from '@/services/home/auditService';
import type { AuditSummary, AuditIssue } from '@/services/home/types';

export default function Home() {
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme-dark') === 'true');
  const [scanUrl, setScanUrl] = useState<string>('https://www.info.unlp.edu.ar/');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [score, setScore] = useState<number>(100);
  const [summaryData, setSummaryData] = useState<AuditSummary | null>(null);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [useAgent, setUseAgent] = useState<'fast' | 'recursive'>('fast');
  const [issues, setIssues] = useState<AuditIssue[]>([]);

  // Apply active theme (dark/light) on mount
  useEffect(() => {
    const isDark = localStorage.getItem('theme-dark') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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

  // Step timer simulation during active scanning
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
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('theme-dark', String(nextDark));
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanUrl.trim()) return;
    setIsScanning(true);
    setCurrentStep(0);
    const wasScanned = hasScanned;
    setHasScanned(true);

    try {
      const report = await runAccessibilityAudit(scanUrl, useAgent);

      if (report && Array.isArray(report.violations)) {
        const mappedIssues = mapViolationsToIssues(report.violations);
        setIssues(mappedIssues);
        setSummaryData({ ...report.summary, durationMs: report.durationMs });

        const calculatedScore = calculateAccessibilityScore(report.summary);
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
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-16">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      {!hasScanned ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex flex-col items-center justify-center min-h-[50vh]">
          <AuditForm
            scanUrl={scanUrl}
            onUrlChange={setScanUrl}
            isScanning={isScanning}
            useAgent={useAgent}
            onUseAgentChange={setUseAgent}
            onSubmit={handleScan}
            variant="hero"
          />
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-8">
          
          {/* Top Bar: Compact Audit Form */}
          <AuditForm
            scanUrl={scanUrl}
            onUrlChange={setScanUrl}
            isScanning={isScanning}
            useAgent={useAgent}
            onUseAgentChange={setUseAgent}
            onSubmit={handleScan}
            variant="compact"
          />

          {isScanning ? (
            <AuditProgress scanUrl={scanUrl} currentStep={currentStep} />
          ) : (
            <>
              {/* Row 2: Score Gauge and Audit Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScoreGauge score={score} />
                <AuditSummaryCard
                  summaryData={summaryData}
                  issues={issues}
                  scanUrl={scanUrl}
                />
              </div>

              {/* Row 3: Findings Details */}
              <FindingsList issues={issues} />
            </>
          )}
        </main>
      )}
    </div>
  );
}
