type StatisticsCardsProps = {
    totalAudits: number;
    totalViolations: number;
    totalPages: number;
    averageViolations: string;
};

export default function StatisticsCards({
    totalAudits,
    totalViolations,
    totalPages,
    averageViolations,
}: StatisticsCardsProps) {

    const cards = [
        {
            title: "Auditorías realizadas",
            value: totalAudits,
        },
        {
            title: "Violaciones detectadas",
            value: totalViolations,
        },
        {
            title: "Páginas auditadas",
            value: totalPages,
        },
        {
            title: "Promedio por auditoría",
            value: averageViolations,
        },
    ];

    return (
        <section
            aria-label="Resumen estadístico de auditorías"
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
            {cards.map((card) => (
                <article
                    key={card.title}
                    className="bg-card border rounded-xl p-6 shadow"
                >
                    <h3 className="text-sm text-muted-foreground">
                        {card.title}
                    </h3>

                    <p className="text-3xl font-bold mt-2">
                        {card.value}
                    </p>
                </article>
            ))}
        </section>
    );
}