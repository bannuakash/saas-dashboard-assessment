import React from 'react';
import { Loader, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader
      className={`${sizeClasses[size]} animate-spin text-blue-600`}
    />
  );
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  children,
  onClose,
  className = '',
  ...props
}) => {
  const icons = {
    success: <CheckCircle className='w-5 h-5' />,
    error: <AlertCircle className='w-5 h-5' />,
    warning: <AlertTriangle className='w-5 h-5' />,
    info: <Info className='w-5 h-5' />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={`border rounded-lg p-4 flex gap-3 ${styles[variant]} ${className}`}
      {...props}
    >
      <div className='flex-shrink-0 mt-0.5'>{icons[variant]}</div>
      <div className='flex-1'>
        {title && <p className='font-semibold'>{title}</p>}
        <p className='text-sm'>{children}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className='flex-shrink-0 text-sm font-medium opacity-50 hover:opacity-75'
        >
          ×
        </button>
      )}
    </div>
  );
};

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ count = 1, className = '', ...props }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 rounded animate-pulse-subtle ${className}`}
          {...props}
        />
      ))}
    </>
  );
};
