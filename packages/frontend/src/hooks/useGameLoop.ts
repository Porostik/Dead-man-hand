import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { haptic } from '../lib/telegram';

/** Pacing (ms). Feel-tuned placeholders for the free MVP. */
const SHUFFLE_MS = 5000;
const FIRST_CARD_MS = 450;
const PACE_MS = 1500;
const BUST_TO_NEXT_MS = 2600;

/**
 * Drives the round state machine on timers: shuffle → auto-deal → bust → next.
 * Also fires auto-cashout and combo/bust haptics. Mount once in the game screen.
 */
export function useGameLoop(): void {
  const phase = useGameStore((s) => s.phase);
  const roundId = useGameStore((s) => s.roundId);
  const dealtCount = useGameStore((s) => s.dealtCount);
  const start = useGameStore((s) => s.start);
  const deal = useGameStore((s) => s.deal);
  const nextRound = useGameStore((s) => s.nextRound);

  // phase-driven timers
  useEffect(() => {
    if (phase === 'shuffling') {
      const t = setTimeout(start, SHUFFLE_MS);
      return () => clearTimeout(t);
    }
    if (phase === 'running') {
      const first = setTimeout(deal, FIRST_CARD_MS);
      const id = setInterval(deal, PACE_MS);
      return () => {
        clearTimeout(first);
        clearInterval(id);
      };
    }
    if (phase === 'bust') {
      const t = setTimeout(nextRound, BUST_TO_NEXT_MS);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase, roundId, start, deal, nextRound]);

  // auto-cashout
  useEffect(() => {
    const { phase: p, bet, autoEnabled, autoTarget, multiplier, cashout } =
      useGameStore.getState();
    if (p === 'running' && bet?.active && autoEnabled && multiplier >= autoTarget) {
      cashout(true);
    }
  }, [dealtCount]);

  // combo haptics — fire as a combo card lands
  useEffect(() => {
    const card = useGameStore.getState().lastCard;
    if (card?.combo) haptic(card.combo === 'deadmans' ? 'heavy' : 'medium');
  }, [dealtCount]);

  // bust haptic
  useEffect(() => {
    if (phase === 'bust') {
      const lost = useGameStore.getState().lastResult === 'bust';
      haptic(lost ? 'heavy' : 'soft');
    }
  }, [phase]);
}
