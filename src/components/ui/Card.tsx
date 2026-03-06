import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ header, footer, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
      {header && <div className='px-6 py-4 border-b border-gray-200'>{header}</div>}
      {props.children && <div className='px-6 py-4'>{props.children}</div>}
      {footer && <div className='px-6 py-4 border-t border-gray-200'>{footer}</div>}
    </div>
  );
};

export default Card;
