export interface AIReportIssue {
    id: string;
    ruleId: string;
    impact: string;
    category: string;
    description: string;
    recommendation: string;
    selector: string;
    codeSnippet: string;
    url: string;
}

export interface AIReport {
    score: number;
    totalIssues: number;
    timestamp: string;
    issues: AIReportIssue[];
}