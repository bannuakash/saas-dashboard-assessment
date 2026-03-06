import React, { useCallback, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import CampaignTable from './CampaignTable';
import FilterPanel from './FilterPanel';
import Pagination from './Pagination';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import { Alert, Spinner } from '../../../components/ui/Feedback';
import { useCampaigns } from '../hooks/useCampaigns';
import type { Campaign } from '../types';

const CampaignList: React.FC<{ onCampaignSelect?: (campaign: Campaign) => void }> = ({
  onCampaignSelect,
}) => {
  const {
    campaigns,
    isLoading,
    error,
    totalCampaigns,
    page,
    limit,
    totalPages,
    filters,
    selectedCampaigns,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleResetFilters,
    handleStatusChange,
    handleSelectAll,
    handleToggleSelect,
    handleBulkUpdate,
    clearError,
  } = useCampaigns();

  const [searchInput, setSearchInput] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<Campaign['status']>('active');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      handleSearch(value);
    },
    [handleSearch]
  );

  const handleBulkStatusUpdate = useCallback(async () => {
    setIsBulkUpdating(true);
    try {
      await handleBulkUpdate({ status: bulkStatus });
      setShowBulkModal(false);
    } finally {
      setIsBulkUpdating(false);
    }
  }, [handleBulkUpdate, bulkStatus]);

  const handleBulkDelete = useCallback(async () => {
    if (!window.confirm(`Delete ${selectedCampaigns.size} campaign(s)?`)) return;
    // In a real app, you would call a delete endpoint
    // For now, just deselect
    setShowBulkModal(false);
  }, [selectedCampaigns.size]);

  return (
    <div className='space-y-6'>
      {/* Error Alert */}
      {error && (
        <Alert variant='error' title='Error' onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Search and Actions */}
      <Card>
        <div className='space-y-4'>
          <div className='flex flex-col md:flex-row gap-4 items-end'>
            <div className='flex-1'>
              <Input
                type='text'
                placeholder='Search campaigns...'
                value={searchInput}
                onChange={e => handleSearchChange(e.target.value)}
                label='Campaign Name'
              />
            </div>
            {selectedCampaigns.size > 0 && (
              <div className='flex gap-2'>
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={() => setShowBulkModal(true)}
                >
                  <Upload className='w-4 h-4' />
                  Update ({selectedCampaigns.size})
                </Button>
                <Button
                  variant='danger'
                  size='sm'
                  onClick={handleBulkDelete}
                >
                  <Trash2 className='w-4 h-4' />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Filters and Table */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Filter Panel */}
        <div>
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Table */}
        <div className='lg:col-span-3'>
          <Card>
            {isLoading ? (
              <div className='flex items-center justify-center h-64 gap-2'>
                <Spinner size='md' />
                <span className='text-gray-500'>Loading campaigns...</span>
              </div>
            ) : (
              <>
                <CampaignTable
                  campaigns={campaigns}
                  selectedIds={selectedCampaigns}
                  onSelectAll={handleSelectAll}
                  onToggleSelect={handleToggleSelect}
                  onStatusChange={handleStatusChange}
                  onRowClick={onCampaignSelect || (() => {})}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSort={(field) =>
                    handleFilterChange({
                      sortBy: field,
                      sortOrder:
                        filters.sortBy === field && filters.sortOrder === 'asc'
                          ? 'desc'
                          : 'asc',
                    })
                  }
                />
              </>
            )}
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-4'>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalCampaigns}
                itemsPerPage={limit}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bulk Update Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title='Bulk Update Campaigns'
        size='md'
        footer={
          <>
            <Button
              variant='secondary'
              onClick={() => setShowBulkModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleBulkStatusUpdate}
              isLoading={isBulkUpdating}
            >
              Update
            </Button>
          </>
        }
      >
        <div className='space-y-4'>
          <p className='text-sm text-gray-600'>
            Update status for {selectedCampaigns.size} selected campaign(s)
          </p>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              New Status
            </label>
            <select
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value as Campaign['status'])}
              className='w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='draft'>Draft</option>
              <option value='active'>Active</option>
              <option value='paused'>Paused</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignList;
