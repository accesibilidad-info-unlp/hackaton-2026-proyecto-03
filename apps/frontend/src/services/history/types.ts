export interface HistoryItem {
  fecha: string;
  url: string;
  summary: any;
  byRule: Record<string, number>;
  byPage: Record<string, number>;
}