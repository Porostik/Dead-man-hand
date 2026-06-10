/* Dead Men — game engine (reducer + timer driver) */
(function () {
  const { useReducer, useEffect, useRef, useCallback } = React;
  const { newRound, r2 } = window.DM;

  const START_BALANCE = 25.0;

  function init() {
    const round = newRound();
    return {
      phase: 'shuffling', // shuffling | running | bust
      roundId: 1,
      balance: START_BALANCE,
      roundSuit: round.roundSuit,
      sequence: round.sequence,
      deadIndex: round.deadIndex,
      cards: [], // laid this round
      dealtCount: 0,
      multiplier: 1.0,
      bet: null, // { amount, active, cashedAt }
      lastResult: null, // 'cashed' | 'bust' | 'safe' | null
      lastWin: 0,
      lastLost: 0,
      history: [], // [{ suit, mult, tone, cashed }]
      flash: 0, // bump to trigger bust shake
    };
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'START':
        if (state.phase !== 'shuffling') return state;
        return { ...state, phase: 'running' };

      case 'DEAL': {
        if (state.phase !== 'running') return state;
        // death card lands
        if (state.dealtCount >= state.deadIndex) {
          const burned = state.bet && state.bet.active;
          const tone =
            state.multiplier < 1.4
              ? 'danger'
              : state.multiplier < 2.2
                ? 'gold'
                : 'positive';
          const hist = [
            {
              suit: state.roundSuit,
              mult: state.multiplier,
              tone,
              cashed: state.bet && state.bet.cashedAt != null,
            },
            ...state.history,
          ].slice(0, 14);
          return {
            ...state,
            phase: 'bust',
            history: hist,
            lastResult: burned ? 'bust' : state.bet ? 'safe' : null,
            lastLost: burned ? state.bet.amount : 0,
            flash: state.flash + 1,
          };
        }
        const card = state.sequence[state.dealtCount];
        return {
          ...state,
          cards: [...state.cards, card],
          dealtCount: state.dealtCount + 1,
          multiplier: r2(state.multiplier + card.contrib),
        };
      }

      case 'PLACE_BET': {
        if (state.phase !== 'shuffling' || state.bet) return state;
        const amt = Math.min(action.amount, state.balance);
        if (amt <= 0) return state;
        return {
          ...state,
          balance: r2(state.balance - amt),
          bet: { amount: amt, active: true, cashedAt: null },
          lastResult: null,
        };
      }

      case 'CANCEL_BET': {
        if (state.phase !== 'shuffling' || !state.bet) return state;
        return {
          ...state,
          balance: r2(state.balance + state.bet.amount),
          bet: null,
        };
      }

      case 'CASHOUT': {
        if (state.phase !== 'running' || !state.bet || !state.bet.active)
          return state;
        const win = r2(state.bet.amount * state.multiplier);
        return {
          ...state,
          balance: r2(state.balance + win),
          bet: { ...state.bet, active: false, cashedAt: state.multiplier },
          lastResult: 'cashed',
          lastWin: win,
          lastAuto: !!action.auto,
        };
      }

      case 'NEXT_ROUND': {
        const round = newRound();
        return {
          ...state,
          phase: 'shuffling',
          roundId: state.roundId + 1,
          roundSuit: round.roundSuit,
          sequence: round.sequence,
          deadIndex: round.deadIndex,
          cards: [],
          dealtCount: 0,
          multiplier: 1.0,
          bet: null,
        };
      }

      case 'TOPUP':
        return { ...state, balance: r2(state.balance + 10) };

      default:
        return state;
    }
  }

  function useGame(config) {
    const [state, dispatch] = useReducer(reducer, undefined, init);
    const cfgRef = useRef(config);
    cfgRef.current = config;

    // engine: react to phase
    useEffect(() => {
      const { pace, shuffleSecs } = cfgRef.current;
      if (state.phase === 'shuffling') {
        const t = setTimeout(
          () => dispatch({ type: 'START' }),
          shuffleSecs * 1000,
        );
        return () => clearTimeout(t);
      }
      if (state.phase === 'running') {
        // first card lands quickly, then on pace
        const first = setTimeout(() => dispatch({ type: 'DEAL' }), 450);
        const id = setInterval(() => dispatch({ type: 'DEAL' }), pace * 1000);
        return () => {
          clearTimeout(first);
          clearInterval(id);
        };
      }
      if (state.phase === 'bust') {
        const t = setTimeout(() => dispatch({ type: 'NEXT_ROUND' }), 2600);
        return () => clearTimeout(t);
      }
      return undefined;
    }, [state.phase, state.roundId]);

    // auto cash-out
    const auto = config.autoEnabled ? config.autoTarget : null;
    useEffect(() => {
      if (
        state.phase === 'running' &&
        state.bet &&
        state.bet.active &&
        auto &&
        state.multiplier >= auto
      ) {
        dispatch({ type: 'CASHOUT', auto: true });
      }
    }, [state.multiplier, state.phase, auto]);

    const actions = {
      placeBet: useCallback(
        (amount) => dispatch({ type: 'PLACE_BET', amount }),
        [],
      ),
      cancelBet: useCallback(() => dispatch({ type: 'CANCEL_BET' }), []),
      cashout: useCallback(() => dispatch({ type: 'CASHOUT' }), []),
      topup: useCallback(() => dispatch({ type: 'TOPUP' }), []),
    };

    return [state, actions];
  }

  window.DM.useGame = useGame;
})();
