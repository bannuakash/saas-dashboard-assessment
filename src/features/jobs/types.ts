export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  type: 'campaign_export' | 'campaign_report' | 'bulk_update' | 'data_sync';
  status: JobStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  result?: Record<string, unknown>;
}

export interface JobConfig {
  campaignIds?: string[];
  reportType?: 'performance' | 'detailed' | 'summary';
  format?: 'csv' | 'json' | 'pdf';
}
