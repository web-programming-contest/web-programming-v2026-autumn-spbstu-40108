import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
} from 'react';
import { cn } from '../../utils/cn';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, id, className, ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-ink"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-12 w-full rounded-xl border px-4 text-sm text-ink placeholder:text-muted transition-colors focus:outline-none',
            error
              ? 'border-red-500 bg-red-50/40 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-transparent bg-[#E4E6EB] hover:border-primary-light focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="mt-2 text-sm text-red-500">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
