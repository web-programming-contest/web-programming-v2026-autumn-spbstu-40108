import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function Select({
  label,
  value,
  options,
  onChange,
  placeholder = 'Не выбрано',
  error,
  disabled = false,
}: SelectProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const buttonId = `${generatedId}-button`;
  const listboxId = `${generatedId}-listbox`;
  const errorId = `${generatedId}-error`;
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const selectOption = (option: SelectOption): void => {
    onChange(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={buttonId}
        className="mb-2 block text-sm font-medium text-ink"
      >
        {label}
      </label>

      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-xl border px-4 text-left text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
          error
            ? 'border-red-500 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-transparent bg-[#E4E6EB] hover:border-primary-light focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15',
        )}
      >
        <span className={selectedOption ? 'text-ink' : 'text-muted'}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 text-muted transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-card"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(option)}
                  className={cn(
                    'flex w-full items-center px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-primary-soft active:bg-[#DCE7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                    isSelected && 'bg-[#BFD3FD]',
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
