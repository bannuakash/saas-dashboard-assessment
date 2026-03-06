import React, { useMemo } from 'react';
import type { FilterOptions, CampaignStatus } from '../types';
import { X } from 'lucide-react';
import Input from '../../../components/ui/Input';
import { CAMPAIGN_STATUS, STATUS_LABELS } from '../../../utils/constants';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.length > 0 ||
      filters.status.length > 0 ||
      filters.minBudget > 0 ||
      filters.maxBudget < 100000
    );
  }, [filters]);

  const handleStatusToggle = (status: CampaignStatus) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s: CampaignStatus) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ status: newStatuses });
  };

  const statusOptions: CampaignStatus[] = [
    CAMPAIGN_STATUS.DRAFT,
    CAMPAIGN_STATUS.ACTIVE,
    CAMPAIGN_STATUS.PAUSED,
    CAMPAIGN_STATUS.COMPLETED,
  ];

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-semibold text-gray-900'>Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className='text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1'
          >
            <X className='w-3 h-3' />
            Clear
          </button>
        )}
      </div>

      <div className='space-y-4'>
        {/* Search */}
        <div>
          <label className='text-xs font-medium text-gray-700 block mb-2'>
            Search by name
          </label>
          <Input
            type='text'
            placeholder='Campaign name...'
            value={filters.search}
            onChange={e =>
              onFiltersChange({ search: e.target.value })
            }
            className='text-sm'
          />
        </div>

        {/* Status */}
        <div>
          <label className='text-xs font-medium text-gray-700 block mb-2'>
            Status
          </label>
          <div className='space-y-2'>
            {statusOptions.map(status => (
              <label key={status} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={filters.status.includes(status)}
                  onChange={() => handleStatusToggle(status)}
                  className='w-4 h-4 rounded'
                />
                <span className='text-sm text-gray-700'>
                  {STATUS_LABELS[status as CampaignStatus]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className='text-xs font-medium text-gray-700 block mb-2'>
            Budget Range
          </label>
          <div className='space-y-2'>
            <Input
              type='number'
              placeholder='Min budget'
              value={filters.minBudget}
              onChange={e =>
                onFiltersChange({ minBudget: Number(e.target.value) })
              }
              className='text-sm'
            />
            <Input
              type='number'
              placeholder='Max budget'
              value={filters.maxBudget}
              onChange={e =>
                onFiltersChange({ maxBudget: Number(e.target.value) })
              }
              className='text-sm'
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className='text-xs font-medium text-gray-700 block mb-2'>
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={e =>
              onFiltersChange({
                sortBy: e.target.value as FilterOptions['sortBy'],
              })
            }
            className='w-full text-sm rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='date'>Created Date</option>
            <option value='name'>Name</option>
            <option value='budget'>Budget</option>
            <option value='performance'>Performance</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className='text-xs font-medium text-gray-700 block mb-2'>
            Order
          </label>
          <select
            value={filters.sortOrder}
            onChange={e =>
              onFiltersChange({
                sortOrder: e.target.value as 'asc' | 'desc',
              })
            }
            className='w-full text-sm rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
