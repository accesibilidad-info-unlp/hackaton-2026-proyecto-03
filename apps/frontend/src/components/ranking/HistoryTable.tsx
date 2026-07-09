import type { HistoryItem } from "@/services/history/types";

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
                    </tr>
                </thead>

                <tbody>

                    {history.map((audit, index) => (

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

                        </tr>

                    ))}

                </tbody>

            </table>

        </section>
    );
}