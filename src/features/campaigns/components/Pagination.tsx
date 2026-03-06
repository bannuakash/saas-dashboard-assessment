import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200'>
      <div className='text-sm text-gray-600'>
        Showing <span className='font-medium'>{startItem}</span> to{' '}
        <span className='font-medium'>{endItem}</span> of{' '}
        <span className='font-medium'>{totalItems}</span> results
      </div>

      <div className='flex items-center gap-1'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className='w-4 h-4' />
        </Button>

        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className='px-2 text-gray-400'>...</span>
            ) : (
              <Button
                variant={page === currentPage ? 'primary' : 'secondary'}
                size='sm'
                onClick={() => onPageChange(page as number)}
                className='min-w-10'
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant='secondary'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className='w-4 h-4' />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
