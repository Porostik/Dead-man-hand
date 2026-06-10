/* Dead Men — betting controls + cash-out bar */
(function () {
  const e = React.createElement;
  const HN = window.HighNoonQuickDrawDesignSystem_d935db;
  const { useCountUp } = window.DM;

  const QUICK = [
    { v: 0.5, label: '.5' },
    { v: 1, label: '1' },
    { v: 2, label: '2' },
    { v: 5, label: '5' },
  ];

  function ChipBtn({ q, active, disabled, onClick }) {
    return e(
      'button',
      {
        type: 'button',
        className: 'dm-chipbtn' + (active ? ' is-active' : ''),
        disabled,
        onClick,
      },
      e(HN.Chip, { value: q.label, tone: active ? 'gold' : undefined }),
    );
  }

  /* ---------- pre-round betting panel (shuffle window) ---------- */
  function BetPanel({ ctx }) {
    const {
      state,
      actions,
      pending,
      setPending,
      autoEnabled,
      setAutoEnabled,
      autoTarget,
      setAutoTarget,
      betLayout,
      secs,
    } = ctx;
    const placed = !!state.bet;
    const compact = betLayout === 'compact';
    const canAfford =
      pending <= state.balance + (placed ? state.bet.amount : 0);

    const chips = e(
      'div',
      { className: 'dm-chips' },
      QUICK.map((q) =>
        e(ChipBtn, {
          key: q.v,
          q,
          active: Math.abs(pending - q.v) < 0.001,
          disabled: placed,
          onClick: () => setPending(q.v),
        }),
      ),
    );

    const amount = e(
      'div',
      { className: 'dm-amount-wrap' + (compact ? ' is-compact' : '') },
      e(HN.AmountField, {
        value: pending,
        onChange: setPending,
        step: 0.5,
        min: 0.5,
        max: 100,
      }),
    );

    const autoRow = e(
      'div',
      { className: 'dm-auto' },
      e(HN.Switch, {
        checked: autoEnabled,
        onChange: setAutoEnabled,
        label: 'Авто-вывод',
      }),
      e(
        'div',
        { className: 'dm-auto__target' + (autoEnabled ? '' : ' is-off') },
        e(
          'button',
          {
            type: 'button',
            className: 'dm-auto__btn',
            disabled: !autoEnabled,
            onClick: () =>
              setAutoTarget(Math.max(1.1, +(autoTarget - 0.25).toFixed(2))),
          },
          '–',
        ),
        e('span', { className: 'dm-auto__val' }, '×' + autoTarget.toFixed(2)),
        e(
          'button',
          {
            type: 'button',
            className: 'dm-auto__btn',
            disabled: !autoEnabled,
            onClick: () => setAutoTarget(+(autoTarget + 0.25).toFixed(2)),
          },
          '+',
        ),
      ),
    );

    const cta = placed
      ? e(
          HN.Button,
          { variant: 'danger', block: true, onClick: actions.cancelBet },
          'ОТМЕНИТЬ · ◎ ' + state.bet.amount.toFixed(2),
        )
      : e(
          HN.Button,
          {
            block: true,
            disabled: !canAfford,
            onClick: () => actions.placeBet(pending),
          },
          'СТАВКА · ◎ ' + pending.toFixed(2),
        );

    return e(
      'div',
      { className: 'dm-betpanel' + (compact ? ' is-compact' : '') },
      e(
        'div',
        { className: 'dm-betpanel__status' },
        placed
          ? e(
              'span',
              { className: 'dm-status dm-status--in' },
              '✓ Ставка принята · в игре со старта',
            )
          : e(
              'span',
              { className: 'dm-status' },
              'Сделай ставку, пока тасуется колода',
            ),
      ),
      compact
        ? e('div', { className: 'dm-betrow' }, chips, amount)
        : React.createElement(React.Fragment, null, chips, amount),
      autoRow,
      cta,
    );
  }

  /* ---------- in-round cash-out bar ---------- */
  function CashOutBar({ state, actions }) {
    const bet = state.bet;
    const live = bet && bet.active ? bet.amount * state.multiplier : 0;

    if (!bet) {
      return e(
        'div',
        { className: 'dm-cashbar dm-cashbar--idle' },
        e(
          'span',
          { className: 'dm-cashbar__regret-lab' },
          'СТАВКА ◎1 ДАЛА БЫ СЕЙЧАС',
        ),
        e(
          'span',
          { className: 'dm-cashbar__regret-amt' },
          '◎ ' + (1 * state.multiplier).toFixed(2),
        ),
        e(
          'span',
          { className: 'dm-cashbar__idle-s' },
          'депни и не упусти заход',
        ),
      );
    }
    if (!bet.active) {
      return e(
        'div',
        { className: 'dm-cashbar dm-cashbar--done' },
        e(
          'div',
          { className: 'dm-cashbar__done-l' },
          e(
            'span',
            { className: 'dm-cashbar__done-x' },
            '×' + bet.cashedAt.toFixed(2),
          ),
          e(
            'span',
            { className: 'dm-cashbar__done-lab' },
            state.lastAuto ? 'авто-вывод' : 'забрано',
          ),
        ),
        e(
          'span',
          { className: 'dm-cashbar__done-amt' },
          '+◎ ' + (bet.amount * bet.cashedAt).toFixed(2),
        ),
      );
    }
    return e(
      'button',
      { type: 'button', className: 'dm-cashout', onClick: actions.cashout },
      e('span', { className: 'dm-cashout__top' }, 'ЗАБРАТЬ'),
      e('span', { className: 'dm-cashout__amt' }, '◎ ' + live.toFixed(2)),
      e(
        'span',
        { className: 'dm-cashout__x' },
        '×' + state.multiplier.toFixed(2),
      ),
    );
  }

  Object.assign(window.DM, { BetPanel, CashOutBar });
})();
