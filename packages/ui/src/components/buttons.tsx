import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
}

/**
 * Primary action control. Variants map to rust (primary), turquoise
 * (secondary), outline (ghost) and danger.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  type = 'button',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const cls = [
    'hn-btn',
    variant !== 'primary' && `hn-btn--${variant}`,
    size !== 'md' && `hn-btn--${size}`,
    block && 'hn-btn--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  variant?: 'outline' | 'bare' | 'solid';
  /** Accessible label (icon-only button). */
  label: string;
  children?: ReactNode;
}

/** Square icon-only button (44px hit target). */
export function IconButton({
  variant = 'outline',
  label,
  children,
  className = '',
  ...rest
}: IconButtonProps) {
  const cls = [
    'hn-iconbtn',
    variant === 'bare' && 'hn-iconbtn--bare',
    variant === 'solid' && 'hn-iconbtn--solid',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={cls} aria-label={label} {...rest}>
      {children}
    </button>
  );
}
