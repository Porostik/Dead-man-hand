import { useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from '../icons';

/* --------------------------------------------------------------- Badge */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'gold' | 'rust' | 'positive' | 'solid';
  dot?: boolean;
}

/** Small status label / count. */
export function Badge({
  tone,
  dot = false,
  children,
  className = '',
  ...rest
}: BadgeProps) {
  const cls = ['hn-badge', tone && `hn-badge--${tone}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} {...rest}>
      {dot && <span className="hn-badge__dot" />}
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- Banner */
const TONE_ICON: Record<string, IconName> = {
  info: 'info',
  warning: 'flame',
  danger: 'skull',
  positive: 'check',
};

export interface BannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: 'info' | 'warning' | 'danger' | 'positive';
  icon?: IconName;
  title?: ReactNode;
}

/** Inline callout / notice strip with a leading western icon. */
export function Banner({
  tone = 'info',
  icon,
  title,
  children,
  className = '',
  ...rest
}: BannerProps) {
  const cls = ['hn-banner', tone !== 'info' && `hn-banner--${tone}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      <span className="hn-banner__icon">
        <Icon name={icon || TONE_ICON[tone] || 'info'} size={20} />
      </span>
      <div>
        {title && <div className="hn-banner__title">{title}</div>}
        {children && <div className="hn-banner__msg">{children}</div>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- ProgressBar */
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100. */
  value?: number;
  tone?: 'rust' | 'turq';
  size?: 'lg';
}

/** Slim progress / stat bar. */
export function ProgressBar({
  value = 0,
  tone,
  size,
  className = '',
  ...rest
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const cls = [
    'hn-progress',
    tone && `hn-progress--${tone}`,
    size && `hn-progress--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div
      className={cls}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div className="hn-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------- Spinner */
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm';
  tone?: 'rust';
}

/** Spinning loader ring. */
export function Spinner({ size, tone, className = '', ...rest }: SpinnerProps) {
  const cls = [
    'hn-spinner',
    size && `hn-spinner--${size}`,
    tone && `hn-spinner--${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return <span className={cls} role="status" aria-label="Загрузка" {...rest} />;
}

/* --------------------------------------------------------------- Toast */
export interface ToastProps {
  tone?: 'positive' | 'danger';
  icon?: ReactNode;
  children?: ReactNode;
}

/** Transient notification banner. Render in a fixed corner; auto-dismiss in app. */
export function Toast({ tone, icon, children }: ToastProps) {
  const cls = ['hn-toast', tone && `hn-toast--${tone}`]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} role="status">
      {icon && <span className="hn-toast__icon">{icon}</span>}
      <span className="hn-toast__msg">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------- Tooltip */
export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  label: ReactNode;
  children?: ReactNode;
}

/** Lightweight hover/focus tooltip wrapping its child trigger. */
export function Tooltip({ label, children, className = '', ...rest }: TooltipProps) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={['hn-tooltip', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...rest}
    >
      {children}
      {open && (
        <span className="hn-tooltip__bubble" role="tooltip">
          {label}
        </span>
      )}
    </span>
  );
}

/* ---------------------------------------------------------------- Stat */
export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  value: ReactNode;
  label: ReactNode;
}

/** Label + value block (mono). */
export function Stat({ value, label, className = '', ...rest }: StatProps) {
  return (
    <div className={['hn-stat', className].filter(Boolean).join(' ')} {...rest}>
      <span className="hn-stat__val">{value}</span>
      <span className="hn-stat__lab">{label}</span>
    </div>
  );
}
