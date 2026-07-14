import { useEffect, useState } from "react";
import { getHistory } from "@/services/history/historyService";
import type { HistoryItem } from "@/services/history/types";
import { Header } from '@/components/layout/Header';
import StatisticsCards from "@/components/ranking/StatisticsCards";
import HistoryTable from "@/components/ranking/HistoryTable";
import RankingTable from "@/components/ranking/RankingTable";
import SeverityCards from "@/components/ranking/SeverityCards";
import AIReportModal from "@/components/ranking/AIReportModal";
import { getAccessibilityLevel } from "@/utils/accessibilityLevel";

type RankingProps = {
    onBack: () => void;
};

export default function Ranking({ onBack }: RankingProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState<boolean>(
        () => localStorage.getItem('theme-dark') === 'true'
    );
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [showReport, setShowReport] = useState(false);

    // Apply active theme (dark/light) on mount
    useEffect(() => {
        const isDark = localStorage.getItem('theme-dark') === 'true';
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);
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

    const totalAudits = history.length;

    const totalViolations = history.reduce(
        (acc, audit) => acc + audit.summary.totalViolations,
        0
    );

    const totalPages = history.reduce(
        (acc, audit) => acc + audit.summary.totalPagesVisited,
        0
    );

    const averageViolations =
        totalAudits > 0
            ? (totalViolations / totalAudits).toFixed(1)
            : "0";

    const severityTotals = history.reduce(
        (acc, audit) => {
            acc.critical += audit.summary.severityBreakdown.critical;
            acc.serious += audit.summary.severityBreakdown.serious;
            acc.moderate += audit.summary.severityBreakdown.moderate;
            acc.minor += audit.summary.severityBreakdown.minor;

            return acc;
        },
        {
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0,
        }
    );

    const pagesRanking = Object.entries(
        history.reduce<Record<string, number>>((acc, audit) => {

            Object.entries(audit.byPage).forEach(([page, count]) => {
                acc[page] = (acc[page] || 0) + count;
            });

            return acc;

        }, {})
    )
        .sort((a, b) => a[1] - b[1])
        .slice(0, 10);


    const pagesRows = pagesRanking.map(([page, count], index) => {

        const url = new URL(page);
        const isHome = url.pathname === "/";

        const audit = history.find(item =>
            Object.keys(item.byPage).includes(page)
        );

        const level = audit
            ? getAccessibilityLevel(
                audit.summary.totalViolations,
                audit.summary.totalPagesVisited
            )
            : null;

        return {
            position:
                index === 0
                    ? <span className="text-3xl inline-block -ml-2">🥇</span>
                    : index === 1
                        ? <span className="text-3xl inline-block -ml-2">🥈</span>
                        : index === 2
                            ? <span className="text-3xl inline-block -ml-2">🥉</span>
                            : `#${index + 1}`,

            label: (
                <div>
                    <a
                        href={page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                    >
                        {url.hostname}
                    </a>

                    {!isHome && (
                        <div className="text-sm text-muted-foreground">
                            {url.pathname}
                        </div>
                    )}
                </div>
            ),

            level,

            value: count,
        };
    });


    useEffect(() => {
        async function loadHistory() {
            try {
                const data = await getHistory();

                const sortedHistory = data.sort(
                    (a, b) =>
                        new Date(b.fecha).getTime() -
                        new Date(a.fecha).getTime()
                );

                setHistory(sortedHistory);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, []);

    return (

        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-16">

            <Header
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
            />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Historial y Ranking
                        </h1>

                        <p className="text-muted-foreground mt-2 max-w-3xl">
                            Consulte el historial de auditorías realizadas y las estadísticas
                            generales obtenidas durante los análisis de accesibilidad.
                        </p>
                    </div>

                    <button
                        onClick={onBack}
                        className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                    >
                        Volver a la auditoría
                    </button>
                </div>


                {loading ? (
                    <p>Cargando historial...</p>
                ) : (
                    <>
                        <StatisticsCards
                            totalAudits={totalAudits}
                            totalViolations={totalViolations}
                            totalPages={totalPages}
                            averageViolations={averageViolations}
                        />

                        <RankingTable
                            title="Top 10 páginas con mejor accesibilidad"
                            description="Las páginas con menor cantidad de errores detectados obtienen las mejores posiciones en este ranking de accesibilidad."
                            labelHeader="Página"
                            extraHeader="Nivel"
                            valueHeader="Errores"
                            rows={pagesRows}
                        />

                        <SeverityCards
                            critical={severityTotals.critical}
                            serious={severityTotals.serious}
                            moderate={severityTotals.moderate}
                            minor={severityTotals.minor}
                        />

                        <HistoryTable
                            history={history}
                            onOpenReport={(report) => {
                                setSelectedReport(report);
                                setShowReport(true);
                            }}
                        />
                    </>
                )}

                <AIReportModal
                    report={selectedReport}
                    open={showReport}
                    onClose={() => {
                        setShowReport(false);
                        setSelectedReport(null);
                    }}
                />

            </main>
        </div>
    );
}