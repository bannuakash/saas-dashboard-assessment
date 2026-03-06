import React from 'react';
import type { CampaignDetail, FormValidationErrors } from '../types';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { STATUS_LABELS } from '../../../utils/constants';

interface CampaignDetailOverviewProps {
  campaign: CampaignDetail | null;
  formData: Partial<CampaignDetail>;
  validationErrors: FormValidationErrors;
  isSaving: boolean;
  showSuccessMessage: boolean;
  onFieldChange: (field: string, value: unknown) => void;
  onSave: () => Promise<void>;
}

const CampaignDetailOverview: React.FC<CampaignDetailOverviewProps> = ({
  campaign,
  formData,
  validationErrors,
  isSaving,
  showSuccessMessage,
  onFieldChange,
  onSave,
}) => {
  return (
    <div className='space-y-6'>
      {showSuccessMessage && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2'>
          <div className='w-2 h-2 bg-green-600 rounded-full'></div>
          <span className='text-sm text-green-700'>Campaign saved successfully</span>
        </div>
      )}

      {/* Campaign Status */}
      <Card header={<h3 className='text-lg font-semibold text-gray-900'>Campaign Status</h3>}>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div>
            <p className='text-sm text-gray-600 mb-1'>Status</p>
            <Badge variant={campaign?.status === 'active' ? 'success' : 'default'}>
              {STATUS_LABELS[campaign?.status as keyof typeof STATUS_LABELS] || campaign?.status}
            </Badge>
          </div>
          <div>
            <p className='text-sm text-gray-600 mb-1'>Created</p>
            <p className='text-sm font-medium text-gray-900'>
              {campaign ? formatDate(new Date(campaign.createdAt)) : '-'}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 mb-1'>Updated</p>
            <p className='text-sm font-medium text-gray-900'>
              {campaign ? formatDate(new Date(campaign.updatedAt)) : '-'}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600 mb-1'>Performance</p>
            <p className='text-sm font-medium text-gray-900'>{campaign?.performanceScore}%</p>
          </div>
        </div>
      </Card>

      {/* Campaign Details Form */}
      <Card header={<h3 className='text-lg font-semibold text-gray-900'>Campaign Details</h3>}>
        <div className='space-y-5'>
          {/* Name */}
          <div>
            <Input
              label='Campaign Name'
              type='text'
              value={formData.name || ''}
              onChange={e => onFieldChange('name', e.target.value)}
              error={validationErrors.name}
              placeholder='Enter campaign name'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Description
            </label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={4}
              value={formData.description || ''}
              onChange={e => onFieldChange('description', e.target.value)}
              placeholder='Describe your campaign...'
            />
          </div>

          {/* Budget */}
          <div>
            <Input
              label='Budget'
              type='number'
              value={formData.budget || ''}
              onChange={e => onFieldChange('budget', parseFloat(e.target.value))}
              error={validationErrors.budget}
              placeholder='Enter budget amount'
              min='100'
              step='100'
            />
            {formData.budget && (
              <p className='text-xs text-gray-500 mt-1'>
                {formatCurrency(formData.budget)}
              </p>
            )}
          </div>

          {/* Dates Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Start Date'
              type='date'
              value={formData.startDate || ''}
              onChange={e => onFieldChange('startDate', e.target.value)}
              error={validationErrors.startDate}
            />
            <Input
              label='End Date'
              type='date'
              value={formData.endDate || ''}
              onChange={e => onFieldChange('endDate', e.target.value)}
              error={validationErrors.endDate}
            />
          </div>

          {/* Objective */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Campaign Objective
            </label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={3}
              value={formData.objective || ''}
              onChange={e => onFieldChange('objective', e.target.value)}
              placeholder='What is the goal of this campaign?'
            />
            {validationErrors.objective && (
              <p className='text-xs text-red-600 mt-1'>{validationErrors.objective}</p>
            )}
          </div>

          {/* Target Audience */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Target Audience
            </label>
            <Input
              type='text'
              value={formData.targetAudience || ''}
              onChange={e => onFieldChange('targetAudience', e.target.value)}
              placeholder='Describe your target audience'
            />
          </div>

          {/* Save Button */}
          <div className='pt-4 border-t border-gray-200 flex justify-end'>
            <Button
              variant='primary'
              isLoading={isSaving}
              onClick={onSave}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CampaignDetailOverview;
