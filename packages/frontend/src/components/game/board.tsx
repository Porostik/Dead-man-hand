import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';
import { PlayingCard, Icon } from '@dmh/ui';
import type { DealtCard, Suit } from '@dmh/engine';
import { SUIT_GLYPH, SUIT_RU, SUIT_RED, COMBO_LABEL, fmtX } from './util';
import type { HistoryEntry } from '../../store/gameStore';

/* ----------------------------------------------------- death skull SVG */
/** The game's own skull (hollow eyes + teeth) — not the generic DS icon. */
function DeathSkull({ className }: { className?: string }) {
  // Pulled verbatim from the mockup (parts.jsx DeathCard).
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden="true">
      <path
        d="M24 6 C13 6 6 14 6 24 C6 30 9 34 13 37 L14 44 C14 47 17 48 20 48 L28 48 C31 48 34 47 34 44 L35 37 C39 34 42 30 42 24 C42 14 35 6 24 6 Z"
        fill="currentColor"
      />
      <ellipse cx="16" cy="25" rx="5" ry="6" fill="var(--sunken)" />
      <ellipse cx="32" cy="25" rx="5" ry="6" fill="var(--sunken)" />
      <path d="M24 31 l-3 7 c1 2 5 2 6 0 Z" fill="var(--sunken)" />
      <g stroke="var(--sunken)" strokeWidth={1.4}>
        <line x1="20" y1="44" x2="20" y2="48" />
        <line x1="24" y1="44" x2="24" y2="48" />
        <line x1="28" y1="44" x2="28" y2="48" />
      </g>
    </svg>
  );
}

