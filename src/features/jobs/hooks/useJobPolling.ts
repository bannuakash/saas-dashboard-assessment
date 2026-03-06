import { useEffect, useState, useCallback } from 'react';
import type { Job } from '../types';
import { jobService } from '../jobService';

export const useJobPolling = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial jobs
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const allJobs = await jobService.getJobs();
        setJobs(allJobs);

        // Start polling for active jobs
        allJobs.forEach((job: Job) => {
          if (job.status === 'pending' || job.status === 'processing') {
            jobService.startPolling(job.id, (updatedJob: Job) => {
              setJobs(prev =>
                prev.map(j => (j.id === updatedJob.id ? updatedJob : j))
              );
            });
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();

    // Cleanup: stop all polling on unmount
    return () => {
      jobs.forEach(job => {
        jobService.stopPolling(job.id);
      });
    };
  }, []);

  const createJob = useCallback(
    async (type: Job['type']) => {
      try {
        setError(null);
        const newJob = await jobService.createJob(type);
        setJobs(prev => [newJob, ...prev]);

        // Start polling immediately
        jobService.startPolling(newJob.id, (updatedJob: Job) => {
          setJobs(prev =>
            prev.map(j => (j.id === updatedJob.id ? updatedJob : j))
          );
        });

        return newJob;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create job';
        setError(errorMsg);
        throw err;
      }
    },
    []
  );

  const cancelJob = useCallback(async (id: string) => {
    try {
      setError(null);
      const cancelledJob = await jobService.cancelJob(id);
      setJobs(prev =>
        prev.map(j => (j.id === id ? cancelledJob : j))
      );
      return cancelledJob;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to cancel job';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const retryJob = useCallback(async (id: string) => {
    try {
      setError(null);
      const retriedJob = await jobService.retryJob(id);
      setJobs(prev =>
        prev.map(j => (j.id === id ? retriedJob : j))
      );

      // Resume polling
      jobService.startPolling(id, (updatedJob: Job) => {
        setJobs(prev =>
          prev.map(j => (j.id === updatedJob.id ? updatedJob : j))
        );
      });

      return retriedJob;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to retry job';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const clearCompleted = useCallback(() => {
    jobService.clearCompletedJobs();
    setJobs(prev => prev.filter(j => j.status !== 'completed' && j.status !== 'failed'));
  }, []);

  const getActiveJobs = useCallback(() => {
    return jobs.filter(j => j.status === 'pending' || j.status === 'processing');
  }, [jobs]);

  const getCompletedJobs = useCallback(() => {
    return jobs.filter(j => j.status === 'completed' || j.status === 'failed');
  }, [jobs]);

  return {
    jobs,
    isLoading,
    error,
    createJob,
    cancelJob,
    retryJob,
    clearCompleted,
    getActiveJobs,
    getCompletedJobs,
    setError,
  };
};
