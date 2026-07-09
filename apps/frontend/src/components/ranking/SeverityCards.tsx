type SeverityCardsProps = {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
};

export default function SeverityCards({
    critical,
    serious,
    moderate,
    minor,
}: SeverityCardsProps) {

    const cards = [
        {
            title: "Críticos",
            value: critical,
            icon: "🔴",
        },
        {
            title: "Serios",
            value: serious,
            icon: "🟠",
        },
        {
            title: "Moderados",
            value: moderate,
            icon: "🟡",
        },
        {
            title: "Menores",
            value: minor,
            icon: "🔵",
        },
    ];

    return (
        <section
            aria-labelledby="severity-title"
            className="mt-10"
        >
            <h2
                id="severity-title"
                className="text-2xl font-semibold mb-2"
            >
                Distribución por severidad
            </h2>

            <p className="text-muted-foreground mb-6">
                Cantidad total de incidencias agrupadas según el nivel de impacto
                definido por las reglas de accesibilidad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {cards.map((card) => (

                    <article
                        key={card.title}
                        className="bg-card border rounded-xl p-6 shadow"
                    >
                        <div className="text-3xl mb-2">
                            {card.icon}
                        </div>

                        <h3 className="text-sm text-muted-foreground">
                            {card.title}
                        </h3>

                        <p className="text-3xl font-bold mt-2">
                            {card.value}
                        </p>

                    </article>

                ))}

            </div>

        </section>
    );
}