import React, { useMemo } from 'react';
import { useJobPolling } from '../hooks/useJobPolling';
import { JobStatusBadge } from './JobStatusIndicator';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { Alert, Spinner } from '../../../components/ui/Feedback';
import { X, RotateCw, Trash2, Download } from 'lucide-react';

interface JobsListProps {
  compact?: boolean;
  onlyActive?: boolean;
}

const JobsList: React.FC<JobsListProps> = ({ compact = false, onlyActive = false }) => {
  const {
    jobs,
    isLoading,
    error,
    cancelJob,
    retryJob,
    clearCompleted,
    getActiveJobs,
    getCompletedJobs,
    setError,
  } = useJobPolling();

  const displayJobs = useMemo(() => {
    if (onlyActive) {
      return getActiveJobs();
    }
    return jobs;
  }, [jobs, onlyActive, getActiveJobs]);

  const activeJobs = useMemo(() => getActiveJobs(), [getActiveJobs]);
  const completedJobs = useMemo(() => getCompletedJobs(), [getCompletedJobs]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert
        variant='error'
        title='Error'
        onClose={() => setError(null)}
      >
        {error}
      </Alert>
    );
  }

  if (displayJobs.length === 0) {
    return (
      <Card>
        <div className='text-center py-8'>
          <p className='text-gray-500'>No jobs yet</p>
          <p className='text-sm text-gray-400'>
            {onlyActive ? 'No active jobs running' : 'Create a job to get started'}
          </p>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card header={<h3 className='text-lg font-semibold text-gray-900'>Active Jobs ({activeJobs.length})</h3>}>
        <div className='space-y-3'>
          {activeJobs.length === 0 ? (
            <p className='text-sm text-gray-500'>No active jobs</p>
          ) : (
            activeJobs.map(job => (
              <div
                key={job.id}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
              >
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900'>{job.type}</p>
                  <div className='flex items-center gap-2 mt-1'>
                    <JobStatusBadge job={job} />
                    <span className='text-xs text-gray-600'>{job.progress}%</span>
                  </div>
                </div>
                <div className='flex gap-2'>
                  {job.status !== 'completed' && job.status !== 'failed' && (
                    <button
                      onClick={() => cancelJob(job.id)}
                      className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
                      title='Cancel job'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <Card
          header={
            <h3 className='text-lg font-semibold text-gray-900'>
              Active Jobs ({activeJobs.length})
            </h3>
          }
        >
          <div className='space-y-4'>
            {activeJobs.map(job => (
              <div
                key={job.id}
                className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
              >
                <div className='flex-1 min-w-0 mr-4'>
                  <div className='flex items-center gap-3 mb-2'>
                    <p className='text-sm font-medium text-gray-900'>{job.type}</p>
                    <JobStatusBadge job={job} />
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full transition-all ${
                        job.status === 'processing' ? 'bg-blue-600' : 'bg-yellow-600'
                      }`}
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                  <p className='text-xs text-gray-600 mt-1'>{job.progress}%</p>
                </div>
                <div className='flex gap-2 flex-shrink-0'>
                  {job.status !== 'completed' && job.status !== 'failed' && (
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => cancelJob(job.id)}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Completed/Failed Jobs */}
      {completedJobs.length > 0 && (
        <Card
          header={
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Job History ({completedJobs.length})
              </h3>
              <Button
                variant='ghost'
                size='sm'
                onClick={clearCompleted}
              >
                <Trash2 className='w-4 h-4' />
                Clear
              </Button>
            </div>
          }
        >
          <div className='space-y-3'>
            {completedJobs.map(job => (
              <div
                key={job.id}
                className='border border-gray-200 rounded-lg p-4'
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-900'>{job.type}</p>
                    <p className='text-xs text-gray-600 mt-1'>
                      ID: {job.id.substring(0, 12)}...
                    </p>
                  </div>
                  <JobStatusBadge job={job} />
                </div>

                {/* Timeline Info */}
                <div className='text-xs text-gray-600 space-y-1 mb-3'>
                  {job.completedAt && (
                    <p>
                      Completed: {new Date(job.completedAt).toLocaleString()}
                    </p>
                  )}
                  {job.error && (
                    <p className='text-red-600'>Error: {job.error}</p>
                  )}
                </div>

                {/* Actions */}
                {job.status === 'failed' && (
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => retryJob(job.id)}
                  >
                    <RotateCw className='w-4 h-4 mr-2' />
                    Retry
                  </Button>
                )}

                {job.status === 'completed' && (
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => {
                      // In a real app, this would download the result
                      alert('Download not implemented in demo');
                    }}
                  >
                    <Download className='w-4 h-4 mr-2' />
                    Download Result
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default JobsList;
