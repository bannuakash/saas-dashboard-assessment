import { useEffect, useCallback } from 'react';
import { useCampaignStore } from '../../../store/campaignStore';
import { debounce } from '../../../utils/helpers';

/**
 * Custom hook for campaign management
 */
export const useCampaigns = () => {
  const store = useCampaignStore();

  useEffect(() => {
    // Fetch campaigns on mount
    store.fetchCampaigns();
  }, []);

  const debouncedSearch = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debounce((searchTerm: string) => {
      store.setFilters({ search: searchTerm });
    }, 300) as (searchTerm: string) => void,
    [store]
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      debouncedSearch(searchTerm);
    },
    [debouncedSearch]
  );

  const handleFilterChange = useCallback(
    (filters: Record<string, unknown>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store.setFilters(filters as any);
    },
    [store]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      store.setPage(page);
    },
    [store]
  );

  const handleResetFilters = useCallback(() => {
    store.resetFilters();
  }, [store]);

  const handleStatusChange = useCallback(
    (id: string, status: string) => {
      store.updateCampaignStatus(id, status as 'active' | 'paused' | 'completed' | 'draft');
    },
    [store]
  );

  const handleSelectAll = useCallback(() => {
    store.selectAllCampaigns();
  }, [store]);

  const handleToggleSelect = useCallback(
    (id: string) => {
      store.toggleCampaignSelection(id);
    },
    [store]
  );

  const handleBulkUpdate = useCallback(
    async (payload: Record<string, unknown>) => {
      const selectedIds = Array.from(store.selectedCampaigns);
      if (selectedIds.length === 0) return;
      await store.bulkUpdateCampaigns(selectedIds, payload);
    },
    [store]
  );

  return {
    campaigns: store.campaigns,
    isLoading: store.isLoading,
    error: store.error,
    totalCampaigns: store.totalCampaigns,
    page: store.page,
    limit: store.limit,
    totalPages: store.totalPages,
    filters: store.filters,
    selectedCampaigns: store.selectedCampaigns,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleResetFilters,
    handleStatusChange,
    handleSelectAll,
    handleToggleSelect,
    handleBulkUpdate,
    setError: store.setError,
    clearError: store.clearError,
  };
};
