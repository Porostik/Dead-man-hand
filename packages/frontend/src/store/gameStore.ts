import { create } from 'zustand';
import {
  type GameConfig,
  type Round,
  type DealtCard,
  type Suit,
  DEFAULT_CONFIG,
  createRound,
  mulberry32,
} from '@dmh/engine';

const START_BALANCE = 25.0;

export type Phase = 'shuffling' | 'running' | 'bust';
export type ResultKind = 'cashed' | 'bust' | 'safe' | null;
export type Tone = 'danger' | 'gold' | 'positive';

export interface Bet {
  amount: number;
  active: boolean;
  cashedAt: number | null;
}

export interface HistoryEntry {
  suit: Suit;
  mult: number;
  tone: Tone;
  cashed: boolean;
}

interface GameState {
  config: GameConfig;
  phase: Phase;
  roundId: number;
  balance: number;
  round: Round;
  dealtCount: number;
  multiplier: number;
  lastCard: DealtCard | null;
  bet: Bet | null;
  lastResult: ResultKind;
  lastWin: number;
  lastLost: number;
  lastAuto: boolean;
  history: HistoryEntry[];
  flash: number;
  /** The stake the player has selected (persists across rounds). */
  stake: number;
  autoEnabled: boolean;
  autoTarget: number;

  // bet actions
  setStake: (stake: number) => void;
  placeBet: (amount: number) => void;
  cancelBet: () => void;
  cashout: (auto?: boolean) => void;
  topup: () => void;
  setAuto: (enabled: boolean) => void;
  setAutoTarget: (target: number) => void;

  // loop actions (driven by useGameLoop)
  start: () => void;
  deal: () => void;
  nextRound: () => void;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const randomSeed = () => (Math.random() * 0xffffffff) >>> 0;
const newRound = (config: GameConfig): Round =>
  createRound(config, mulberry32(randomSeed()));

const toneFor = (m: number): Tone =>
  m < 1.4 ? 'danger' : m < 2.2 ? 'gold' : 'positive';

export const useGameStore = create<GameState>((set, get) => ({
  config: DEFAULT_CONFIG,
  phase: 'shuffling',
  roundId: 1,
  balance: START_BALANCE,
  round: newRound(DEFAULT_CONFIG),
  dealtCount: 0,
  multiplier: DEFAULT_CONFIG.startMultiplier,
  lastCard: null,
  bet: null,
  lastResult: null,
  lastWin: 0,
  lastLost: 0,
  lastAuto: false,
  history: [],
  flash: 0,
  stake: 1,
  autoEnabled: false,
  autoTarget: 2.0,

  setStake: (stake) => set({ stake: Math.min(100, Math.max(0.5, r2(stake))) }),

  placeBet: (amount) => {
    const { phase, bet, balance } = get();
    if (phase !== 'shuffling' || bet) return;
    const amt = Math.min(amount, balance);
    if (amt <= 0) return;
    set({
      balance: r2(balance - amt),
      bet: { amount: amt, active: true, cashedAt: null },
      lastResult: null,
    });
  },

  cancelBet: () => {
    const { phase, bet, balance } = get();
    if (phase !== 'shuffling' || !bet) return;
    set({ balance: r2(balance + bet.amount), bet: null });
  },

  cashout: (auto = false) => {
    const { phase, bet, balance, multiplier } = get();
    if (phase !== 'running' || !bet || !bet.active) return;
    const win = r2(bet.amount * multiplier);
    set({
      balance: r2(balance + win),
      bet: { ...bet, active: false, cashedAt: multiplier },
      lastResult: 'cashed',
      lastWin: win,
      lastAuto: auto,
    });
  },

  topup: () => set({ balance: r2(get().balance + 10) }),

  setAuto: (autoEnabled) => set({ autoEnabled }),
  setAutoTarget: (autoTarget) =>
    set({ autoTarget: Math.max(1.1, r2(autoTarget)) }),

  start: () => {
    if (get().phase !== 'shuffling') return;
    set({ phase: 'running' });
  },

  deal: () => {
    const { phase, round, dealtCount, multiplier, bet, history, flash } = get();
    if (phase !== 'running') return;

    // dead card lands
    if (dealtCount >= round.deadIndex) {
      const burned = !!(bet && bet.active);
      const entry: HistoryEntry = {
        suit: round.roundSuit,
        mult: multiplier,
        tone: toneFor(multiplier),
        cashed: !!(bet && bet.cashedAt != null),
      };
      set({
        phase: 'bust',
        history: [entry, ...history].slice(0, 14),
        lastResult: burned ? 'bust' : bet ? 'safe' : null,
        lastLost: burned && bet ? bet.amount : 0,
        flash: flash + 1,
      });
      return;
    }

    const card = round.sequence[dealtCount];
    set({
      dealtCount: dealtCount + 1,
      multiplier: card.multiplier,
      lastCard: card,
    });
  },

  nextRound: () => {
    const { config, roundId } = get();
    set({
      phase: 'shuffling',
      roundId: roundId + 1,
      round: newRound(config),
      dealtCount: 0,
      multiplier: config.startMultiplier,
      lastCard: null,
      bet: null,
    });
  },
}));
