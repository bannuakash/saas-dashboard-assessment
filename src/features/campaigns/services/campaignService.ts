import type {
  Campaign,
  CampaignDetail,
  CampaignListResponse,
  CampaignStatus,
  CampaignUpdatePayload,
  FilterOptions,
  PaginationParams,
} from '../types';
import { MOCK_CAMPAIGNS, getCampaignDetail } from '../../../mock-data';
import { simulateDelay, shouldFail, generateId } from '../../../utils/helpers';

/**
 * Campaign Service Layer
 * Simulates backend API calls with delays and random failures
 */

let campaigns = [...MOCK_CAMPAIGNS];

export const campaignService = {
  /**
   * Fetch campaigns with filtering, sorting, and pagination
   */
  async fetchCampaigns(
    filters: Partial<FilterOptions>,
    pagination: PaginationParams
  ): Promise<CampaignListResponse> {
    await simulateDelay();

    if (shouldFail()) {
      throw new Error('Failed to fetch campaigns');
    }

    let filtered = campaigns;

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(c => filters.status!.includes(c.status));
    }

    // Filter by budget range
    if (filters.minBudget !== undefined) {
      filtered = filtered.filter(c => c.budget >= filters.minBudget!);
    }
    if (filters.maxBudget !== undefined) {
      filtered = filtered.filter(c => c.budget <= filters.maxBudget!);
    }

    // Search by name
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(search));
    }

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aVal: string | number | undefined = a[filters.sortBy as keyof Campaign];
        let bVal: string | number | undefined = b[filters.sortBy as keyof Campaign];

        if (aVal === undefined || bVal === undefined) return 0;

        let aCompare: string | number = aVal;
        let bCompare: string | number = bVal;

        if (typeof aCompare === 'string') {
          aCompare = aCompare.toLowerCase();
        }
        if (typeof bCompare === 'string') {
          bCompare = bCompare.toLowerCase();
        }

        if (aCompare < bCompare) return filters.sortOrder === 'asc' ? -1 : 1;
        if (aCompare > bCompare) return filters.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.limit);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    const data = filtered.slice(start, end);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
    };
  },

  /**
   * Fetch single campaign detail
   */
  async fetchCampaignDetail(id: string): Promise<CampaignDetail> {
    await simulateDelay();

    if (shouldFail()) {
      throw new Error('Failed to fetch campaign details');
    }

    return getCampaignDetail(id);
  },

  /**
   * Update campaign status
   */
  async updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    await simulateDelay();

    if (shouldFail()) {
      throw new Error('Failed to update campaign status');
    }

    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Campaign not found');
    }

    campaigns[index] = {
      ...campaigns[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    return campaigns[index];
  },

  /**
   * Update campaign
   */
  async updateCampaign(id: string, payload: CampaignUpdatePayload): Promise<Campaign> {
    await simulateDelay();

    if (shouldFail()) {
      throw new Error('Failed to update campaign');
    }

    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Campaign not found');
    }

    campaigns[index] = {
      ...campaigns[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return campaigns[index];
  },

  /**
   * Delete campaign
   */
  async deleteCampaign(id: string): Promise<void> {
    await simulateDelay();

    if (shouldFail()) {
      throw new Error('Failed to delete campaign');
    }

    campaigns = campaigns.filter(c => c.id !== id);
  },

  /**
   * Bulk update campaigns
   */
  async bulkUpdateCampaigns(ids: string[], payload: CampaignUpdatePayload): Promise<Campaign[]> {
    await simulateDelay(500, 1500);

    if (shouldFail()) {
      throw new Error('Failed to bulk update campaigns');
    }

    const updated = campaigns.map(campaign =>
      ids.includes(campaign.id)
        ? { ...campaign, ...payload, updatedAt: new Date().toISOString() }
        : campaign
    );

    campaigns = updated;
    return campaigns.filter(c => ids.includes(c.id));
  },

  /**
   * Create campaign
   */
  async createCampaign(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    await simulateDelay();

    if (shouldFail()) {
      throw new Error('Failed to create campaign');
    }

    const newCampaign: Campaign = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    campaigns.push(newCampaign);
    return newCampaign;
  },

  /**
   * Export campaigns
   */
  async exportCampaigns(_ids?: string[]): Promise<{ fileUrl: string }> {
    await simulateDelay(1000, 2000);

    if (shouldFail()) {
      throw new Error('Failed to export campaigns');
    }

    const filePath = `/exports/campaigns-${Date.now()}.csv`;
    return { fileUrl: filePath };
  },
};
