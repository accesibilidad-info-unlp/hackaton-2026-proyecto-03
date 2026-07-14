import { useEffect, useState } from "react";
import type { AIReport, AIReportIssue } from "@/services/history/aiReportTypes";


type AIReportModalProps = {
    report: AIReport | null;
    open: boolean;
    onClose: () => void;
};

export default function AIReportModal({
    report,
    open,
    onClose,
}: AIReportModalProps) {

    const [showDetails, setShowDetails] = useState(false);
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open || !report) return null;


    const ruleNames: Record<string, string> = {
        "region": "Regiones sin landmark",
        "button-name": "Botones sin nombre accesible",
        "color-contrast": "Contraste insuficiente",
        "heading-order": "Jerarquía incorrecta de encabezados",
        "page-has-heading-one": "Página sin encabezado H1",
        "landmark-one-main": "Falta una región principal",
        "link-name": "Enlaces sin nombre accesible",
    };

    const ruleRecommendations: Record<string, string> = {
        "region": "Incorporar correctamente los landmarks (<main>, <header>, <nav>, <footer>) para mejorar la navegación mediante tecnologías asistivas.",
        "button-name": "Agregar texto visible o atributos aria-label a todos los botones que no poseen un nombre accesible.",
        "color-contrast": "Aumentar el contraste entre texto y fondo respetando las pautas WCAG.",
        "heading-order": "Revisar la jerarquía de encabezados para mantener una estructura lógica.",
        "page-has-heading-one": "Agregar un encabezado principal (H1) en cada página.",
        "landmark-one-main": "Definir una única región principal (<main>) por página.",
        "link-name": "Agregar texto descriptivo o aria-label a los enlaces."
    };

    const topRules = (Object.entries(
        report.issues.reduce<Record<string, number>>((acc, issue: any) => {
            acc[issue.ruleId] = (acc[issue.ruleId] || 0) + 1;
            return acc;
        }, {})
    ) as [string, number][])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-report-title"
        >
            <div className="bg-card rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2
                        id="ai-report-title"
                        className="text-2xl font-bold"
                    >
                        🧠 Informe Inteligente de Accesibilidad
                    </h2>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
                    >
                        Cerrar
                    </button>

                </div>

                {/* Tarjetas superiores */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                            Puntaje
                        </p>

                        <p className="text-3xl font-bold">
                            {report.score}
                        </p>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                            Incidencias
                        </p>

                        <p className="text-3xl font-bold">
                            {report.totalIssues}
                        </p>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                            Fecha
                        </p>

                        <p className="font-semibold">
                            {new Date(report.timestamp).toLocaleString("es-AR")}
                        </p>
                    </div>

                </div>

                {/* Resumen */}

                <section className="border rounded-lg p-5 mb-6">

                    <h3 className="text-xl font-semibold mb-3">
                        Resumen ejecutivo
                    </h3>

                    <p className="leading-7 text-muted-foreground">
                        Se detectaron <strong>{report.totalIssues}</strong> incidencias
                        de accesibilidad. Los principales problemas encontrados están
                        relacionados con la estructura semántica del sitio,
                        elementos interactivos sin nombre accesible y cumplimiento
                        de criterios WCAG.
                    </p>

                </section>

                {/* Prioridades */}

                <section className="border rounded-lg p-5 mb-6">

                    <h3 className="text-xl font-semibold mb-4">
                        Prioridades de corrección
                    </h3>

                    <ol className="space-y-3">

                        {topRules.map(([rule, count]: [string, number], index) => (

                            <li key={rule}>

                                <strong>
                                    {index + 1}. {ruleNames[rule] ?? rule}
                                </strong>

                                {" — "}

                                {count} incidencias

                            </li>

                        ))}

                    </ol>

                </section>

                {/* Recomendaciones */}

                <section className="border rounded-lg p-5 mb-8">

                    <h3 className="text-xl font-semibold mb-4">
                        Recomendaciones principales
                    </h3>

                    <ul className="space-y-4">

                        {topRules.map(([rule]) => (

                            <li key={rule}>

                                <strong>
                                    {ruleNames[rule] ?? rule}
                                </strong>

                                <p className="text-muted-foreground mt-1">
                                    {ruleRecommendations[rule]}
                                </p>

                            </li>

                        ))}

                    </ul>

                </section>

                {/* Detalle técnico */}

                <section className="mt-8">

                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full flex justify-between items-center rounded-lg border border-border px-4 py-3 hover:bg-muted transition-colors"
                        aria-expanded={showDetails}
                    >
                        <span className="font-semibold">
                            {showDetails
                                ? "Ocultar detalle técnico"
                                : `Mostrar detalle técnico (${report.totalIssues} incidencias)`}
                        </span>

                        <span className="text-xl">
                            {showDetails ? "▲" : "▼"}
                        </span>
                    </button>

                    {showDetails && (

                        <div className="space-y-4 mt-6">

                            {report.issues.map((issue: AIReportIssue, index: number) => (

                                <div
                                    key={index}
                                    className="border rounded-lg p-4"
                                >

                                    <h4 className="font-semibold">
                                        {ruleNames[issue.ruleId] ?? issue.ruleId}
                                    </h4>

                                    <p className="text-sm text-muted-foreground mt-2">
                                        {issue.description}
                                    </p>

                                    <p className="mt-3">
                                        <strong>Recomendación:</strong>{" "}
                                        {issue.recommendation}
                                    </p>

                                </div>

                            ))}

                        </div>


                    )}
                </section>
            </div>
        </div>

    );
}





