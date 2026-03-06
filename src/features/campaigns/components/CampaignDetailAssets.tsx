import React, { useCallback, useRef } from 'react';
import type { CampaignDetail, UploadProgress } from '../types';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Upload, X, File, CheckCircle, AlertCircle, RotateCw } from 'lucide-react';

interface CampaignDetailAssetsProps {
  campaign: CampaignDetail | null;
  uploads: UploadProgress[];
  onFileDrop: (files: FileList) => void;
  onRemoveUpload: (fileId: string) => void;
  onRetryUpload: (fileId: string) => void;
}

const CampaignDetailAssets: React.FC<CampaignDetailAssetsProps> = ({
  campaign,
  uploads,
  onFileDrop,
  onRemoveUpload,
  onRetryUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileDrop(e.dataTransfer.files);
      }
    },
    [onFileDrop]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileDrop(e.target.files);
      }
    },
    [onFileDrop]
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return '🖼️';
    }
    if (['mp4', 'avi', 'mov', 'mkv'].includes(ext || '')) {
      return '🎬';
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
      return '📄';
    }
    return '📎';
  };

  return (
    <div className='space-y-6'>
      {/* Upload Area */}
      <Card header={<h3 className='text-lg font-semibold text-gray-900'>Upload Assets</h3>}>
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type='file'
            multiple
            onChange={handleFileInputChange}
            className='hidden'
            accept='image/*,video/*,.pdf,.doc,.docx'
          />

          <div className='text-center'>
            <Upload className='w-12 h-12 text-gray-400 mx-auto mb-3' />
            <h4 className='text-lg font-semibold text-gray-900 mb-1'>Drop files here</h4>
            <p className='text-sm text-gray-600 mb-4'>
              or click the button below to browse
            </p>
            <p className='text-xs text-gray-500 mb-4'>
              Supported: Images, Videos, PDFs, Documents (Max 100MB)
            </p>
            <Button
              variant='secondary'
              onClick={handleBrowseClick}
            >
              Browse Files
            </Button>
          </div>
        </div>
      </Card>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <Card header={<h3 className='text-lg font-semibold text-gray-900'>Uploads in Progress</h3>}>
          <div className='space-y-3'>
            {uploads.map(upload => (
              <div key={upload.fileId} className='flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0'>
                <div className='pt-1'>
                  <span className='text-xl'>{getFileIcon(upload.fileName)}</span>
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between gap-2 mb-2'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {upload.fileName}
                    </p>
                    {upload.status === 'completed' && (
                      <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0' />
                    )}
                    {upload.status === 'failed' && (
                      <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0' />
                    )}
                  </div>

                  {upload.status === 'uploading' && (
                    <div className='mb-2'>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-blue-600 h-2 rounded-full transition-all'
                          style={{ width: `${Math.round(upload.progress)}%` }}
                        ></div>
                      </div>
                      <p className='text-xs text-gray-600 mt-1'>
                        {Math.round(upload.progress)}%
                      </p>
                    </div>
                  )}

                  {upload.status === 'pending' && (
                    <div className='flex items-center gap-2'>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div className='bg-gray-400 h-2 rounded-full' style={{ width: '0%' }}></div>
                      </div>
                      <span className='text-xs text-gray-600'>Pending...</span>
                    </div>
                  )}

                  {upload.error && (
                    <p className='text-xs text-red-600'>{upload.error}</p>
                  )}
                </div>

                <div className='flex gap-2'>
                  {upload.status === 'failed' && (
                    <button
                      onClick={() => onRetryUpload(upload.fileId)}
                      className='p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors'
                      title='Retry upload'
                    >
                      <RotateCw className='w-4 h-4' />
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveUpload(upload.fileId)}
                    className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
                    title='Remove'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Current Assets */}
      {campaign && campaign.assets && campaign.assets.length > 0 && (
        <Card header={<h3 className='text-lg font-semibold text-gray-900'>Campaign Assets</h3>}>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {campaign.assets.map(asset => (
              <div
                key={asset.id}
                className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='text-3xl'>{getFileIcon(asset.name)}</div>
                  <span className='inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded'>
                    {asset.type}
                  </span>
                </div>

                <h4 className='font-medium text-gray-900 text-sm truncate mb-1'>
                  {asset.name}
                </h4>
                <p className='text-xs text-gray-600 mb-3'>
                  {(asset.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className='text-xs text-gray-500'>
                  Uploaded {new Date(asset.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {(!campaign || !campaign.assets || campaign.assets.length === 0) && uploads.length === 0 && (
        <Card>
          <div className='text-center py-8'>
            <File className='w-12 h-12 text-gray-300 mx-auto mb-3' />
            <p className='text-gray-500'>No assets uploaded yet</p>
            <p className='text-sm text-gray-400'>Upload images, videos, or documents for this campaign</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CampaignDetailAssets;
