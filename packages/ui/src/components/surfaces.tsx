import type { HTMLAttributes, ReactNode } from 'react';

/* ---------------------------------------------------------------- Card */
export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'raised' | 'flush' | 'gold';
  title?: ReactNode;
}

/** Surface container for grouped content. */
export function Card({
  variant,
  title,
  children,
  className = '',
  ...rest
}: CardProps) {
  const cls = [
    'hn-card',
    variant === 'raised' && 'hn-card--raised',
    variant === 'flush' && 'hn-card--flush',
    variant === 'gold' && 'hn-card--gold',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      {title && <h3 className="hn-card__title">{title}</h3>}
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- Modal */
export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  /** Footer action buttons. */
  actions?: ReactNode;
}

/** Centered modal dialog with scrim. Render only when open. */
export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  if (!open) return null;
  return (
    <div className="hn-overlay" onClick={onClose}>
      <div
        className="hn-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="hn-modal__title">{title}</h2>}
        <div className="hn-modal__body">{children}</div>
        {actions && <div className="hn-modal__actions">{actions}</div>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Drawer */
export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  /** Edge the sheet slides from. Default 'bottom'. */
  side?: 'top' | 'bottom';
  /** Fill the whole screen (for full-page content). */
  full?: boolean;
}

/** Sheet / drawer that slides from the bottom (default) or top edge. */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = 'bottom',
  full = false,
}: DrawerProps) {
  if (!open) return null;
  const handle = <div className="hn-drawer__handle" />;
  return (
    <>
      <div className="hn-drawer__scrim" onClick={onClose} />
      <div
        className={`hn-drawer${side === 'top' ? ' hn-drawer--top' : ''}${
          full ? ' hn-drawer--full' : ''
        }`}
        role="dialog"
        aria-modal="true"
      >
        {!full && side === 'bottom' && handle}
        {onClose && (
          <button
            type="button"
            className="hn-drawer__close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ×
          </button>
        )}
        {title && <h2 className="hn-drawer__title">{title}</h2>}
        {children}
        {!full && side === 'top' && handle}
      </div>
    </>
  );
}
