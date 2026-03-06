import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantClasses = {
  default: 'bg-gray-200 text-gray-800 border border-gray-300',
  success: 'bg-green-100 text-green-800 border border-green-300',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  danger: 'bg-red-100 text-red-800 border border-red-300',
  info: 'bg-blue-100 text-blue-800 border border-blue-300',
} as const;

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className = '', ...props }) => {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export default Badge;
