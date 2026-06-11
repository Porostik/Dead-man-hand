import { useEffect, useRef, useState } from 'react';
import type { DealtCard } from '@dmh/engine';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { haptic } from '../lib/telegram';
import { fmtCoin, fmtX } from '../components/game/util';
import {
  HistoryBar,
  RoundSuit,
  SuitWatermark,
  Embers,
  DeckTop,
  TableCards,
  ComboBadge,
  MultiplierDisplay,
  ShuffleTimer,
} from '../components/game/board';
import { BetPanel, CashOutBar } from '../components/game/bet';
import { SettingsDrawer } from '../components/game/SettingsDrawer';
import { RuleSlides } from '../components/game/rules';
import { Icon, Drawer } from '@dmh/ui';

const SHUFFLE_SECS = 5;

/** Indices of the cards that make up the combo the last card just completed. */
function comboIndices(cards: DealtCard[]): Set<number> {
  const out = new Set<number>();
  const i = cards.length - 1;
  const last = cards[i];
  if (!last?.combo) return out;
  if (last.combo === 'set' || last.combo === 'pair') {
    for (let k = i; k >= 0 && cards[k].rank === last.rank; k--) out.add(k);
  } else if (last.combo === 'straight') {
    for (let k = Math.max(0, i - 2); k <= i; k++) out.add(k);
  } else if (last.combo === 'flush') {
    for (let k = i; k >= 0 && cards[k].suit === last.suit; k--) out.add(k);
  } else if (last.combo === 'deadmans') {
    cards.forEach((c, k) => (c.rank === 'A' || c.rank === '8') && out.add(k));
  }
  return out;
}

