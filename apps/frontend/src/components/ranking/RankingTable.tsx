type RankingRow = {
    position: React.ReactNode;
    label: React.ReactNode;
    level?: {
        label: string;
        color: string;
    } | null;
    value: React.ReactNode;
};

type RankingTableProps = {
    title: string;
    description: string;
    labelHeader: string;
    extraHeader?: string;
    valueHeader: string;
    rows: RankingRow[];
};

export default function RankingTable({
    title,
    description,
    labelHeader,
    extraHeader,
    valueHeader,
    rows,
}: RankingTableProps) {
    return (
        <section className="mt-12">

            <h2 className="text-2xl font-semibold mb-2">
                {title}
            </h2>

            <p className="text-muted-foreground mb-6">
                {description}
            </p>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow">

                <div className="overflow-x-auto">

                    <table className="w-full">
                        <caption className="sr-only">
                            {title}. {description}
                        </caption>

                        <thead className="bg-muted">

                            <tr>

                                <th scope="col"
                                    className="text-left p-4">
                                    Posición
                                </th>

                                <th scope="col"
                                    className="text-left p-4">
                                    {labelHeader}
                                </th>

                                {extraHeader && (
                                    <th scope="col"
                                        className="text-center p-4">
                                        {extraHeader}
                                    </th>
                                )}

                                <th scope="col"
                                    className="text-right p-4">
                                    {valueHeader}
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {rows.map((row, index) => (

                                <tr
                                    key={index}
                                    className="border-t border-border hover:bg-accent transition-colors"
                                >

                                    <td className="p-4 font-semibold">
                                        {row.position}
                                    </td>

                                    <td className="p-4">
                                        {row.label}
                                    </td>

                                    {extraHeader && (
                                        <td className="p-4 text-center">
                                            {row.level && (
                                                <span
                                                    className={`${row.level.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                                                >
                                                    {row.level.label}
                                                </span>
                                            )}
                                        </td>
                                    )}

                                    <td className="p-4 text-right font-semibold">
                                        {row.value}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            </div>

        </section>
    );
}