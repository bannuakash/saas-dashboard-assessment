import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  footer,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black bg-opacity-50'
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative z-10 bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4`}>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <div className='px-6 py-4'>{children}</div>

        {/* Footer */}
        {footer && (
          <div className='px-6 py-4 border-t border-gray-200 flex justify-end gap-2'>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
