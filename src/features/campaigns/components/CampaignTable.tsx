import React, { useCallback, useMemo } from 'react';
import type { Campaign, CampaignStatus } from '../types';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { STATUS_LABELS } from '../../../utils/constants';

interface CampaignTableProps {
  campaigns: Campaign[];
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onRowClick: (campaign: Campaign) => void;
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  selectedIds,
  onSelectAll,
  onToggleSelect,
  onStatusChange,
  onRowClick,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const isAllSelected = useMemo(
    () => campaigns.length > 0 && selectedIds.size === campaigns.length,
    [campaigns.length, selectedIds.size]
  );

  const isIndeterminate = useMemo(
    () => selectedIds.size > 0 && selectedIds.size < campaigns.length,
    [campaigns.length, selectedIds.size]
  );

  const handleSelectAll = useCallback(() => {
    onSelectAll();
  }, [onSelectAll]);

  const getStatusBadgeVariant = (status: CampaignStatus): 'success' | 'warning' | 'info' | 'default' => {
    const variants: Record<CampaignStatus, 'success' | 'warning' | 'info' | 'default'> = {
      active: 'success',
      paused: 'warning',
      completed: 'info',
      draft: 'default',
    };
    return variants[status];
  };

  const SortIcon: React.FC<{ field: string }> = ({ field }) => {
    if (sortBy !== field) {
      return <ArrowUpDown className='w-4 h-4 text-gray-400' />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className='w-4 h-4' />
    ) : (
      <ChevronDown className='w-4 h-4' />
    );
  };

  const SortableHeader: React.FC<{ field: string; label: string }> = ({ field, label }) => (
    <th
      onClick={() => onSort?.(field)}
      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50'
    >
      <div className='flex items-center gap-2'>
        {label}
        {onSort && <SortIcon field={field} />}
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>Loading campaigns...</div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <p className='text-gray-500 mb-2'>No campaigns found</p>
          <p className='text-sm text-gray-400'>Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead className='bg-gray-50 border-b border-gray-200'>
          <tr>
            <th className='px-6 py-3'>
              <input
                type='checkbox'
                checked={isAllSelected}
                onChange={handleSelectAll}
                className='w-4 h-4 rounded cursor-pointer'
                //  eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={(el: any) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
              />
            </th>
            <SortableHeader field='name' label='Campaign' />
            <SortableHeader field='status' label='Status' />
            <SortableHeader field='budget' label='Budget' />
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Duration
            </th>
            <SortableHeader field='performance' label='Performance' />
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {campaigns.map(campaign => (
            <tr
              key={campaign.id}
              onClick={() => onRowClick(campaign)}
              className='hover:bg-gray-50 cursor-pointer transition-colors'
            >
              <td
                className='px-6 py-4'
                onClick={e => e.stopPropagation()}
              >
                <input
                  type='checkbox'
                  checked={selectedIds.has(campaign.id)}
                  onChange={() => onToggleSelect(campaign.id)}
                  className='w-4 h-4 rounded cursor-pointer'
                />
              </td>
              <td className='px-6 py-4'>
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {campaign.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    ID: {campaign.id.slice(0, 8)}
                  </p>
                </div>
              </td>
              <td className='px-6 py-4'>
                <Badge variant={getStatusBadgeVariant(campaign.status)}>
                  {STATUS_LABELS[campaign.status as CampaignStatus]}
                </Badge>
              </td>
              <td className='px-6 py-4 text-sm text-gray-900'>
                {formatCurrency(campaign.budget)}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
              </td>
              <td className='px-6 py-4'>
                <div className='flex items-center gap-1'>
                  <div className='w-16 h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-green-500 transition-all duration-300'
                      style={{
                        width: `${Math.min(campaign.performanceScore, 100)}%`,
                      }}
                    />
                  </div>
                  <span className='text-sm text-gray-600'>
                    {campaign.performanceScore}%
                  </span>
                </div>
              </td>
              <td
                className='px-6 py-4 text-right'
                onClick={e => e.stopPropagation()}
              >
                <select
                  value={campaign.status}
                  onChange={e => onStatusChange(campaign.id, e.target.value as CampaignStatus)}
                  className='text-sm rounded border border-gray-300 px-2 py-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='draft'>Draft</option>
                  <option value='active'>Active</option>
                  <option value='paused'>Paused</option>
                  <option value='completed'>Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
