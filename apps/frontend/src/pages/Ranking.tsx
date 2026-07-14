import { useEffect, useState } from "react";
import { getHistory } from "@/services/history/historyService";
import type { HistoryItem } from "@/services/history/types";
import StatisticsCards from "@/components/ranking/StatisticsCards";
import HistoryTable from "@/components/ranking/HistoryTable";
import RankingTable from "@/components/ranking/RankingTable";
import SeverityCards from "@/components/ranking/SeverityCards";
import AIReportModal from "@/components/ranking/AIReportModal";

type RankingProps = {
    onBack: () => void;
};

export default function Ranking({ onBack }: RankingProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [showReport, setShowReport] = useState(false);

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

    const rulesRanking = Object.entries(
        history.reduce<Record<string, number>>((acc, audit) => {

            Object.entries(audit.byRule).forEach(([rule, count]) => {
                acc[rule] = (acc[rule] || 0) + count;
            });

            return acc;

        }, {})
    )
        .sort((a, b) => a[1] - b[1])
        .slice(0, 10);
    const ruleNames: Record<string, string> = {
        "button-name": "Botones sin nombre accesible",
        "heading-order": "Orden incorrecto de encabezados",
        "landmark-one-main": "Falta región principal",
        "link-name": "Enlaces sin nombre accesible",
        "page-has-heading-one": "Página sin encabezado H1",
        "region": "Regiones sin landmark",
        "color-contrast": "Contraste insuficiente"

    };
    
    const rulesRows = rulesRanking.map(([rule, count], index) => ({

        position:
            index === 0
                ? "🥇"
                : index === 1
                    ? "🥈"
                    : index === 2
                        ? "🥉"
                        : `#${index + 1}`,

        label: ruleNames[rule] ?? rule,

        value: count,

    }));

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

    return {
        position: `#${index + 1}`,

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

        value: count,
    };

});





    useEffect(() => {
        async function loadHistory() {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <main className="max-w-6xl mx-auto">
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
                            title="Páginas con menor cantidad de errores"
                            description="Este ranking muestra las páginas que acumularon la menor cantidad de errores detectados durante las auditorías realizadas."
                            labelHeader="Página"
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