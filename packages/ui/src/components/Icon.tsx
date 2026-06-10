import type { CSSProperties, SVGProps } from 'react';
import { HN_ICONS, type IconName } from '../icons';

export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> {
  /** Glyph name from the western icon set. */
  name: IconName;
  /** Pixel size (width = height). */
  size?: number;
  /** Accessible label. When set, the icon is exposed to AT; otherwise hidden. */
  title?: string;
}

/** Inline western icon. `name` keys into HN_ICONS; tints via CSS `color`. */
export function Icon({
  name,
  size = 20,
  title,
  className = '',
  style,
  ...rest
}: IconProps) {
  const inner = HN_ICONS[name] ?? HN_ICONS.star;
  const baseStyle: CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    flex: '0 0 auto',
    ...style,
  };
  return (
    <svg
      className={['hn-icon', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={baseStyle}
      dangerouslySetInnerHTML={{ __html: inner }}
      {...rest}
    />
  );
}
