import React from 'react';
import type { CampaignDetail } from '../types';
import Card from '../../../components/ui/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface CampaignDetailPerformanceProps {
  campaign: CampaignDetail | null;
}

const CampaignDetailPerformance: React.FC<CampaignDetailPerformanceProps> = ({ campaign }) => {
  if (!campaign) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Loading performance data...</p>
      </div>
    );
  }

  const metrics = campaign.metrics;

  const StatCard = ({
    label,
    value,
    unit,
    icon,
  }: {
    label: string;
    value: number | string;
    unit?: string;
    icon?: React.ReactNode;
  }) => (
    <div className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-600'>{label}</p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className='text-sm text-gray-600 ml-1'>{unit}</span>}
          </p>
        </div>
        {icon && <div className='text-gray-400'>{icon}</div>}
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          label='Impressions'
          value={metrics.impressions}
          icon={<TrendingUp className='w-6 h-6' />}
        />
        <StatCard
          label='Clicks'
          value={metrics.clicks}
          icon={<TrendingUp className='w-6 h-6' />}
        />
        <StatCard
          label='Conversions'
          value={metrics.conversions}
          icon={<TrendingUp className='w-6 h-6' />}
        />
        <StatCard
          label='ROI'
          value={metrics.roi.toFixed(1)}
          unit='%'
          icon={<TrendingUp className='w-6 h-6' />}
        />
      </div>

      {/* Performance Rates */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          label='Click-Through Rate (CTR)'
          value={metrics.ctr.toFixed(2)}
          unit='%'
        />
        <StatCard
          label='Conversion Rate'
          value={metrics.conversionRate.toFixed(2)}
          unit='%'
        />
        <StatCard
          label='Campaign Performance'
          value={campaign.performanceScore}
          unit='%'
        />
      </div>

      {/* Daily Performance Trend */}
      {metrics.dailyData && metrics.dailyData.length > 0 && (
        <Card header={<h3 className='text-lg font-semibold text-gray-900'>Daily Performance Trend</h3>}>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={metrics.dailyData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                tickFormatter={date => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === 'number') {
                    return value.toLocaleString();
                  }
                  return value;
                }}
                labelFormatter={(label) => {
                  if (typeof label === 'string') {
                    const d = new Date(label);
                    return d.toLocaleDateString();
                  }
                  return label;
                }}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey='impressions'
                stroke='#3b82f6'
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name='Impressions'
              />
              <Line
                type='monotone'
                dataKey='clicks'
                stroke='#10b981'
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
                name='Clicks'
              />
              <Line
                type='monotone'
                dataKey='conversions'
                stroke='#f59e0b'
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
                name='Conversions'
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Hourly Performance Distribution */}
      {metrics.hourlyData && metrics.hourlyData.length > 0 && (
        <Card header={<h3 className='text-lg font-semibold text-gray-900'>Hourly Performance Distribution</h3>}>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={metrics.hourlyData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='hour'
                tickFormatter={hour => `${hour}:00`}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === 'number') {
                    return value.toLocaleString();
                  }
                  return value;
                }}
                labelFormatter={(label) => {
                  if (typeof label === 'number') {
                    return `${label}:00 - ${label + 1}:00`;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar
                dataKey='impressions'
                fill='#3b82f6'
                name='Impressions'
              />
              <Bar
                dataKey='clicks'
                fill='#10b981'
                name='Clicks'
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Performance Insights */}
      <Card header={<h3 className='text-lg font-semibold text-gray-900'>Performance Insights</h3>}>
        <div className='space-y-3'>
          <div className='flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0'>
            <div className='w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0'></div>
            <div>
              <p className='text-sm font-medium text-gray-900'>Strong Engagement</p>
              <p className='text-sm text-gray-600'>Your campaign has good click-through rates compared to industry benchmarks.</p>
            </div>
          </div>

          <div className='flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0'>
            <div className='w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0'></div>
            <div>
              <p className='text-sm font-medium text-gray-900'>High Conversion Rate</p>
              <p className='text-sm text-gray-600'>Your conversion rate of {metrics.conversionRate.toFixed(2)}% indicates effective targeting.</p>
            </div>
          </div>

          <div className='flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0'>
            <div className='w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0'></div>
            <div>
              <p className='text-sm font-medium text-gray-900'>ROI Performance</p>
              <p className='text-sm text-gray-600'>Current ROI is {metrics.roi.toFixed(1)}%. Consider optimizing targeting for better returns.</p>
            </div>
          </div>

          <div className='flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0'>
            <div className='w-2 h-2 bg-purple-600 rounded-full mt-1.5 flex-shrink-0'></div>
            <div>
              <p className='text-sm font-medium text-gray-900'>Peak Hours</p>
              <p className='text-sm text-gray-600'>Most engagement happens between 2 PM - 4 PM. Schedule content accordingly.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CampaignDetailPerformance;
