import { forwardRef, useEffect, useRef } from 'react';

export function Eyebrow({ children, className = '' }) {
  return <div className={`flex items-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted ${className}`}>{children}</div>;
}

export const Button = forwardRef(function Button({ as: Component = 'button', children, icon: Icon, className = '', ...props }, ref) {
  return <Component ref={ref} className={`inline-flex min-h-12 items-center justify-center gap-3 bg-signal px-5 text-sm font-semibold text-ink transition hover:bg-[#e1ff8e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal ${className}`} {...props}>
    {children}{Icon && <Icon size={16} strokeWidth={2} />}
  </Component>;
});

export function Panel({ children, className = '' }) {
  return <section className={`border border-line bg-panel ${className}`}>{children}</section>;
}

const badgeStyles = {
  neutral: 'border-line bg-white/[0.03] text-muted',
  evidence: 'border-[#5f5136] bg-[#d4a95f]/10 text-[#e3c88f]',
  success: 'border-[#37664a] bg-[#4eaa78]/10 text-[#8bd0a6]',
  alert: 'border-[#754442] bg-[#c84b45]/10 text-[#f0978f]',
};

export function Badge({ children, tone = 'neutral', className = '' }) {
  return <span className={`inline-flex items-center border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${badgeStyles[tone] ?? badgeStyles.neutral} ${className}`}>{children}</span>;
}

export function Card({ children, className = '' }) {
  return <article className={`border border-line bg-panel ${className}`}>{children}</article>;
}

export function Field({ label, htmlFor, hint, error, children, className = '' }) {
  return <div className={className}>
    <label htmlFor={htmlFor} className="font-mono text-[10px] uppercase tracking-[0.15em] text-paper">{label}</label>
    {children}
    {error ? <p className="mt-2 text-xs text-[#f0978f]" role="alert">{error}</p> : hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
  </div>;
}

export const TextInput = forwardRef(function TextInput({ className = '', ...props }, ref) {
  return <input ref={ref} className={`mt-2 h-11 w-full border border-line bg-ink px-3 text-sm text-paper outline-none placeholder:text-[#626a64] focus:border-signal focus-visible:ring-1 focus-visible:ring-signal ${className}`} {...props} />;
});

export const Textarea = forwardRef(function Textarea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={`mt-2 w-full resize-y border border-line bg-ink p-3 text-sm leading-6 text-paper outline-none placeholder:text-[#626a64] focus:border-signal focus-visible:ring-1 focus-visible:ring-signal ${className}`} {...props} />;
});

export const SelectInput = forwardRef(function SelectInput({ className = '', children, ...props }, ref) {
  return <select ref={ref} className={`mt-2 h-11 w-full border border-line bg-ink px-3 text-sm text-paper outline-none focus:border-signal focus-visible:ring-1 focus-visible:ring-signal ${className}`} {...props}>{children}</select>;
});

export function EmptyState({ icon: Icon, title, children, action }) {
  return <div className="flex min-h-48 flex-col items-center justify-center border border-dashed border-line px-6 py-10 text-center">
    {Icon && <Icon className="mb-4 text-muted" size={22} aria-hidden="true" />}
    <h3 className="text-sm font-medium text-paper">{title}</h3>
    {children && <p className="mt-2 max-w-sm text-xs leading-5 text-muted">{children}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>;
}

export function LoadingIndicator({ label = 'Loading' }) {
  return <span className="inline-flex items-center gap-2 text-xs text-muted" role="status"><span className="h-3 w-3 animate-spin rounded-full border border-line border-t-signal motion-reduce:animate-none" />{label}</span>;
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/[0.06] motion-reduce:animate-none ${className}`} aria-hidden="true" />;
}

export function ErrorState({ title = 'Something went wrong', children, action }) {
  return <div className="border border-[#754442] bg-[#c84b45]/5 p-5" role="alert">
    <h3 className="text-sm font-medium text-[#f0978f]">{title}</h3>
    {children && <p className="mt-2 text-xs leading-5 text-muted">{children}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>;
}

export function Modal({ open, onClose, title, children, footer }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () => [...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    focusable()[0]?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Tab') {
        const items = focusable();
        if (!items.length) return;
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items.at(-1).focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0].focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1} className="max-h-[92vh] w-full max-w-xl overflow-y-auto border border-line bg-panel shadow-2xl">
      <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
        <h2 id="dialog-title" className="text-base font-medium text-paper">{title}</h2>
        <button type="button" onClick={onClose} className="px-2 py-1 text-xs text-muted hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal" aria-label="Close dialog">Close</button>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
      {footer && <footer className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">{footer}</footer>}
    </section>
  </div>;
}
