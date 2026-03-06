import { useState, useCallback, useEffect } from 'react';
import type { CampaignDetail, FormValidationErrors, UploadProgress } from '../types';
import { getCampaignDetail } from '../../../mock-data';
import { simulateDelay, generateId } from '../../../utils/helpers';

export const useCampaignDetail = (campaignId: string) => {
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<CampaignDetail>>({});
  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({});
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load campaign detail
  useEffect(() => {
    const loadCampaign = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await simulateDelay(300, 600);
        const detail = getCampaignDetail(campaignId);
        if (!detail) {
          setError('Campaign not found');
          return;
        }
        setCampaign(detail);
        setFormData(detail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load campaign');
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId]);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const errors: FormValidationErrors = {};

    if (!formData.name || formData.name.trim().length === 0) {
      errors.name = 'Campaign name is required';
    }

    if (!formData.budget || formData.budget < 100) {
      errors.budget = 'Budget must be at least $100';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        errors.endDate = 'End date must be after start date';
      }
    }

    if (formData.objective && formData.objective.trim().length < 10) {
      errors.objective = 'Objective must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Update form field
  const handleFieldChange = useCallback((field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setValidationErrors(prev => ({
      ...prev,
      [field]: undefined,
    }));
  }, []);

  // Save campaign details
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await simulateDelay(500, 1000);

      // Update campaign in memory
      if (campaign) {
        const updated: CampaignDetail = {
          ...campaign,
          ...formData,
          updatedAt: new Date().toISOString(),
        } as CampaignDetail;
        setCampaign(updated);
      }

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save campaign');
    } finally {
      setIsSaving(false);
    }
  }, [validateForm, campaign, formData]);

  // Handle file drop
  const handleFileDrop = useCallback((files: FileList) => {
    const newUploads: UploadProgress[] = [];

    Array.from(files).forEach(file => {
      const fileId = generateId();
      newUploads.push({
        fileId,
        fileName: file.name,
        progress: 0,
        status: 'pending',
      });
    });

    setUploads(prev => [...prev, ...newUploads]);

    // Simulate upload progress
    newUploads.forEach((upload, index) => {
      setTimeout(() => {
        simulateUpload(upload.fileId);
      }, index * 200);
    });
  }, []);

  // Simulate file upload with progress
  const simulateUpload = useCallback((fileId: string) => {
    const interval = setInterval(() => {
      setUploads(prev => {
        const updated = prev.map(u => {
          if (u.fileId === fileId) {
            const newProgress = u.progress + Math.random() * 30;
            if (newProgress >= 100) {
              return { ...u, progress: 100, status: 'completed' as const };
            }
            return { ...u, progress: newProgress, status: 'uploading' as const };
          }
          return u;
        });

        // Clear completed uploads after animation
        const completed = updated.find(u => u.fileId === fileId && u.status === 'completed');
        if (completed) {
          setTimeout(() => {
            setUploads(prev => prev.filter(u => u.fileId !== fileId));
          }, 1500);
        }

        return updated;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Remove upload
  const handleRemoveUpload = useCallback((fileId: string) => {
    setUploads(prev => prev.filter(u => u.fileId !== fileId));
  }, []);

  // Retry failed upload
  const handleRetryUpload = useCallback((fileId: string) => {
    setUploads(prev =>
      prev.map(u =>
        u.fileId === fileId ? { ...u, progress: 0, status: 'pending', error: undefined } : u
      )
    );
    simulateUpload(fileId);
  }, [simulateUpload]);

  return {
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
  };
};
