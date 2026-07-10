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
            color: "bg-red-500",
        },
        {
            title: "Serios",
            value: serious,
            color: "bg-orange-500",
        },
        {
            title: "Moderados",
            value: moderate,
            color: "bg-amber-400",
        },
        {
            title: "Menores",
            value: minor,
            color: "bg-blue-500",
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
                        aria-labelledby={`severity-${card.title}`}
                        className="
                        bg-card
                        border
                        rounded-xl
                        p-6
                        shadow
                        transition-colors
                        hover:bg-muted                        
                        "
                    >
                        <div
                            className={`w-5 h-5 rounded-full ${card.color} mb-3`}
                            aria-hidden="true"
                        />
                        <h3
                            id={`severity-${card.title}`}
                            className="text-sm text-muted-foreground"
                        >
                            {card.title}
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                            {card.value}
                            <span className="sr-only">
                                {" "}incidencias
                            </span>
                        </p>

                    </article>

                ))}

            </div>

        </section >
    );
}