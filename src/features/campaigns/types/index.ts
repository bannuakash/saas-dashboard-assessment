export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  startDate: string;
  endDate: string;
  performanceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
  url?: string;
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

export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  roi: number;
  dailyData: DailyMetric[];
  hourlyData: HourlyMetric[];
  spent?: number;
  cpc?: number;
  cpa?: number;
  roas?: number;
}

export interface CampaignDetail extends Campaign {
  description?: string;
  objective?: string;
  targetAudience?: string;
  assets: Asset[];
  metrics: PerformanceMetrics;
}

export interface CampaignUpdatePayload {
  name?: string;
  status?: CampaignStatus;
  budget?: number;
  description?: string;
  targetAudience?: string;
  objective?: string;
}

export interface FilterOptions {
  status: CampaignStatus[];
  minBudget: number;
  maxBudget: number;
  search: string;
  sortBy: 'name' | 'budget' | 'performance' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface CampaignListResponse {
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
