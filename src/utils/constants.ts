export const CAMPAIGN_STATUS = {
  ACTIVE: 'active' as const,
  PAUSED: 'paused' as const,
  COMPLETED: 'completed' as const,
  DRAFT: 'draft' as const,
} as const;

export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-300',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
  draft: 'bg-gray-100 text-gray-800 border-gray-300',
} as const;

export const STATUS_LABELS = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  draft: 'Draft',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const SIMULATION = {
  MIN_DELAY: 300,
  MAX_DELAY: 1000,
  FAILURE_PROBABILITY: 0.05, // 5% chance of failure
  POLL_INTERVAL: 2000, // 2 seconds
} as const;

export const CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#6b7280',
} as const;