/* ----------------------------------------------------------- HistoryBar */
export function HistoryBar({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="dm-history">
      <span className="dm-history__lab">ПРОШЛО</span>
      <div className="dm-history__track">
        {history.length === 0 ? (
          <span className="dm-history__empty">— первый заход —</span>
        ) : (
          history.map((h, i) => (
            <span
              key={i}
              className={`dm-hpill dm-hpill--${h.tone}${h.cashed ? ' is-cashed' : ''}`}
            >
              <span className={`dm-hpill__suit${SUIT_RED[h.suit] ? ' is-red' : ''}`}>
                {SUIT_GLYPH[h.suit]}
              </span>
              <span className="dm-hpill__x">{fmtX(h.mult)}</span>
              {h.cashed && <span className="dm-hpill__check">✓</span>}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ round suit marks */
export function RoundSuit({ suit }: { suit: Suit }) {
  const red = SUIT_RED[suit];
  return (
    <div className={`dm-suittag${red ? ' is-red' : ''}`}>
      <span className="dm-suittag__glyph">{SUIT_GLYPH[suit]}</span>
      <span className="dm-suittag__txt">масть · {SUIT_RU[suit]}</span>
      <span className="dm-suittag__bonus">+0.3</span>
    </div>
  );
}

export function SuitWatermark({ suit }: { suit: Suit }) {
  return (
    <div className={`dm-suitmark${SUIT_RED[suit] ? ' is-red' : ''}`}>
      {SUIT_GLYPH[suit]}
    </div>
  );
}

/* ---------------------------------------------------------- top deck */
export function DeckTop({
  shuffling,
  busted,
  secs,
  deckRef,
}: {
  shuffling: boolean;
  busted: boolean;
  secs: number;
  deckRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={deckRef}
      className={`dm-deck2${shuffling ? ' is-shuffle' : ''}${busted ? ' is-busted' : ''}`}
      style={{ ['--secs' as string]: `${secs}s` }}
    >
      <div className="dm-deck2__glow" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="dm-deck2__card hn-pcard hn-pcard--back"
          style={{ ['--i' as string]: i }}
        />
      ))}
      <div className="dm-deck2__death">
        <DeathSkull className="dm-deck2__skull" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- death card */
export function DeathCard() {
  return (
    <div className="dm-death">
      <DeathSkull className="dm-death__skull" />
    </div>
  );
}

/* ---------------------------------------------------------- laid cards */
const CARD_SLOT = 59; // sm card width + gap
const AVAIL = 360; // usable board width

/** Random fall direction for the bust scatter (down + a little sideways/spin). */
function scatterVars(): CSSProperties {
  return {
    ['--sx' as string]: `${Math.round(Math.random() * 60 - 30)}px`,
    ['--sy' as string]: `${Math.round(40 + Math.random() * 80)}px`,
    ['--sr' as string]: `${Math.round(Math.random() * 80 - 40)}deg`,
  };
}

/** One laid card. On mount it measures the deck's position relative to its own
   slot and flies OUT of the deck into place (vars consumed by dm-deal-out). */
function LaidCard({
  card,
  deckRef,
  highlighted,
  busted,
  scatterStyle,
}: {
  card: DealtCard;
  deckRef?: RefObject<HTMLDivElement | null>;
  highlighted: boolean;
  busted: boolean;
  scatterStyle?: CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const deck = deckRef?.current;
    const fly = flyRef.current;
    if (!wrap || !deck || !fly) return;
    const c = wrap.getBoundingClientRect();
    const d = deck.getBoundingClientRect();
    fly.style.setProperty('--fx', `${d.left + d.width / 2 - (c.left + c.width / 2)}px`);
    fly.style.setProperty('--fy', `${d.top + d.height / 2 - (c.top + c.height / 2)}px`);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={wrapRef}
      className={`dm-card-wrap${card.bonus ? ' is-bonus' : ''}${
        highlighted ? ' is-combo-hit' : ''
      }${busted ? ' is-scatter' : ''}`}
      style={scatterStyle}
    >
      <div className="dm-card-fly" ref={flyRef}>
        <PlayingCard rank={card.rank} suit={card.suit} size="sm" />
      </div>
      {card.bonus && <span className="dm-bonus-tag">+0.3</span>}
    </div>
  );
}

export function TableCards({
  cards,
  busted,
  highlight,
  deckRef,
}: {
  cards: DealtCard[];
  busted: boolean;
  highlight?: Set<number>;
  deckRef?: RefObject<HTMLDivElement | null>;
}) {
  const n = cards.length + (busted ? 1 : 0);
  // when the row outgrows the board, pin to the right so the newest card stays
  // visible and older ones slide off the left (clipped); otherwise centre.
  const fits = n * CARD_SLOT - 5 <= AVAIL;

  // on bust the laid cards scatter down and fade out (stable per card)
  const scatter = useMemo(
    () => (busted ? cards.map(() => scatterVars()) : []),
    [busted], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div
      className="dm-table dm-table--row"
      style={{ justifyContent: fits ? 'center' : 'flex-end' }}
    >
      {cards.map((c, i) => (
        <LaidCard
          key={i}
          card={c}
          deckRef={deckRef}
          highlighted={!!highlight?.has(i)}
          busted={busted}
          scatterStyle={busted ? scatter[i] : undefined}
        />
      ))}
      {busted && <DeathCard />}
    </div>
  );
}

/* ---------------------------------------------------------- combo badge */
export function ComboBadge({ card }: { card: DealtCard | null }) {
  if (!card?.combo) return null;
  const deadmans = card.combo === 'deadmans';
  return (
    <div className={`dm-heatflare${deadmans ? ' dm-heatflare--3' : ''}`}>
      <Icon name={deadmans ? 'skull' : 'flame'} size={14} />
      {COMBO_LABEL[card.combo]}
    </div>
  );
}

/* ---------------------------------------------------- multiplier display */
export function MultiplierDisplay({
  value,
  phase,
  busted,
}: {
  value: number;
  phase: string;
  busted: boolean;
}) {
  const tone = busted
    ? 'danger'
    : value < 1.4
      ? 'danger'
      : value < 2.2
        ? 'gold'
        : 'positive';
  const label = busted
    ? 'РАУНД СГОРЕЛ'
    : phase === 'running'
      ? 'множитель растёт'
      : 'готовься';
  return (
    <div className={`dm-mult dm-mult--${tone}${busted ? ' is-bust' : ''}`}>
      <span className="dm-mult__x" key={value}>
        {fmtX(value)}
      </span>
      <span className="dm-mult__lab">{label}</span>
    </div>
  );
}

/* ---------------------------------------------------------- shuffle timer */
export function ShuffleTimer({ secs, roundId }: { secs: number; roundId: number }) {
  const [left, setLeft] = useState(secs);
  useEffect(() => {
    setLeft(secs);
    const t0 = Date.now();
    const id = setInterval(() => {
      const l = Math.max(0, secs - (Date.now() - t0) / 1000);
      setLeft(l);
      if (l <= 0) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, [secs, roundId]);
  return (
    <div className="dm-shuf">
      <div className="dm-shuf__row">
        <span className="dm-shuf__lab">НОВЫЙ РАУНД ЧЕРЕЗ</span>
        <span className="dm-shuf__time">{left.toFixed(1)}с</span>
      </div>
      <div className="dm-shuffle__bar">
        <div
          className="dm-shuffle__fill"
          key={roundId}
          style={{ animationDuration: `${secs}s` }}
        />
      </div>
    </div>
  );
}
