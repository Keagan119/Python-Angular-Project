export interface Insight {
  id: string;
  title: string;
  summary: string;
  severity?: 'info' | 'warning' | 'critical';
  relatedTransactionIds?: string[];
}
