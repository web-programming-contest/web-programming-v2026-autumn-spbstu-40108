import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationItem } from '../../utils/catalog';
import { getPaginationItems } from '../../utils/catalog';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function pageButtonStyles(isActive: boolean): string {
  return cn(
    'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40',
    isActive
      ? 'bg-primary text-white hover:bg-primary-dark active:bg-[#082A6E]'
      : 'text-primary hover:bg-primary-soft active:bg-[#DCE7FF]',
  );
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): JSX.Element | null {
  if (totalPages <= 1) {
    return null;
  }

  const items: PaginationItem[] = getPaginationItems(totalPages);

  return (
    <nav
      aria-label="Постраничная навигация"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="Предыдущая страница"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={pageButtonStyles(false)}
      >
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="inline-flex h-9 min-w-9 items-center justify-center text-sm text-muted"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Страница ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={pageButtonStyles(item === currentPage)}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Следующая страница"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={pageButtonStyles(false)}
      >
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </nav>
  );
}
