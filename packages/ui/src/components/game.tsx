import { useEffect, useRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { HN_ICONS } from '../icons';

/* ----------------------------------------------------------- PlayingCard */
export type Suit = 'spade' | 'heart' | 'club' | 'diamond';
export type Rank =
  | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K' | 'A';

const SUIT: Record<Suit, string> = {
  spade: HN_ICONS.spade,
  heart: HN_ICONS.heart,
  club: HN_ICONS.club,
  diamond: HN_ICONS.diamond,
};

/** Court cartouche art: J = hat, Q = horseshoe, K = sheriff star. */
const COURT_ICON: Partial<Record<Rank, string>> = {
  J: HN_ICONS.hat,
  Q: HN_ICONS.horseshoe,
  K: '<path d="M12 3 14.3 8.85 20.6 9.2 15.7 13.2 17.3 19.3 12 15.9 6.7 19.3 8.3 13.2 3.4 9.2 9.7 8.85Z"/><circle cx="12" cy="3" r="1.5"/><circle cx="20.6" cy="9.2" r="1.5"/><circle cx="17.3" cy="19.3" r="1.5"/><circle cx="6.7" cy="19.3" r="1.5"/><circle cx="3.4" cy="9.2" r="1.5"/>',
};

const RED: Partial<Record<Suit, boolean>> = { heart: true, diamond: true };

function Glyph({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}

export interface PlayingCardProps extends HTMLAttributes<HTMLDivElement> {
  rank?: Rank;
  suit?: Suit;
  faceDown?: boolean;
  win?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A High Noon playing card — parchment face, gold edge, bold central read.
 * Number cards show rank + suit; courts (J/Q/K) get a western cartouche;
 * aces a sun-glow emblem.
 */
export function PlayingCard({
  rank = 'A',
  suit = 'spade',
  faceDown = false,
  win = false,
  size = 'md',
  className = '',
  ...rest
}: PlayingCardProps) {
  const cls = [
    'hn-pcard',
    RED[suit] && 'hn-pcard--red',
    size !== 'md' && `hn-pcard--${size}`,
    faceDown && 'hn-pcard--back',
    win && 'hn-pcard--win',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (faceDown) return <div className={cls} {...rest} />;

  const sp = SUIT[suit] || SUIT.spade;
  const ix = (pos: 'tl' | 'br') => (
    <span className={`hn-pcard__ix hn-pcard__ix--${pos}`}>
      <span className="rk">{rank}</span>
      <Glyph path={sp} />
    </span>
  );

  let center;
  if (rank === 'A') {
    center = (
      <>
        <span className="hn-pcard__glow" />
        <div className="hn-pcard__face">
          <Glyph path={sp} className="hn-pcard__ace" />
        </div>
      </>
    );
  } else if (COURT_ICON[rank]) {
    center = (
      <div className="hn-pcard__court">
        <span className="hn-pcard__court-pip t">
          <Glyph path={sp} />
        </span>
        <Glyph path={COURT_ICON[rank] as string} className="hn-pcard__court-ic" />
        <span className="hn-pcard__court-l">{rank}</span>
        <span className="hn-pcard__court-pip b">
          <Glyph path={sp} />
        </span>
      </div>
    );
  } else {
    center = (
      <>
        <span className="hn-pcard__halo" />
        <div className="hn-pcard__face">
          <span className={'hn-pcard__num' + (String(rank).length > 1 ? ' two' : '')}>
            {rank}
          </span>
          <Glyph path={sp} className="hn-pcard__s" />
        </div>
      </>
    );
  }

  return (
    <div className={cls} {...rest}>
      {ix('tl')}
      {center}
      {ix('br')}
    </div>
  );
}

/* ---------------------------------------------------------------- Chip */
export interface ChipProps {
  value?: React.ReactNode;
  tone?: 'gold' | 'turq';
  size?: 'sm' | 'md';
}

/** Betting chip. */
export function Chip({ value, tone, size = 'md' }: ChipProps) {
  const cls = ['hn-chip', tone && `hn-chip--${tone}`, size === 'sm' && 'hn-chip--sm']
    .filter(Boolean)
    .join(' ');
  return <span className={cls}>{value}</span>;
}

/* ---------------------------------------------------------------- Coin */
const TON_MARK = '<path d="M12 4 19 12 12 20 5 12Z"/>';

export interface CoinProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'silver' | 'rust';
  size?: 'sm' | 'md' | 'lg';
  /** Show the TON mark in the center. */
  mark?: boolean;
  /** Optional count badge. */
  count?: React.ReactNode;
}

/** Stylised TON token / coin. Gold by default; silver & rust tiers. */
export function Coin({
  tone,
  size = 'md',
  mark = true,
  count,
  className = '',
  style,
  ...rest
}: CoinProps) {
  const cls = [
    'hn-coin',
    tone && `hn-coin--${tone}`,
    size !== 'md' && `hn-coin--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} style={style} {...rest}>
      {mark && (
        <svg
          className="hn-coin__mark"
          viewBox="0 0 24 24"
          fill="currentColor"
          dangerouslySetInnerHTML={{ __html: TON_MARK }}
        />
      )}
      {count != null && <span className="hn-coin__count">{count}</span>}
    </span>
  );
}

/* ------------------------------------------------------------- PotPile */
export interface PotPileProps extends HTMLAttributes<HTMLDivElement> {
  amount?: React.ReactNode;
  count?: number;
  tone?: 'gold' | 'silver' | 'rust';
  unit?: string;
  label?: string;
}

/** A stacked pile of coins with a pot tag — the staked bank. */
export function PotPile({
  amount,
  count = 4,
  tone = 'gold',
  unit = 'TON',
  label = 'POT',
  className = '',
  ...rest
}: PotPileProps) {
  const n = Math.max(1, Math.min(count, 7));
  const step = 7;
  const coinTone = tone === 'gold' ? undefined : tone;
  return (
    <div className={['hn-pot', className].filter(Boolean).join(' ')} {...rest}>
      <div
        className="hn-pot__stack"
        style={{ width: 52, height: 46 + (n - 1) * step }}
      >
        <div className="hn-pot__glow" />
        {Array.from({ length: n }).map((_, i) => (
          <Coin
            key={i}
            tone={coinTone}
            mark={i === n - 1}
            style={{ bottom: i * step, zIndex: i }}
          />
        ))}
      </div>
      {amount != null && (
        <span className="hn-pottag">
          ★ {label} {amount} {unit}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ AmmoMeter */
const BULLET =
  '<path d="M12 2.2c2.1 0 3.6 2.3 3.6 5.4V10H8.4V7.6C8.4 4.5 9.9 2.2 12 2.2Z"/><path d="M8.2 11h7.6v8.4a2 2 0 01-2 2h-3.6a2 2 0 01-2-2Z"/>';

export interface AmmoMeterProps extends HTMLAttributes<HTMLDivElement> {
  total?: number;
  /** Number of won (loaded) rounds. */
  won?: number;
  /** Index of the live (current) round, or -1. */
  live?: number;
  size?: number;
}

/** Row of bullets tracking rounds in a best-of-N duel. */
export function AmmoMeter({
  total = 3,
  won = 0,
  live = -1,
  size = 22,
  className = '',
  ...rest
}: AmmoMeterProps) {
  return (
    <div className={['hn-ammo', className].filter(Boolean).join(' ')} {...rest}>
      {Array.from({ length: total }).map((_, i) => {
        const state = i === live ? 'live' : i < won ? '' : 'spent';
        return (
          <svg
            key={i}
            className={['hn-ammo__slot', state && `hn-ammo__slot--${state}`]
              .filter(Boolean)
              .join(' ')}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            dangerouslySetInnerHTML={{ __html: BULLET }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ FuseTimer */
export interface FuseTimerProps {
  seconds?: number;
  running?: boolean;
  onEnd?: () => void;
}

/** Burning-fuse turn timer. Set `running` to start the burn. */
export function FuseTimer({ seconds = 10, running = false, onEnd }: FuseTimerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!running || !onEnd) return undefined;
    const t = setTimeout(onEnd, seconds * 1000);
    return () => clearTimeout(t);
  }, [running, seconds, onEnd]);
  return (
    <div
      ref={ref}
      className={['hn-fuse', running && 'hn-fuse--run'].filter(Boolean).join(' ')}
      style={{ '--fuse-dur': `${seconds}s` } as CSSProperties}
    >
      <div className="hn-fuse__fill" />
      <span className="hn-fuse__spark" />
    </div>
  );
}

/* --------------------------------------------------------------- Avatar */
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  gold?: boolean;
  active?: boolean;
}

/** Player avatar — initials or image, optional gold frame and active ring. */
export function Avatar({
  name = '',
  src,
  size = 'md',
  gold = false,
  active = false,
}: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const cls = [
    'hn-avatar',
    size !== 'md' && `hn-avatar--${size}`,
    gold && 'hn-avatar--gold',
    active && 'hn-avatar--active',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={cls} aria-label={name}>
      {src ? <img src={src} alt={name} /> : initials || '?'}
      <span className="hn-avatar__ring" />
    </span>
  );
}
