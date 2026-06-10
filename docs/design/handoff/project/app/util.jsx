/* Dead Men — shared constants & helpers */
window.DM = window.DM || {};
(function () {
  const SUITS = ['spade', 'heart', 'club', 'diamond'];
  const SUIT_GLYPH = { spade: '♠', heart: '♥', club: '♣', diamond: '♦' };
  const SUIT_RU = {
    spade: 'ПИКИ',
    heart: 'ЧЕРВИ',
    club: 'ТРЕФЫ',
    diamond: 'БУБНЫ',
  };
  const RED = { heart: true, diamond: true };
  const RANKS = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];
  // weight (multiplier add) per rank — slow steady climb
  const COURT_W = { J: 0.13, Q: 0.16, K: 0.2, A: 0.28 };
  const SUIT_BONUS = 0.3;

  const r2 = (n) => Math.round(n * 100) / 100;
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const weight = (rank) =>
    COURT_W[rank] != null ? COURT_W[rank] : Number(rank) * 0.01;

  // how many SAFE cards land before the death card — escalating hazard
  function rollDeathPos() {
    let pos = 1;
    while (pos < 26) {
      const hazard = Math.min(0.07 + pos * 0.02, 0.33);
      if (Math.random() < hazard) break;
      pos += 1;
    }
    return pos;
  }

  function newRound() {
    const roundSuit = pick(SUITS);
    const deadIndex = rollDeathPos();
    let mult = 1;
    const sequence = [];
    for (let i = 0; i < deadIndex; i += 1) {
      const rank = pick(RANKS);
      const suit = pick(SUITS);
      const bonus = suit === roundSuit;
      const contrib = r2(weight(rank) + (bonus ? SUIT_BONUS : 0));
      sequence.push({
        rank,
        suit,
        bonus,
        contrib,
        id: Math.random().toString(36).slice(2),
      });
      mult = r2(mult + contrib);
    }
    return { roundSuit, sequence, deadIndex, finalMult: mult };
  }

  function multTone(m) {
    if (m < 1.4) return 'danger';
    if (m < 2.2) return 'gold';
    return 'positive';
  }

  // count-up tween hook
  function useCountUp(target, dur) {
    const { useState, useEffect, useRef } = React;
    const D = dur || 480;
    const [val, setVal] = useState(target);
    const ref = useRef(target);
    useEffect(() => {
      const from = ref.current;
      const to = target;
      if (from === to) return undefined;
      const t0 = performance.now();
      let raf = 0;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / D);
        const e = 1 - Math.pow(1 - p, 3);
        const cur = from + (to - from) * e;
        ref.current = cur;
        setVal(cur);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [target, D]);
    return val;
  }

  Object.assign(window.DM, {
    SUITS,
    SUIT_GLYPH,
    SUIT_RU,
    RED,
    RANKS,
    SUIT_BONUS,
    r2,
    pick,
    weight,
    rollDeathPos,
    newRound,
    multTone,
    useCountUp,
  });
})();
