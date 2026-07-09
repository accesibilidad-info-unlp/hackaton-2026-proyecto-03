import { useEffect, useState } from "react";
import { getHistory } from "@/services/history/historyService";
import type { HistoryItem } from "@/services/history/types";

type RankingProps = {
    onBack: () => void;
};

export default function Ranking({ onBack }: RankingProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

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

    const rulesRanking = Object.entries(
        history.reduce<Record<string, number>>((acc, audit) => {

            Object.entries(audit.byRule).forEach(([rule, count]) => {
                acc[rule] = (acc[rule] || 0) + count;
            });

            return acc;

        }, {})
    )
        .sort((a, b) => b[1] - a[1])
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
                        <section
                            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-card border rounded-xl p-6 shadow">
                                <h3 className="text-sm text-muted-foreground">
                                    Auditorías realizadas
                                </h3>

                                <p className="text-3xl font-bold mt-2">
                                    {totalAudits}
                                </p>
                            </div>

                            <div className="bg-card border rounded-xl p-6 shadow">
                                <h3 className="text-sm text-muted-foreground">
                                    Violaciones detectadas
                                </h3>

                                <p className="text-3xl font-bold mt-2">
                                    {totalViolations}
                                </p>
                            </div>

                            <div className="bg-card border rounded-xl p-6 shadow">
                                <h3 className="text-sm text-muted-foreground">
                                    Páginas auditadas
                                </h3>

                                <p className="text-3xl font-bold mt-2">
                                    {totalPages}
                                </p>
                            </div>

                            <div className="bg-card border rounded-xl p-6 shadow">
                                <h3 className="text-sm text-muted-foreground">
                                    Promedio por auditoría
                                </h3>

                                <p className="text-3xl font-bold mt-2">
                                    {averageViolations}
                                </p>
                            </div>
                        </section>
                        <section className="mt-10">
                            <h2 className="text-2xl font-semibold mb-4">
                                Historial de auditorías
                            </h2>

                            <p className="text-muted-foreground mb-6">
                                A continuación se muestran todas las auditorías almacenadas
                                en el historial del sistema.
                            </p>

                            <table className="w-full border border-border rounded-lg overflow-hidden">

                                <thead className="bg-muted">
                                    <tr>
                                        <th className="text-left p-3">Fecha</th>
                                        <th className="text-left p-3">URL</th>
                                        <th className="text-center p-3">Violaciones</th>
                                        <th className="text-center p-3">Páginas</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {history.map((audit, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-border"
                                        >
                                            <td className="p-3">
                                                {new Date(audit.fecha).toLocaleString()}
                                            </td>

                                            <td className="p-3"
                                                title={audit.url}
                                            >
                                                {new URL(audit.url).hostname}
                                            </td>

                                            <td className="text-center p-3">
                                                {audit.summary.totalViolations}
                                            </td>

                                            <td className="text-center p-3">
                                                {audit.summary.totalPagesVisited}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                        
                        <section className="mt-12">
                            <h2 className="text-2xl font-semibold mb-2">
                                Reglas de accesibilidad más incumplidas
                            </h2>

                            <p className="text-muted-foreground mb-6">
                                Ranking de las reglas WCAG que presentaron mayor cantidad de incumplimientos
                                considerando todas las auditorías almacenadas.
                            </p>

                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="text-left p-4">Posición</th>
                                            <th className="text-left p-4">Regla</th>
                                            <th className="text-right p-4">Ocurrencias</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {rulesRanking.map(([rule, count], index) => (
                                            
                                            <tr
                                                key={rule}
                                                className="border-t border-border hover:bg-muted/40 transition-colors"
                                            >
                                                <td className="p-4 font-semibold">
                                                    {index === 0
                                                        ? "🥇"
                                                        : index === 1
                                                            ? "🥈"
                                                            : index === 2
                                                                ? "🥉"
                                                                : `#${index + 1}`}
                                                </td>

                                                <td className="p-4 font-mono">
                                                    {ruleNames[rule] ?? rule}
                                                </td>

                                                <td className="p-4 text-right font-semibold">
                                                    {count}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}