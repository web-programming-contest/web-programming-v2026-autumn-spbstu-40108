import type { SortCriterion, SortDirection } from '../../types';
import { cn } from '../../utils/cn';

interface SortingBarProps {
  criterion: SortCriterion;
  direction: SortDirection;
  onCriterionChange: (criterion: SortCriterion) => void;
  onDirectionChange: (direction: SortDirection) => void;
}

const options: Array<{
  label: string;
  criterion: SortCriterion;
  direction: SortDirection;
}> = [
  { label: 'Новые', criterion: 'new', direction: 'desc' },
  { label: 'Популярные', criterion: 'popularity', direction: 'desc' },
  { label: 'Подешевле', criterion: 'price', direction: 'asc' },
  { label: 'Подороже', criterion: 'price', direction: 'desc' },
];

export function SortingBar({
  criterion,
  direction,
  onCriterionChange,
  onDirectionChange,
}: SortingBarProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      {options.map((option) => {
        const isActive =
          criterion === option.criterion && direction === option.direction;

        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              onCriterionChange(option.criterion);
              onDirectionChange(option.direction);
            }}
            className={cn(
              'inline-flex h-8 items-center rounded-md px-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isActive
                ? 'bg-primary-light text-white'
                : 'text-[#484848] underline decoration-line decoration-1 underline-offset-4 hover:text-primary',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
