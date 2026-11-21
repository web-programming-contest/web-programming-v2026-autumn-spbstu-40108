import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  className?: string;
  size?: 'md' | 'lg';
  hideHeader?: boolean;
}

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  className,
  size = 'md',
  hideHeader = false,
}: ModalProps): JSX.Element | null {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative max-h-[calc(100vh-48px)] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl',
          size === 'lg' ? 'max-w-[1000px]' : 'max-w-[460px]',
          className,
        )}
      >
        {hideHeader ? (
          <>
            <span id={titleId} className="sr-only">
              {title}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Закрыть"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink active:bg-surfaceAlt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={onClose}
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
            <div className="text-sm leading-6 text-muted">{children}</div>
            {footer ? (
              <div className="mt-6 flex justify-end">{footer}</div>
            ) : null}
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <h2 id={titleId} className="text-xl font-bold text-ink">
                {title}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Закрыть"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink active:bg-surfaceAlt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onClose}
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 text-sm leading-6 text-muted">{children}</div>
            {footer ? (
              <div className="mt-6 flex justify-end">{footer}</div>
            ) : null}
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
