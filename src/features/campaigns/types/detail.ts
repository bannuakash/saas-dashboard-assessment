export interface CampaignDetail {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  description?: string;
  budget: number;
  startDate: string;
  endDate: string;
  performanceScore: number;
  createdAt: string;
  updatedAt: string;
  assets: Asset[];
  metrics: PerformanceMetrics;
  objective?: string;
  targetAudience?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
  url?: string;
}

export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  roi: number;
  dailyData: DailyMetric[];
  hourlyData: HourlyMetric[];
}

export interface DailyMetric {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface HourlyMetric {
  hour: number;
  impressions: number;
  clicks: number;
}

export interface FormValidationErrors {
  name?: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  objective?: string;
  targetAudience?: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}