export function GameScreen() {
  useGameLoop();

  const phase = useGameStore((s) => s.phase);
  const roundId = useGameStore((s) => s.roundId);
  const balance = useGameStore((s) => s.balance);
  const round = useGameStore((s) => s.round);
  const dealtCount = useGameStore((s) => s.dealtCount);
  const multiplier = useGameStore((s) => s.multiplier);
  const lastCard = useGameStore((s) => s.lastCard);
  const slots = useGameStore((s) => s.slots);
  const winFlash = useGameStore((s) => s.winFlash);
  const lastResult = useGameStore((s) => s.lastResult);
  const lastLost = useGameStore((s) => s.lastLost);
  const history = useGameStore((s) => s.history);
  const flash = useGameStore((s) => s.flash);
  const topup = useGameStore((s) => s.topup);

  const busted = phase === 'bust';
  const shuffling = phase === 'shuffling';
  const lowBalance = balance < 0.5;
  const cards = round.sequence.slice(0, dealtCount);
  const bankedTotal = slots.reduce((s, sl) => s + (sl.bet?.banked ?? 0), 0);

  const heatTier = busted
    ? 0
    : multiplier >= 4.5
      ? 3
      : multiplier >= 2.5
        ? 2
        : multiplier >= 1.6
          ? 1
          : 0;

  // screen shake on bust
  const [shake, setShake] = useState(false);
  useEffect(() => {
    if (flash === 0) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 620);
    return () => clearTimeout(t);
  }, [flash]);

  // win flash — pops on each cash-out (bumped via the winFlash counter)
  const [win, setWin] = useState<{ amt: number; x: number } | null>(null);
  useEffect(() => {
    if (winFlash === 0) return;
    const st = useGameStore.getState();
    if (st.phase === 'bust') return;
    setWin({ amt: st.lastWin, x: st.multiplier });
    const t = setTimeout(() => setWin(null), 1600);
    return () => clearTimeout(t);
  }, [winFlash]);

  // combo: highlight the contributing cards (~2s) + a little screen nudge.
  // The clear timer lives in a ref so it survives subsequent (non-combo) deals
  // — otherwise the highlight would never clear and cards would stay lit.
  const [highlight, setHighlight] = useState<Set<number>>(new Set());
  const [nudge, setNudge] = useState(false);
  const clearHl = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const nudgeOff = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const deckRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!lastCard?.combo) return;
    const idx = comboIndices(round.sequence.slice(0, dealtCount));
    // celebrate once the card has landed (~deal animation), not at t=0
    const t = setTimeout(() => {
      setHighlight(idx);
      setNudge(true);
      clearTimeout(nudgeOff.current);
      nudgeOff.current = setTimeout(() => setNudge(false), 420);
      clearTimeout(clearHl.current);
      clearHl.current = setTimeout(() => setHighlight(new Set()), 1800);
    }, 320);
    return () => clearTimeout(t);
  }, [dealtCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // a fresh round starts with no highlight
  useEffect(() => setHighlight(new Set()), [roundId]);

  const onTopup = () => {
    haptic('light');
    topup();
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const feltClass = ['dm-felt', busted && 'is-bust', heatTier && `is-heat-${heatTier}`]
    .filter(Boolean)
    .join(' ');
  const appClass = ['dm-app', 'dm-app--live', shake && 'dm-shake', nudge && 'dm-nudge']
    .filter(Boolean)
    .join(' ');

  return (
    <main className={appClass}>
      {/* header */}
      <header className="dm-header">
        <button
          type="button"
          className={`dm-balance dm-balance--mini${lowBalance ? ' is-low' : ''}`}
          onClick={lowBalance ? onTopup : undefined}
        >
          <span className="dm-balance__val">{fmtCoin(balance)}</span>
          <span className="dm-balance__unit">{lowBalance ? '+10' : '◎'}</span>
        </button>

        <div className="dm-wordmark">
          <span className="dm-wordmark__main">DEAD MEN</span>
          <span className="dm-wordmark__main">HAND</span>
        </div>

        <div className="dm-header__right">
          <button
            type="button"
            className="dm-chat"
            aria-label="Настройки"
            onClick={() => {
              haptic('light');
              setSettingsOpen(true);
            }}
          >
            <Icon name="gear" size={18} />
          </button>
          <button type="button" className="dm-chat" aria-label="Чат">
            <svg
              viewBox="0 0 24 24"
              width={18}
              height={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
            </svg>
          </button>
        </div>
      </header>

      <HistoryBar history={history} />

      {/* board */}
      <section className={feltClass}>
        <div className="dm-felt__sun" />
        <Embers />
        <SuitWatermark suit={round.roundSuit} />
        <RoundSuit suit={round.roundSuit} />
        <DeckTop
          shuffling={shuffling}
          busted={busted}
          secs={SHUFFLE_SECS}
          deckRef={deckRef}
        />
        <div className="dm-felt__mascot" />

        <div
          className={`dm-stage${shuffling ? ' dm-stage--shuffle' : ' dm-stage--center'}`}
        >
          {shuffling ? (
            <ShuffleTimer secs={SHUFFLE_SECS} roundId={roundId} />
          ) : (
            <>
              <div className="dm-comboslot">
                {!busted && <ComboBadge card={lastCard} />}
              </div>
              <div className="dm-stage__cards">
                <TableCards
                  cards={cards}
                  busted={busted}
                  highlight={phase === 'running' ? highlight : undefined}
                  deckRef={deckRef}
                />
              </div>
              {!busted && (
                <div className="dm-multgroup">
                  <MultiplierDisplay value={multiplier} phase={phase} busted={false} />
                </div>
              )}
            </>
          )}
        </div>

        {busted && <div className="dm-redflash" key={flash} />}

        {busted && (
          <div className="dm-bust is-full">
            <div className="dm-bust__banner">
              <div className="dm-bust__word">BUST</div>
              <div className="dm-bust__final">{fmtX(multiplier)}</div>
              {(lastResult === 'bust' || lastResult === 'safe') && (
                <div
                  className={`dm-bust__sub${lastResult === 'bust' ? ' is-bad' : ' is-good'}`}
                >
                  {lastResult === 'bust'
                    ? `− ◎ ${fmtCoin(lastLost)} сгорело`
                    : `ты успел выйти · + ◎ ${fmtCoin(bankedTotal)}`}
                </div>
              )}
            </div>
          </div>
        )}

        {win && !busted && (
          <div className="dm-winflash" key={winFlash}>
            <div className="dm-wincard">
              <div className="dm-wincard__amt">+◎ {fmtCoin(win.amt)}</div>
              <div className="dm-wincard__x">{fmtX(win.x)} · ЗАБРАНО</div>
            </div>
          </div>
        )}
      </section>

      {/* bottom */}
      <section className="dm-bottom">{shuffling ? <BetPanel /> : <CashOutBar />}</section>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onRules={() => {
          setSettingsOpen(false);
          setRulesOpen(true);
        }}
      />
      <Drawer open={rulesOpen} onClose={() => setRulesOpen(false)} side="top">
        <RuleSlides onDone={() => setRulesOpen(false)} doneLabel="Понятно" />
      </Drawer>
    </main>
  );
}
