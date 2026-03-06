import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import CampaignListPage from './features/campaigns/components/CampaignListPage';
import CampaignDetail from './features/campaigns/components/CampaignDetail';
import JobsPage from './features/jobs/components/JobsPage';
import type { Campaign } from './features/campaigns/types';

type Page = 'campaigns' | 'jobs' | 'campaign-detail';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleNavigate = (href: string) => {
    if (href === '/') {
      setCurrentPage('campaigns');
    } else if (href === '/jobs') {
      setCurrentPage('jobs');
    }
    setSelectedCampaign(null);
  };

  const getDisplayPage = (): string => {
    if (currentPage === 'campaign-detail') return '/';
    if (currentPage === 'jobs') return '/jobs';
    return '/';
  };

  if (currentPage === 'campaign-detail' && selectedCampaign) {
    return (
      <Layout onNavigate={handleNavigate} currentPage={getDisplayPage()}>
        <CampaignDetail
          campaignId={selectedCampaign.id}
          onBack={() => setCurrentPage('campaigns')}
        />
      </Layout>
    );
  }

  return (
    <Layout onNavigate={handleNavigate} currentPage={getDisplayPage()}>
      {currentPage === 'campaigns' && (
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Campaigns</h1>
            <p className='text-gray-600 mt-1'>
              Manage and monitor your marketing campaigns
            </p>
          </div>
          <CampaignListPage
            onCampaignSelect={(campaign) => {
              setSelectedCampaign(campaign);
              setCurrentPage('campaign-detail');
            }}
          />
        </div>
      )}

      {currentPage === 'jobs' && <JobsPage />}
    </Layout>
  );
}

export default App;
