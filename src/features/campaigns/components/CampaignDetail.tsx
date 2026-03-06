import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useCampaignDetail } from '../hooks/useCampaignDetail';
import CampaignDetailOverview from './CampaignDetailOverview';
import CampaignDetailAssets from './CampaignDetailAssets';
import CampaignDetailPerformance from './CampaignDetailPerformance';
import Button from '../../../components/ui/Button';
import { Alert, Spinner } from '../../../components/ui/Feedback';

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
}

type TabType = 'overview' | 'assets' | 'performance';

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaignId, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const {
    campaign,
    isLoading,
    error,
    isSaving,
    formData,
    validationErrors,
    uploads,
    showSuccessMessage,
    handleFieldChange,
    handleSave,
    handleFileDrop,
    handleRemoveUpload,
    handleRetryUpload,
    setError,
  } = useCampaignDetail(campaignId);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className='space-y-4'>
        <Button variant='ghost' onClick={onBack} className='text-blue-600'>
          <ChevronLeft className='w-4 h-4 mr-2' />
          Back to campaigns
        </Button>

        <Alert variant='error' title='Error' onClose={() => setError(null)}>
          {error || 'Campaign not found'}
        </Alert>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'assets', label: 'Assets', icon: '📁' },
    { id: 'performance', label: 'Performance', icon: '📊' },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          onClick={onBack}
          className='text-gray-600 hover:text-gray-900'
        >
          <ChevronLeft className='w-5 h-5' />
        </Button>
        <div className='flex-1 min-w-0'>
          <h1 className='text-3xl font-bold text-gray-900 truncate'>{campaign.name}</h1>
          <p className='text-gray-600 text-sm mt-1'>
            Campaign ID: {campaign.id}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='bg-white border-b border-gray-200 rounded-t-lg overflow-hidden'>
        <div className='flex'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-blue-600'
                  : 'text-gray-700 border-b-transparent hover:text-gray-900 hover:border-b-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className='pb-6'>
        {activeTab === 'overview' && (
          <CampaignDetailOverview
            campaign={campaign}
            formData={formData}
            validationErrors={validationErrors}
            isSaving={isSaving}
            showSuccessMessage={showSuccessMessage}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
          />
        )}

        {activeTab === 'assets' && (
          <CampaignDetailAssets
            campaign={campaign}
            uploads={uploads}
            onFileDrop={handleFileDrop}
            onRemoveUpload={handleRemoveUpload}
            onRetryUpload={handleRetryUpload}
          />
        )}

        {activeTab === 'performance' && (
          <CampaignDetailPerformance campaign={campaign} />
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
