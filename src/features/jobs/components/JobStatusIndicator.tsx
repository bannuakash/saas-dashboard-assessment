import React from 'react';
import type { Job } from '../types';
import { CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react';

interface JobStatusIndicatorProps {
  job: Job;
  showDetails?: boolean;
}

const JobStatusIndicator: React.FC<JobStatusIndicatorProps> = ({
  job,
  showDetails = false,
}) => {
  const getStatusConfig = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Pending',
          dotColor: 'bg-yellow-600',
        };
      case 'processing':
        return {
          icon: Loader,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Processing',
          dotColor: 'bg-blue-600',
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Completed',
          dotColor: 'bg-green-600',
        };
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Failed',
          dotColor: 'bg-red-600',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Unknown',
          dotColor: 'bg-gray-600',
        };
    }
  };

  const config = getStatusConfig(job.status);
  const StatusIcon = config.icon;

  if (!showDetails) {
    return (
      <div className='inline-flex items-center gap-2'>
        <div className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`}></div>
        <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-4`}>
      <div className='flex items-start gap-3'>
        <StatusIcon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between mb-2'>
            <h4 className='text-sm font-semibold text-gray-900'>{job.type}</h4>
            <span className={`text-xs font-medium px-2 py-1 rounded ${config.color}`}>
              {config.label}
            </span>
          </div>

          {/* Progress Bar */}
          {(job.status === 'pending' || job.status === 'processing') && (
            <div className='mb-3'>
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
          )}

          {/* Job ID */}
          <p className='text-xs text-gray-600 mb-2'>ID: {job.id}</p>

          {/* Timestamps */}
          <div className='text-xs text-gray-600 space-y-1'>
            {job.createdAt && (
              <p>
                Created: {new Date(job.createdAt).toLocaleString()}
              </p>
            )}
            {job.startedAt && (
              <p>
                Started: {new Date(job.startedAt).toLocaleString()}
              </p>
            )}
            {job.completedAt && (
              <p>
                Completed: {new Date(job.completedAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* Error Message */}
          {job.error && (
            <div className='mt-2 p-2 bg-red-100 rounded text-xs text-red-700'>
              {job.error}
            </div>
          )}

          {/* Result */}
          {job.result && typeof job.result === 'object' && (
            <div className='mt-2 p-2 bg-green-100 rounded text-xs text-green-700'>
              <p className='font-medium'>Result:</p>
              <p>{Object.entries(job.result)
                .map(([key, value]) => `${key}: ${String(value)}`)
                .join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Compact inline status badge
 */
export const JobStatusBadge: React.FC<{ job: Job }> = ({ job }) => {
  const statusColors: Record<Job['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
      {job.status === 'processing' && (
        <Loader className='w-3 h-3 mr-1 animate-spin' />
      )}
      {job.status === 'pending' && (
        <Clock className='w-3 h-3 mr-1' />
      )}
      {job.status === 'completed' && (
        <CheckCircle className='w-3 h-3 mr-1' />
      )}
      {job.status === 'failed' && (
        <AlertCircle className='w-3 h-3 mr-1' />
      )}
      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
    </span>
  );
};

export default JobStatusIndicator;
