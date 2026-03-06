import type { Job, JobConfig } from './types';
import { MOCK_JOBS } from '../../mock-data';
import { simulateDelay, shouldFail, generateId } from '../../utils/helpers';
import { SIMULATION } from '../../utils/constants';

/**
 * Job Service Layer
 * Handles background job lifecycle and polling with subscription support
 */

let jobs: Job[] = [...MOCK_JOBS];
const jobProgress = new Map<string, { current: number; target: number }>();
const pollingIntervals = new Map<string, ReturnType<typeof setInterval>>();
const pollSubscribers = new Map<string, Set<(job: Job) => void>>();

export const jobService = {
  /**
   * Create a new job
   */
  async createJob(type: Job['type'], _config?: JobConfig): Promise<Job> {
    await simulateDelay();

    const newJob: Job = {
      id: generateId(),
      type,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jobs.push(newJob);
    jobProgress.set(newJob.id, { current: 0, target: Math.floor(Math.random() * 30) + 20 });

    return newJob;
  },

  /**
   * Get job by ID
   */
  async getJob(id: string): Promise<Job> {
    await simulateDelay(300, 500);

    const job = jobs.find(j => j.id === id);
    if (!job) {
      throw new Error(`Job ${id} not found`);
    }

    return job;
  },

  /**
   * Fetch all jobs
   */
  async getJobs(): Promise<Job[]> {
    await simulateDelay(300, 500);

    return jobs;
  },

  /**
   * Poll job status
   * Returns updated job with simulated progress
   */
  async pollJobStatus(id: string): Promise<Job> {
    await simulateDelay(300, 600);

    const job = jobs.find(j => j.id === id);
    if (!job) {
      throw new Error(`Job ${id} not found`);
    }

    // Simulate job progression
    const currentProgress = jobProgress.get(id);
    if (currentProgress && job.status === 'pending') {
      const newIndex = jobs.findIndex(j => j.id === id);
      if (newIndex !== -1) {
        jobs[newIndex] = {
          ...jobs[newIndex],
          status: 'processing',
          progress: Math.min(currentProgress.current + 10, 99),
          startedAt: jobs[newIndex].startedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        jobProgress.set(id, {
          current: jobs[newIndex].progress,
          target: currentProgress.target,
        });
      }
    }

    // Simulate job completion
    if (job.progress >= 90 && job.status === 'processing') {
      const newIndex = jobs.findIndex(j => j.id === id);
      if (newIndex !== -1) {
        const willFail = shouldFail(0.1);
        jobs[newIndex] = {
          ...jobs[newIndex],
          status: willFail ? 'failed' : 'completed',
          progress: willFail ? jobs[newIndex].progress : 100,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          error: willFail ? 'Job failed during processing' : undefined,
          result: willFail
            ? undefined
            : {
                message: 'Job completed successfully',
                timestamp: new Date().toISOString(),
              },
        };
        if (willFail) {
          jobProgress.delete(id);
        }
      }
    }

    return jobs.find(j => j.id === id) || job;
  },

  /**
   * Start polling a job with subscription callback
   * Callback fires whenever job status changes
   */
  startPolling(id: string, callback: (job: Job) => void): () => void {
    // Add subscriber
    if (!pollSubscribers.has(id)) {
      pollSubscribers.set(id, new Set());
    }
    pollSubscribers.get(id)!.add(callback);

    // Start polling interval if not already running
    if (!pollingIntervals.has(id)) {
      const interval = setInterval(async () => {
        try {
          const updatedJob = await this.pollJobStatus(id);
          
          // Notify all subscribers
          const subscribers = pollSubscribers.get(id);
          if (subscribers) {
            subscribers.forEach(sub => sub(updatedJob));
          }

          // Stop polling if job is complete or failed
          if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
            this.stopPolling(id);
          }
        } catch (error) {
          console.error(`Polling error for job ${id}:`, error);
        }
      }, SIMULATION.POLL_INTERVAL);

      pollingIntervals.set(id, interval);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = pollSubscribers.get(id);
      if (subscribers) {
        subscribers.delete(callback);
        
        // Stop interval if no subscribers left
        if (subscribers.size === 0) {
          this.stopPolling(id);
        }
      }
    };
  },

  /**
   * Stop polling a job
   */
  stopPolling(id: string): void {
    const interval = pollingIntervals.get(id);
    if (interval) {
      clearInterval(interval);
      pollingIntervals.delete(id);
    }
    pollSubscribers.delete(id);
  },

  /**
   * Cancel job
   */
  async cancelJob(id: string): Promise<Job> {
    await simulateDelay();

    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) {
      throw new Error(`Job ${id} not found`);
    }

    jobs[index] = {
      ...jobs[index],
      status: 'failed',
      error: 'Job cancelled by user',
      updatedAt: new Date().toISOString(),
    };

    jobProgress.delete(id);
    this.stopPolling(id);
    return jobs[index];
  },

  /**
   * Retry failed job
   */
  async retryJob(id: string): Promise<Job> {
    await simulateDelay();

    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) {
      throw new Error(`Job ${id} not found`);
    }

    jobs[index] = {
      ...jobs[index],
      status: 'pending',
      progress: 0,
      error: undefined,
      result: undefined,
      updatedAt: new Date().toISOString(),
    };

    jobProgress.set(id, { current: 0, target: Math.floor(Math.random() * 30) + 20 });
    return jobs[index];
  },

  /**
   * Get all active jobs (pending or processing)
   */
  getActiveJobs(): Job[] {
    return jobs.filter(j => j.status === 'pending' || j.status === 'processing');
  },

  /**
   * Clear completed/failed jobs
   */
  clearCompletedJobs(): void {
    jobs = jobs.filter(j => j.status !== 'completed' && j.status !== 'failed');
  },
};
