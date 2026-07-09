type RankingRow = {
    position: React.ReactNode;
    label: React.ReactNode;
    value: React.ReactNode;
};

type RankingTableProps = {
    title: string;
    description: string;
    labelHeader: string;
    valueHeader: string;
    rows: RankingRow[];
};

export default function RankingTable({
    title,
    description,
    labelHeader,
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

                <table className="w-full">

                    <thead className="bg-muted">

                        <tr>

                            <th className="text-left p-4">
                                Posición
                            </th>

                            <th className="text-left p-4">
                                {labelHeader}
                            </th>

                            <th className="text-right p-4">
                                {valueHeader}
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {rows.map((row, index) => (

                            <tr
                                key={index}
                                className="border-t border-border hover:bg-muted/40 transition-colors"
                            >

                                <td className="p-4 font-semibold">
                                    {row.position}
                                </td>

                                <td className="p-4">
                                    {row.label}
                                </td>

                                <td className="p-4 text-right font-semibold">
                                    {row.value}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </section>
    );
}