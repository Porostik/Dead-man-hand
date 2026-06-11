import coins from '../../assets/items/coins.png';
import chips from '../../assets/items/chips.png';
import ring from '../../assets/items/ring.png';
import bullets from '../../assets/items/bullets.png';
import badge from '../../assets/items/sheriff-badge.png';

const SRC = { coins, chips, ring, bullets, badge } as const;

export type ItemName = keyof typeof SRC;

/**
 * Generated gold-on-black art assets, shown in a dark medallion so the near-black
 * background of the source PNG blends seamlessly on any backdrop (no alpha needed).
 * Disc-shaped subjects (coins/chips) get a circle; the rest a rounded tile.
 */
export function ItemIcon({
  name,
  size,
  className,
}: {
  name: ItemName;
  /** Explicit px size. Omit to let CSS control the box (felt props, /kit tiles). */
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`dm-item dm-item--${name}${className ? ` ${className}` : ''}`}
      style={size ? { width: size, height: size } : undefined}
      aria-hidden="true"
    >
      <img src={SRC[name]} alt="" draggable={false} />
    </span>
  );
}
