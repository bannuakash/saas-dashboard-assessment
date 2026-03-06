import type { Campaign, CampaignDetail } from '../features/campaigns/types';
import { generateId } from '../utils/helpers';

const baseDate = new Date('2024-01-01');

export const MOCK_CAMPAIGNS: Campaign[] = Array.from({ length: 47 }, (_, i) => {
  const id = generateId();
  const startDate = new Date(baseDate);
  startDate.setDate(startDate.getDate() + i * 3);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  const statuses: Array<'active' | 'paused' | 'completed' | 'draft'> = ['active', 'paused', 'completed', 'draft'];
  const status = statuses[i % statuses.length];

  return {
    id,
    name: `Campaign ${i + 1}`,
    status,
    budget: Math.floor(Math.random() * 50000) + 5000,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    performanceScore: Math.floor(Math.random() * 100),
    createdAt: new Date(baseDate.getTime() + i * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const getCampaignDetail = (id: string): CampaignDetail => {
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === id);
  if (!campaign) {
    throw new Error(`Campaign ${id} not found`);
  }

  const impressions = Math.floor(Math.random() * 100000) + 10000;
  const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.05));
  const conversions = Math.floor(clicks * (0.01 + Math.random() * 0.1));
  const ctr = (clicks / impressions) * 100;
  const conversionRate = (conversions / clicks) * 100;
  const roi = (conversions * 50 / campaign.budget) * 100;

  // Generate daily metrics for the last 30 days
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      impressions: Math.floor(Math.random() * (impressions / 30)) + 300,
      clicks: Math.floor(Math.random() * (clicks / 30)) + 10,
      conversions: Math.floor(Math.random() * (conversions / 30)) + 1,
    };
  });

  // Generate hourly metrics for today
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    impressions: Math.floor(Math.random() * 5000) + 500,
    clicks: Math.floor(Math.random() * 200) + 20,
  }));

  // Generate sample assets
  const assets = [
    {
      id: generateId(),
      name: 'Campaign Banner 1920x1080.png',
      type: 'image' as const,
      size: Math.random() * 5 + 1,
      uploadedAt: new Date(Date.now() - 86400000).toISOString(),
      url: 'https://via.placeholder.com/1920x1080',
    },
    {
      id: generateId(),
      name: 'Campaign Video 1080p.mp4',
      type: 'video' as const,
      size: Math.random() * 500 + 100,
      uploadedAt: new Date(Date.now() - 172800000).toISOString(),
      url: 'https://via.placeholder.com/video.mp4',
    },
    {
      id: generateId(),
      name: 'Campaign Strategy.pdf',
      type: 'document' as const,
      size: Math.random() * 10 + 2,
      uploadedAt: new Date(Date.now() - 259200000).toISOString(),
      url: 'https://via.placeholder.com/document.pdf',
    },
  ];

  return {
    ...campaign,
    description: 'This is a sample campaign description for testing purposes.',
    objective: 'Increase brand awareness and drive qualified leads through targeted advertising.',
    targetAudience: 'Tech-savvy professionals aged 25-45 interested in B2B SaaS solutions',
    assets,
    metrics: {
      impressions,
      clicks,
      conversions,
      ctr,
      conversionRate,
      roi,
      dailyData,
      hourlyData,
    },
  };
};

export const MOCK_JOBS = [
  {
    id: 'job-001',
    type: 'campaign_export' as const,
    status: 'completed' as const,
    progress: 100,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    result: { fileUrl: '/reports/campaign-export-001.csv', rowCount: 47 },
  },
  {
    id: 'job-002',
    type: 'campaign_report' as const,
    status: 'completed' as const,
    progress: 100,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    result: { fileUrl: '/reports/campaign-report-002.pdf', pageCount: 15 },
  },
];
