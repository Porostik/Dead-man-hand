/* Dead Men — table parts: history, round suit, cards, multiplier, shuffle, death */
(function () {
  const e = React.createElement;
  const HN = window.HighNoonQuickDrawDesignSystem_d935db;
  const { SUIT_GLYPH, SUIT_RU, RED, multTone, useCountUp } = window.DM;

  const fmtX = (n) => '×' + n.toFixed(2);

  /* ---------------- history bar ---------------- */
  function HistoryBar({ history, roundSuit }) {
    return e(
      'div',
      { className: 'dm-history' },
      e('span', { className: 'dm-history__lab' }, 'ПРОШЛО'),
      e(
        'div',
        { className: 'dm-history__track' },
        history.length === 0
          ? e('span', { className: 'dm-history__empty' }, '— первый заход —')
          : history.map((h, i) =>
              e(
                'span',
                {
                  key: i,
                  className:
                    'dm-hpill dm-hpill--' +
                    h.tone +
                    (h.cashed ? ' is-cashed' : ''),
                },
                e(
                  'span',
                  {
                    className:
                      'dm-hpill__suit' + (RED[h.suit] ? ' is-red' : ''),
                  },
                  SUIT_GLYPH[h.suit],
                ),
                e('span', { className: 'dm-hpill__x' }, fmtX(h.mult)),
                h.cashed
                  ? e('span', { className: 'dm-hpill__check' }, '✓')
                  : null,
              ),
            ),
      ),
    );
  }

  /* ---------------- round suit (on the board) ---------------- */
  function RoundSuit({ suit }) {
    return e(
      'div',
      { className: 'dm-suittag' + (RED[suit] ? ' is-red' : '') },
      e('span', { className: 'dm-suittag__glyph' }, SUIT_GLYPH[suit]),
      e('span', { className: 'dm-suittag__txt' }, 'масть · ' + SUIT_RU[suit]),
      e('span', { className: 'dm-suittag__bonus' }, '+0.3'),
    );
  }
  function SuitWatermark({ suit }) {
    return e(
      'div',
      { className: 'dm-suitmark' + (RED[suit] ? ' is-red' : '') },
      SUIT_GLYPH[suit],
    );
  }

  /* ---------------- death card ---------------- */
  function DeathCard() {
    return e(
      'div',
      { className: 'dm-death' },
      e(
        'svg',
        {
          viewBox: '0 0 48 56',
          className: 'dm-death__skull',
          'aria-hidden': 'true',
        },
        e('path', {
          d: 'M24 6 C13 6 6 14 6 24 C6 30 9 34 13 37 L14 44 C14 47 17 48 20 48 L28 48 C31 48 34 47 34 44 L35 37 C39 34 42 30 42 24 C42 14 35 6 24 6 Z',
          fill: 'currentColor',
        }),
        e('ellipse', { cx: 16, cy: 25, rx: 5, ry: 6, fill: 'var(--sunken)' }),
        e('ellipse', { cx: 32, cy: 25, rx: 5, ry: 6, fill: 'var(--sunken)' }),
        e('path', { d: 'M24 31 l-3 7 c1 2 5 2 6 0 Z', fill: 'var(--sunken)' }),
        e(
          'g',
          { stroke: 'var(--sunken)', strokeWidth: 1.4 },
          e('line', { x1: 20, y1: 44, x2: 20, y2: 48 }),
          e('line', { x1: 24, y1: 44, x2: 24, y2: 48 }),
          e('line', { x1: 28, y1: 44, x2: 28, y2: 48 }),
        ),
      ),
    );
  }

  /* ---------------- one laid card ---------------- */
  function LaidCard({ card, scatter }) {
    return e(
      'div',
      {
        className:
          'dm-card-wrap' +
          (card.bonus ? ' is-bonus' : '') +
          (scatter ? ' is-scatter' : ''),
        style: scatter
          ? {
              '--sx': (Math.random() * 60 - 30).toFixed(0) + 'px',
              '--sy': (40 + Math.random() * 80).toFixed(0) + 'px',
              '--sr': (Math.random() * 80 - 40).toFixed(0) + 'deg',
            }
          : null,
      },
      e(HN.PlayingCard, {
        rank: card.rank,
        suit: card.suit,
        size: 'sm',
        win: card.bonus,
      }),
      card.bonus ? e('span', { className: 'dm-bonus-tag' }, '+0.3') : null,
    );
  }

  /* ---------------- the laid-out cards ---------------- */
  function TableCards({ cards, layout, busted, scatter }) {
    const { useRef, useEffect } = React;
    const scroller = useRef(null);
    useEffect(() => {
      const el = scroller.current;
      if (el && layout === 'row') el.scrollLeft = el.scrollWidth;
    }, [cards.length, busted, layout]);

    const total = cards.length + (busted ? 1 : 0);

    if (layout === 'arc') {
      const mid = (total - 1) / 2;
      const slot = (i, child) => {
        const off = i - mid;
        const rot = off * 7;
        const ty = Math.abs(off) * Math.abs(off) * 2.0;
        return e(
          'div',
          {
            key: i,
            className: 'dm-arc-slot',
            style: {
              transform: `translateX(${off * 28}px) translateY(${ty}px) rotate(${rot}deg)`,
              zIndex: i,
            },
          },
          child,
        );
      };
      return e(
        'div',
        { className: 'dm-table dm-table--arc' },
        cards.map((c, i) => slot(i, e(LaidCard, { card: c, scatter }))),
        busted ? slot(cards.length, e(DeathCard, null)) : null,
      );
    }

    const cls = 'dm-table dm-table--' + layout;
    let rowStyle = null;
    if (layout === 'row') {
      const n = cards.length + (busted ? 1 : 0);
      const natural = n * 59 - 5;
      let ov = natural > 330 && n > 1 ? (natural - 330) / (n - 1) : 0;
      ov = Math.min(ov, 40);
      rowStyle = { '--sp': (5 - ov).toFixed(1) + 'px' };
    }
    return e(
      'div',
      {
        className: cls,
        ref: layout === 'row' ? scroller : null,
        style: rowStyle,
      },
      cards.map((c) => e(LaidCard, { key: c.id, card: c, scatter })),
      busted ? e(DeathCard, { key: 'death' }) : null,
    );
  }

  /* ---------------- multiplier display ---------------- */
  function MultiplierDisplay({ value, phase, mode, busted }) {
    const shown = value;
    const tone = busted ? 'danger' : multTone(shown);
    if (mode === 'gauge') {
      // log-ish fill, 1x -> 0%, 5x -> 100%
      const pct = Math.max(
        0,
        Math.min(100, (Math.log(shown) / Math.log(6)) * 100),
      );
      return e(
        'div',
        {
          className: 'dm-gauge dm-gauge--' + tone + (busted ? ' is-bust' : ''),
        },
        e('div', { className: 'dm-gauge__val' }, fmtX(shown)),
        e(
          'div',
          { className: 'dm-gauge__bar' },
          ['×5', '×3', '×2', '×1'].map((t) =>
            e('span', { key: t, className: 'dm-gauge__tick' }, t),
          ),
          e(
            'div',
            { className: 'dm-gauge__fill', style: { height: pct + '%' } },
            e('span', { className: 'dm-gauge__spark' }),
          ),
        ),
      );
    }
    return e(
      'div',
      { className: 'dm-mult dm-mult--' + tone + (busted ? ' is-bust' : '') },
      e('span', { className: 'dm-mult__x', key: value }, fmtX(shown)),
      e(
        'span',
        { className: 'dm-mult__lab' },
        busted
          ? 'РАУНД СГОРЕЛ'
          : phase === 'running'
            ? 'множитель растёт'
            : 'готовься',
      ),
    );
  }

  /* ---------------- shuffle stage ---------------- */
  function SkullGlyph(cls) {
    return e(
      'svg',
      { viewBox: '0 0 48 56', className: cls, 'aria-hidden': 'true' },
      e('path', {
        d: 'M24 6 C13 6 6 14 6 24 C6 30 9 34 13 37 L14 44 C14 47 17 48 20 48 L28 48 C31 48 34 47 34 44 L35 37 C39 34 42 30 42 24 C42 14 35 6 24 6 Z',
        fill: 'currentColor',
      }),
      e('ellipse', { cx: 16, cy: 25, rx: 5, ry: 6, fill: 'var(--clay-900)' }),
      e('ellipse', { cx: 32, cy: 25, rx: 5, ry: 6, fill: 'var(--clay-900)' }),
      e('path', { d: 'M24 31 l-3 7 c1 2 5 2 6 0 Z', fill: 'var(--clay-900)' }),
      e(
        'g',
        { stroke: 'var(--clay-900)', strokeWidth: 1.4 },
        e('line', { x1: 20, y1: 44, x2: 20, y2: 48 }),
        e('line', { x1: 24, y1: 44, x2: 24, y2: 48 }),
        e('line', { x1: 28, y1: 44, x2: 28, y2: 48 }),
      ),
    );
  }

  function ShuffleStage({ secs, roundId }) {
    return e(
      'div',
      { className: 'dm-shuffle', key: roundId },
      e(
        'div',
        { className: 'dm-deck' },
        [0, 1, 2, 3, 4].map((i) =>
          e('div', {
            key: i,
            className: 'dm-deck__card hn-pcard hn-pcard--back',
            style: { '--i': i },
          }),
        ),
        e('div', {
          className: 'dm-deck__slot',
          style: { animationDuration: secs + 's' },
        }),
        // the death card flies in and tucks into the deck
        e(
          'div',
          {
            className: 'dm-deck__death',
            style: { animationDuration: secs + 's' },
          },
          SkullGlyph('dm-deck__skull'),
        ),
      ),
      e(
        'div',
        { className: 'dm-shuffle__bar' },
        e('div', {
          className: 'dm-shuffle__fill',
          style: { animationDuration: secs + 's' },
        }),
      ),
    );
  }

  function MascotDeck({ shuffling, busted, secs }) {
    return e(
      'div',
      {
        className:
          'dm-deck2' +
          (shuffling ? ' is-shuffle' : '') +
          (busted ? ' is-busted' : ''),
        style: { '--secs': secs + 's' },
      },
      e('div', { className: 'dm-deck2__glow' }),
      [0, 1, 2, 3, 4, 5].map((i) =>
        e('div', {
          key: i,
          className: 'dm-deck2__card hn-pcard hn-pcard--back',
          style: { '--i': i },
        }),
      ),
      // the death card flies in and tucks into the deck during the shuffle
      e('div', { className: 'dm-deck2__death' }, SkullGlyph('dm-deck2__skull')),
    );
  }

  function ShuffleTimer({ secs, roundId }) {
    const { useState, useEffect } = React;
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
    return e(
      'div',
      { className: 'dm-shuf' },
      e(
        'div',
        { className: 'dm-shuf__row' },
        e('span', { className: 'dm-shuf__lab' }, 'НОВЫЙ РАУНД ЧЕРЕЗ'),
        e('span', { className: 'dm-shuf__time' }, left.toFixed(1) + 'с'),
      ),
      e(
        'div',
        { className: 'dm-shuffle__bar' },
        e('div', {
          className: 'dm-shuffle__fill',
          key: roundId,
          style: { animationDuration: secs + 's' },
        }),
      ),
    );
  }

  Object.assign(window.DM, {
    HistoryBar,
    RoundSuit,
    SuitWatermark,
    MascotDeck,
    TableCards,
    MultiplierDisplay,
    ShuffleStage,
    ShuffleTimer,
    DeathCard,
    fmtX,
  });
})();
