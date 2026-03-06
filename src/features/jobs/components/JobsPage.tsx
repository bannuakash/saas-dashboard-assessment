import React, { useState } from 'react';
import { useJobPolling } from '../hooks/useJobPolling';
import JobsList from './JobsList';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { Download, BarChart3, RefreshCw, FileText } from 'lucide-react';

const JobsPage: React.FC = () => {
  const { createJob, jobs, getActiveJobs } = useJobPolling();
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  const handleCreateJob = async (type: 'campaign_export' | 'campaign_report' | 'bulk_update' | 'data_sync') => {
    setIsCreatingJob(true);
    try {
      await createJob(type);
    } catch (error) {
      console.error('Failed to create job:', error);
    } finally {
      setIsCreatingJob(false);
    }
  };

  const activeCount = getActiveJobs().length;

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Background Jobs</h1>
        <p className='text-gray-600 mt-1'>
          Monitor and manage background tasks and exports
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <div>
            <p className='text-sm text-gray-600'>Total Jobs</p>
            <p className='text-3xl font-bold text-gray-900 mt-2'>{jobs.length}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className='text-sm text-gray-600'>Active</p>
            <p className='text-3xl font-bold text-blue-600 mt-2'>{activeCount}</p>
          </div>
        </Card>

        <Card>
          <div>
            <p className='text-sm text-gray-600'>Completed</p>
            <p className='text-3xl font-bold text-green-600 mt-2'>
              {jobs.filter(j => j.status === 'completed').length}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className='text-sm text-gray-600'>Failed</p>
            <p className='text-3xl font-bold text-red-600 mt-2'>
              {jobs.filter(j => j.status === 'failed').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Create Job Actions */}
      <Card header={<h3 className='text-lg font-semibold text-gray-900'>Create New Job</h3>}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
          <Button
            variant='secondary'
            isLoading={isCreatingJob}
            onClick={() => handleCreateJob('campaign_export')}
            className='flex items-center justify-center'
          >
            <Download className='w-4 h-4 mr-2' />
            Export Campaigns
          </Button>

          <Button
            variant='secondary'
            isLoading={isCreatingJob}
            onClick={() => handleCreateJob('campaign_report')}
            className='flex items-center justify-center'
          >
            <FileText className='w-4 h-4 mr-2' />
            Generate Report
          </Button>

          <Button
            variant='secondary'
            isLoading={isCreatingJob}
            onClick={() => handleCreateJob('data_sync')}
            className='flex items-center justify-center'
          >
            <RefreshCw className='w-4 h-4 mr-2' />
            Sync Data
          </Button>

          <Button
            variant='secondary'
            isLoading={isCreatingJob}
            onClick={() => handleCreateJob('bulk_update')}
            className='flex items-center justify-center'
          >
            <BarChart3 className='w-4 h-4 mr-2' />
            Bulk Update
          </Button>
        </div>
      </Card>

      {/* Jobs List */}
      <JobsList />
    </div>
  );
};

export default JobsPage;
