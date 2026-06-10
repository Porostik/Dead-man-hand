/* Dead Men — liveness layer: live wins ticker, embers, fake-player stream */
(function () {
  const e = React.createElement;
  const { useMemo } = React;
  const HN = window.HighNoonQuickDrawDesignSystem_d935db;
  const { pick } = window.DM;

  const NAMES = [
    '@calamity',
    '@rust_kid',
    '@doc_holiday',
    '@viuda',
    '@sandstorm',
    '@ace_high',
    '@coyote',
    '@belle_star',
    '@django',
    '@sundown',
    '@el_paso',
    '@gunsmoke',
    '@dusty',
    '@mirage',
    '@bandido',
    '@laredo',
    '@silvertongue',
    '@buzzard',
    '@nomad',
    '@reaper',
  ];

  function makeWin() {
    const r = Math.random();
    const mult =
      r < 0.6
        ? 1.3 + Math.random() * 1.6
        : r < 0.9
          ? 2.9 + Math.random() * 2.5
          : 5.5 + Math.random() * 6;
    const stake = pick([0.5, 1, 1, 2, 2, 5, 5, 10]);
    return { name: pick(NAMES), mult, amt: stake * mult };
  }

  function WinItem({ w, big }) {
    return e(
      'span',
      { className: 'dm-tick__item' + (big ? ' is-big' : '') },
      e('span', { className: 'dm-tick__name' }, w.name),
      e('span', { className: 'dm-tick__x' }, '×' + w.mult.toFixed(2)),
      e('span', { className: 'dm-tick__amt' }, '+◎' + w.amt.toFixed(2)),
    );
  }

  function LiveWinsTicker() {
    const wins = useMemo(
      () =>
        Array.from({ length: 16 }).map(() => {
          const w = makeWin();
          return { ...w, big: w.mult > 5 };
        }),
      [],
    );
    const row = (k) =>
      wins.map((w, i) => e(WinItem, { key: k + i, w, big: w.big }));
    return e(
      'div',
      { className: 'dm-tick' },
      e(
        'span',
        { className: 'dm-tick__lab' },
        e(HN.Icon, { name: 'trophy', size: 12 }),
        'ВЫПЛАТЫ',
      ),
      e(
        'div',
        { className: 'dm-tick__vp' },
        e('div', { className: 'dm-tick__track' }, row('a'), row('b')),
      ),
    );
  }

  function Embers({ count }) {
    const items = useMemo(
      () =>
        Array.from({ length: count }).map(() => ({
          left: Math.random() * 100,
          dur: 4.5 + Math.random() * 5,
          delay: Math.random() * 7,
          size: 2 + Math.random() * 3.5,
          drift: Math.random() * 50 - 25,
        })),
      [count],
    );
    if (!count) return null;
    return e(
      'div',
      { className: 'dm-embers' },
      items.map((p, i) =>
        e('span', {
          key: i,
          className: 'dm-ember',
          style: {
            left: p.left + '%',
            width: p.size + 'px',
            height: p.size + 'px',
            '--dur': p.dur + 's',
            '--delay': p.delay + 's',
            '--drift': p.drift + 'px',
          },
        }),
      ),
    );
  }

  Object.assign(window.DM, { LiveWinsTicker, Embers });
})();
