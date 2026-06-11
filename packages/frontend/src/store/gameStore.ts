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
export const SLOT_COUNT = 2;

export type Phase = 'shuffling' | 'running' | 'bust';
export type ResultKind = 'cashed' | 'bust' | 'safe' | null;
export type Tone = 'danger' | 'gold' | 'positive';

/** A placed bet within a slot. Supports partial cash-outs (riding shrinks). */
export interface SlotBet {
  /** Original stake placed this round. */
  amount: number;
  /** Stake fraction still in play (partial cash-out reduces it). */
  riding: number;
  /** Winnings already locked in from partial cash-outs. */
  banked: number;
  /** Last cash-out multiplier (for display). */
  cashedAt: number | null;
  /** Still riding (not fully cashed and not busted). */
  active: boolean;
}

/** One of the (two) independent bet slots — its config + the placed bet. */
export interface Slot {
  stake: number;
  autoEnabled: boolean;
  autoTarget: number;
  bet: SlotBet | null;
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
  slots: Slot[];
  lastResult: ResultKind;
  lastWin: number;
  lastLost: number;
  lastAuto: boolean;
  history: HistoryEntry[];
  flash: number;
  /** Bumped on every cash-out so the screen can pop a win flash. */
  winFlash: number;

  // per-slot config
  setStake: (slot: number, stake: number) => void;
  setAuto: (slot: number, enabled: boolean) => void;
  setAutoTarget: (slot: number, target: number) => void;

  // bet actions (per slot)
  placeBet: (slot: number) => void;
  cancelBet: (slot: number) => void;
  /** Cash out a fraction (default 1 = all) of a slot's riding stake. */
  cashout: (slot: number, frac?: number, auto?: boolean) => void;

  topup: () => void;

  // loop actions (driven by useGameLoop)
  start: () => void;
  deal: () => void;
  nextRound: () => void;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const clampStake = (n: number) => Math.min(100, Math.max(0.5, r2(n)));
const randomSeed = () => (Math.random() * 0xffffffff) >>> 0;
const newRound = (config: GameConfig): Round =>
  createRound(config, mulberry32(randomSeed()));

const toneFor = (m: number): Tone =>
  m < 1.4 ? 'danger' : m < 2.2 ? 'gold' : 'positive';

const initialSlots = (): Slot[] => [
  { stake: 1, autoEnabled: false, autoTarget: 2.0, bet: null },
  { stake: 1, autoEnabled: false, autoTarget: 3.0, bet: null },
];

/** Replace one slot, leaving the others untouched. */
const patchSlot = (slots: Slot[], i: number, patch: Partial<Slot>): Slot[] =>
  slots.map((s, k) => (k === i ? { ...s, ...patch } : s));

export const useGameStore = create<GameState>((set, get) => ({
  config: DEFAULT_CONFIG,
  phase: 'shuffling',
  roundId: 1,
  balance: START_BALANCE,
  round: newRound(DEFAULT_CONFIG),
  dealtCount: 0,
  multiplier: DEFAULT_CONFIG.startMultiplier,
  lastCard: null,
  slots: initialSlots(),
  lastResult: null,
  lastWin: 0,
  lastLost: 0,
  lastAuto: false,
  history: [],
  flash: 0,
  winFlash: 0,

  setStake: (slot, stake) =>
    set((s) => ({ slots: patchSlot(s.slots, slot, { stake: clampStake(stake) }) })),
  setAuto: (slot, autoEnabled) =>
    set((s) => ({ slots: patchSlot(s.slots, slot, { autoEnabled }) })),
  setAutoTarget: (slot, target) =>
    set((s) => ({
      slots: patchSlot(s.slots, slot, { autoTarget: Math.max(1.1, r2(target)) }),
    })),

  placeBet: (slot) => {
    const { phase, slots, balance } = get();
    if (phase !== 'shuffling') return;
    const sl = slots[slot];
    if (!sl || sl.bet) return;
    const amt = Math.min(sl.stake, balance);
    if (amt <= 0) return;
    set({
      balance: r2(balance - amt),
      slots: patchSlot(slots, slot, {
        bet: { amount: amt, riding: amt, banked: 0, cashedAt: null, active: true },
      }),
      lastResult: null,
    });
  },

  cancelBet: (slot) => {
    const { phase, slots, balance } = get();
    if (phase !== 'shuffling') return;
    const sl = slots[slot];
    if (!sl?.bet) return;
    set({
      balance: r2(balance + sl.bet.amount),
      slots: patchSlot(slots, slot, { bet: null }),
    });
  },

  cashout: (slot, frac = 1, auto = false) => {
    const { phase, slots, balance, multiplier, winFlash } = get();
    if (phase !== 'running') return;
    const sl = slots[slot];
    if (!sl?.bet?.active) return;
    const cashAmt = r2(sl.bet.riding * frac);
    if (cashAmt <= 0) return;
    const pay = r2(cashAmt * multiplier);
    const riding = r2(sl.bet.riding - cashAmt);
    const active = riding > 0.004;
    set({
      balance: r2(balance + pay),
      slots: patchSlot(slots, slot, {
        bet: {
          ...sl.bet,
          riding: active ? riding : 0,
          banked: r2(sl.bet.banked + pay),
          cashedAt: multiplier,
          active,
        },
      }),
      lastResult: 'cashed',
      lastWin: pay,
      lastAuto: auto,
      winFlash: winFlash + 1,
    });
  },

  topup: () => set({ balance: r2(get().balance + 10) }),

  start: () => {
    if (get().phase !== 'shuffling') return;
    set({ phase: 'running' });
  },

  deal: () => {
    const { phase, round, dealtCount, multiplier, slots, history, flash } = get();
    if (phase !== 'running') return;

    // dead card lands → settle the round
    if (dealtCount >= round.deadIndex) {
      const burnedRiding = slots.reduce(
        (s, sl) => s + (sl.bet?.active ? sl.bet.riding : 0),
        0,
      );
      const anyBet = slots.some((sl) => sl.bet);
      const anyCashed = slots.some((sl) => sl.bet && sl.bet.cashedAt != null);
      const entry: HistoryEntry = {
        suit: round.roundSuit,
        mult: multiplier,
        tone: toneFor(multiplier),
        cashed: anyCashed,
      };
      set({
        phase: 'bust',
        history: [entry, ...history].slice(0, 14),
        lastResult: burnedRiding > 0 ? 'bust' : anyBet ? 'safe' : null,
        lastLost: r2(burnedRiding),
        flash: flash + 1,
        slots: slots.map((sl) =>
          sl.bet ? { ...sl, bet: { ...sl.bet, active: false } } : sl,
        ),
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
    const { config, roundId, slots } = get();
    set({
      phase: 'shuffling',
      roundId: roundId + 1,
      round: newRound(config),
      dealtCount: 0,
      multiplier: config.startMultiplier,
      lastCard: null,
      slots: slots.map((sl) => ({ ...sl, bet: null })),
    });
  },
}));
