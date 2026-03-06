import { create } from 'zustand';
import type { Campaign, FilterOptions } from '../features/campaigns/types';
import type { Job } from '../features/jobs/types';
import { campaignService } from '../features/campaigns/services/campaignService';
import { jobService } from '../features/jobs/jobService';
import { PAGINATION } from '../utils/constants';

interface CampaignState {
  // Data
  campaigns: Campaign[];
  selectedCampaigns: Set<string>;
  totalCampaigns: number;
  
  // Pagination
  page: number;
  limit: number;
  totalPages: number;
  
  // Filters
  filters: FilterOptions;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Jobs
  jobs: Job[];
  activeJobId: string | null;
  
  // Actions
  fetchCampaigns: () => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  updateCampaignStatus: (id: string, status: Campaign['status']) => Promise<void>;
  toggleCampaignSelection: (id: string) => void;
  selectAllCampaigns: () => void;
  deselectAllCampaigns: () => void;
  bulkUpdateCampaigns: (ids: string[], payload: Record<string, unknown>) => Promise<void>;
  createJob: (type: Job['type']) => Promise<void>;
  getJob: (id: string) => Promise<Job>;
  pollJobStatus: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  setActiveJob: (jobId: string | null) => void;
}

const DEFAULT_FILTERS: FilterOptions = {
  status: [],
  minBudget: 0,
  maxBudget: 100000,
  search: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  selectedCampaigns: new Set(),
  totalCampaigns: 0,
  page: 1,
  limit: PAGINATION.DEFAULT_LIMIT,
  totalPages: 0,
  filters: DEFAULT_FILTERS,
  isLoading: false,
  error: null,
  jobs: [],
  activeJobId: null,

  fetchCampaigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit, filters } = get();
      const response = await campaignService.fetchCampaigns(filters, { page, limit });
      set({
        campaigns: response.data,
        totalCampaigns: response.total,
        totalPages: response.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch campaigns',
        isLoading: false,
      });
    }
  },

  setPage: (page: number) => {
    set({ page });
    // Trigger fetch
    const state = get();
    state.fetchCampaigns();
  },

  setFilters: (filters: Partial<FilterOptions>) => {
    const currentFilters = get().filters;
    set({ filters: { ...currentFilters, ...filters }, page: 1 });
    // Trigger fetch
    const state = get();
    state.fetchCampaigns();
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS, page: 1 });
    const state = get();
    state.fetchCampaigns();
  },

  updateCampaignStatus: async (id: string, status: Campaign['status']) => {
    set({ isLoading: true, error: null });
    try {
      await campaignService.updateCampaignStatus(id, status);
      // Optimistic update
      set(state => ({
        campaigns: state.campaigns.map(c =>
          c.id === id ? { ...c, status } : c
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update campaign',
        isLoading: false,
      });
    }
  },

  toggleCampaignSelection: (id: string) => {
    set(state => {
      const newSelection = new Set(state.selectedCampaigns);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { selectedCampaigns: newSelection };
    });
  },

  selectAllCampaigns: () => {
    set(state => ({
      selectedCampaigns: new Set(state.campaigns.map(c => c.id)),
    }));
  },

  deselectAllCampaigns: () => {
    set({ selectedCampaigns: new Set() });
  },

  bulkUpdateCampaigns: async (ids: string[], payload: Record<string, unknown>) => {
    set({ isLoading: true, error: null });
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await campaignService.bulkUpdateCampaigns(ids, payload as any);
      // Refresh campaigns
      const state = get();
      state.fetchCampaigns();
      set({ selectedCampaigns: new Set() }); // Clear selection
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update campaigns',
        isLoading: false,
      });
    }
  },

  createJob: async (type: Job['type']) => {
    set({ isLoading: true, error: null });
    try {
      const job = await jobService.createJob(type);
      set(state => ({
        jobs: [...state.jobs, job],
        activeJobId: job.id,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create job',
        isLoading: false,
      });
    }
  },

  getJob: async (id: string) => {
    try {
      return await jobService.getJob(id);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch job',
      });
      throw error;
    }
  },

  pollJobStatus: async (id: string) => {
    try {
      const job = await jobService.pollJobStatus(id);
      set(state => ({
        jobs: state.jobs.map(j => (j.id === id ? job : j)),
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to poll job status',
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  setActiveJob: (jobId: string | null) => {
    set({ activeJobId: jobId });
  },
}));
