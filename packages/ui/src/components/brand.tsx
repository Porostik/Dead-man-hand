import type { HTMLAttributes } from 'react';

export interface WordmarkProps extends HTMLAttributes<HTMLDivElement> {
  /** Small uppercase line above the name. Pass null/'' to hide. */
  kicker?: string | null;
  /** The display name (Rye). */
  name?: string;
  /** Mono tagline below. Pass null/'' to hide. */
  tagline?: string | null;
  size?: 'md' | 'sm';
}

/** The High Noon lockup — display name over a CSS sun glow. */
export function Wordmark({
  kicker = 'HIGH NOON',
  name = 'Quick Draw',
  tagline = 'first to flinch loses',
  size = 'md',
  className = '',
  ...rest
}: WordmarkProps) {
  const cls = ['hn-wordmark', size === 'sm' && 'hn-wordmark--sm', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      <span className="hn-wordmark__sun" />
      {kicker && <span className="hn-wordmark__kicker">{kicker}</span>}
      <span className="hn-wordmark__name">{name}</span>
      {tagline && <span className="hn-wordmark__tag">{tagline}</span>}
    </div>
  );
}
