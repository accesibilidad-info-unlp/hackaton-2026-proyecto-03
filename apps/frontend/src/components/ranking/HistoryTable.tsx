import type { HistoryItem } from "@/services/history/types";
import { getAccessibilityLevel } from "@/utils/accessibilityLevel";

type HistoryTableProps = {
    history: HistoryItem[];
};

export default function HistoryTable({ history }: HistoryTableProps) {
    return (
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
                        <th className="text-left p-3">
                            Fecha
                        </th>

                        <th className="text-left p-3">
                            URL
                        </th>

                        <th className="text-center p-3">
                            Violaciones
                        </th>

                        <th className="text-center p-3">
                            Páginas
                        </th>
                        <th className="text-center p-3">
                            Nivel
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {history.map((audit, index) => {

                        const level = getAccessibilityLevel(
                            audit.summary.totalViolations,
                            audit.summary.totalPagesVisited
                        );

                        return (

                            <tr
                                key={index}
                                className="border-t border-border hover:bg-muted/40 transition-colors"
                            >

                                <td className="p-3">
                                    {new Date(audit.fecha).toLocaleString("es-AR")}
                                </td>

                                <td
                                    className="p-3"
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

                                <td className="text-center p-3">

                                    <span
                                        className={`${level.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                                    >
                                        {level.label}
                                    </span>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>
            </table>
            <div className="mt-6 rounded-lg border border-border bg-card p-4">

                <h3 className="font-semibold mb-2">
                    Criterio del nivel de accesibilidad
                </h3>

                <ul className="text-sm text-muted-foreground space-y-1">

                    <li><strong>Excelente:</strong> hasta 10 errores por página.</li>

                    <li><strong>Bueno:</strong> entre 11 y 25 errores por página.</li>

                    <li><strong>Regular:</strong> entre 26 y 50 errores por página.</li>

                    <li><strong>Deficiente:</strong> entre 51 y 80 errores por página.</li>

                    <li><strong>Crítico:</strong> más de 80 errores por página.</li>

                </ul>

            </div>
        </section>
    );
}