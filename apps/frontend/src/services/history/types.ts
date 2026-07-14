export interface HistoryItem {
  fecha: string;
  url: string;
  level: string;
  summary: any;
  byRule: Record<string, number>;
  byPage: Record<string, number>;
  aiReport: any;
}