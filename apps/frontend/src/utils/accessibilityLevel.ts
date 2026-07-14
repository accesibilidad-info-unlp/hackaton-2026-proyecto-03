export type AccessibilityLevel = {
    label: string;
    color: string;
};

export function getAccessibilityLevel(
    totalViolations: number,
    totalPages: number
): AccessibilityLevel {

    const errorsPerPage =
        totalPages > 0
            ? totalViolations / totalPages
            : totalViolations;

    if (errorsPerPage <= 10) {
        return {
            label: "Excelente",
            color: "bg-green-600",
        };
    }

    if (errorsPerPage <= 25) {
        return {
            label: "Bueno",
            color: "bg-emerald-600",
        };
    }

    if (errorsPerPage <= 50) {
        return {
            label: "Regular",
            color: "bg-yellow-500",
        };
    }

    if (errorsPerPage <= 80) {
        return {
            label: "Deficiente",
            color: "bg-orange-500",
        };
    }

    return {
        label: "Crítico",
        color: "bg-red-600",
    };

}