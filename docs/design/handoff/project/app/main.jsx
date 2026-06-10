/* Dead Men — app shell, composition & tweaks */
(function () {
  const e = React.createElement;
  const { useState, useEffect, useRef } = React;
  const HN = window.HighNoonQuickDrawDesignSystem_d935db;
  const DM = window.DM;

  const LAYOUT_MAP = { Ряд: 'row', Сетка: 'grid', Веер: 'arc' };
  const MASCOT_MAP = { Рука: 'hand', Арт: 'art', Нет: 'none' };
  const MULT_MAP = { 'По центру': 'center', Сбоку: 'gauge' };
  const DRAMA_MAP = { Полная: 'full', Сдержанная: 'contained' };
  const BET_MAP = { Полная: 'full', Компактная: 'compact' };
  const ENERGY = {
    Спокойно: { ticker: false, embers: 0, heat: false, bonus: false },
    Живо: { ticker: true, embers: 9, heat: true, bonus: true },
    Хайп: { ticker: true, embers: 18, heat: true, bonus: true, hype: true },
  };

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
    startScreen: 'Онбординг',
    skin: 'Матовый',
    fonts: 'Гротеск',
    cardLayout: 'Ряд',
    mascot: 'Рука',
    multiplier: 'По центру',
    deathDrama: 'Полная',
    betLayout: 'Полная',
    energy: 'Живо',
    pace: 1.5,
    shuffleSecs: 5,
  }; /*EDITMODE-END*/

  function App() {
    const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
    const layout = LAYOUT_MAP[t.cardLayout] || 'row';
    const mascot = MASCOT_MAP[t.mascot] || 'hand';
    const multMode = MULT_MAP[t.multiplier] || 'center';
    const drama = DRAMA_MAP[t.deathDrama] || 'full';
    const betLayout = BET_MAP[t.betLayout] || 'full';
    const dramaFull = drama === 'full';
    const fontClass =
      t.fonts === 'Чистый'
        ? ' font-clean'
        : t.fonts === 'Слаб'
          ? ' font-slab'
          : '';

    const [pending, setPending] = useState(1);
    const [autoEnabled, setAutoEnabled] = useState(false);
    const [autoTarget, setAutoTarget] = useState(2.0);

    // first-launch onboarding gate
    const [onboarded, setOnboarded] = useState(() => {
      try {
        return localStorage.getItem('dm_onboarded') === '1';
      } catch (err) {
        return false;
      }
    });
    const showOnb = t.startScreen === 'Онбординг' || !onboarded;
    const onDone = (nick) => {
      try {
        localStorage.setItem('dm_onboarded', '1');
        localStorage.setItem('dm_nick', nick);
      } catch (err) {
        /* ignore */
      }
      setOnboarded(true);
      setTweak('startScreen', 'Игра');
    };

    const [state, actions] = DM.useGame({
      pace: t.pace,
      shuffleSecs: t.shuffleSecs,
      autoEnabled,
      autoTarget,
    });

    const busted = state.phase === 'bust';
    const running = state.phase === 'running';
    const shuffling = state.phase === 'shuffling';

    // bust shake
    const [shake, setShake] = useState(false);
    useEffect(() => {
      if (state.flash > 0 && dramaFull) {
        setShake(true);
        const id = setTimeout(() => setShake(false), 620);
        return () => clearTimeout(id);
      }
      return undefined;
    }, [state.flash, dramaFull]);

    const lowBalance = state.balance < 0.5;
    const energy = ENERGY[t.energy] || ENERGY['Живо'];
    const heatTier = running
      ? state.multiplier >= 4.5
        ? 3
        : state.multiplier >= 2.5
          ? 2
          : state.multiplier >= 1.6
            ? 1
            : 0
      : 0;
    const heatClass = energy.heat && heatTier ? ' is-heat-' + heatTier : '';

    // win celebration
    const [win, setWin] = useState(null);
    const prevCash = useRef(null);
    useEffect(() => {
      const c = state.bet && state.bet.cashedAt;
      if (c && prevCash.current !== c) {
        prevCash.current = c;
        setWin({ amt: state.bet.amount * c, mult: c });
        const id = setTimeout(() => setWin(null), 1500);
        return () => clearTimeout(id);
      }
      if (!c) prevCash.current = null;
      return undefined;
    }, [state.bet]);

    const flare =
      energy.heat && heatTier >= 2 && running
        ? e(
            'div',
            { className: 'dm-heatflare dm-heatflare--' + heatTier },
            e(HN.Icon, { name: 'flame', size: 15 }),
            heatTier >= 3 ? 'ОГОНЬ' : 'ЖАР',
          )
        : null;

    // ---- felt content ----
    const multEl =
      running || (busted && multMode === 'gauge')
        ? e(DM.MultiplierDisplay, {
            value: state.multiplier,
            phase: state.phase,
            mode: multMode,
            busted,
          })
        : null;

    const cardsEl =
      running || busted
        ? e(DM.TableCards, {
            cards: state.cards,
            layout,
            busted,
            scatter: busted && dramaFull,
          })
        : null;

    let stage;
    if (shuffling) {
      stage = e(
        'div',
        { className: 'dm-stage dm-stage--shuffle' },
        e(DM.ShuffleTimer, { secs: t.shuffleSecs, roundId: state.roundId }),
      );
    } else if (multMode === 'gauge') {
      stage = e(
        'div',
        { className: 'dm-stage dm-stage--gauge' },
        e('div', { className: 'dm-stage__cards' }, cardsEl),
        flare,
        multEl,
      );
    } else {
      stage = e(
        'div',
        { className: 'dm-stage dm-stage--center' },
        e('div', { className: 'dm-stage__cards' }, cardsEl),
        e('div', { className: 'dm-multgroup' }, flare, multEl),
      );
    }

    const bustOverlay = busted
      ? e(
          'div',
          { className: 'dm-bust' + (dramaFull ? ' is-full' : ' is-contained') },
          e(
            'div',
            { className: 'dm-bust__banner' },
            e('span', { className: 'dm-bust__word' }, 'BUST'),
            e(
              'span',
              { className: 'dm-bust__final' },
              'финал ×' + state.multiplier.toFixed(2),
            ),
            e(
              'span',
              {
                className:
                  'dm-bust__sub' +
                  (state.lastResult === 'cashed'
                    ? ' is-good'
                    : state.lastResult === 'bust'
                      ? ' is-bad'
                      : ''),
              },
              state.lastResult === 'bust'
                ? '− ◎ ' + state.lastLost.toFixed(2) + ' сгорело'
                : state.lastResult === 'cashed'
                  ? 'ты успел выйти · + ◎ ' +
                    (state.bet.amount * state.bet.cashedAt).toFixed(2)
                  : 'раунд окончен',
            ),
          ),
        )
      : null;

    // ---- bottom panel ----
    const betOrCash =
      running || busted
        ? e(DM.CashOutBar, { state, actions })
        : e(DM.BetPanel, {
            ctx: {
              state,
              actions,
              pending,
              setPending,
              autoEnabled,
              setAutoEnabled,
              autoTarget,
              setAutoTarget,
              betLayout,
              secs: t.shuffleSecs,
            },
          });
    const bottom = betOrCash;

    if (showOnb) {
      return e(
        'div',
        { className: 'dm-app' + fontClass },
        e(DM.Onboarding, { onDone }),
        e(
          window.TweaksPanel,
          null,
          e(window.TweakSection, { label: 'Запуск' }),
          e(window.TweakRadio, {
            label: 'Стартовый экран',
            value: t.startScreen,
            options: ['Онбординг', 'Игра'],
            onChange: (v) => setTweak('startScreen', v),
          }),
        ),
      );
    }

    return e(
      'div',
      {
        className:
          'dm-app' +
          fontClass +
          (shake ? ' dm-shake' : '') +
          (win ? ' dm-won' : ''),
      },
      // header
      e(
        'header',
        { className: 'dm-header' },
        e(
          'button',
          {
            type: 'button',
            className:
              'dm-balance dm-balance--mini' + (lowBalance ? ' is-low' : ''),
            onClick: lowBalance ? actions.topup : undefined,
          },
          e('span', { className: 'dm-balance__val' }, state.balance.toFixed(2)),
          e(
            'span',
            { className: 'dm-balance__unit' },
            lowBalance ? '+10' : 'TON',
          ),
        ),
        e(
          'div',
          { className: 'dm-wordmark' },
          e('span', { className: 'dm-wordmark__main' }, 'DEAD MEN'),
          e('span', { className: 'dm-wordmark__main' }, 'HAND'),
        ),
        e(
          'button',
          { type: 'button', className: 'dm-chat', 'aria-label': 'Открыть чат' },
          e(
            'svg',
            {
              viewBox: '0 0 24 24',
              width: 18,
              height: 18,
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: 2,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            },
            e('path', {
              d: 'M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z',
            }),
          ),
        ),
      ),
      // live wins ticker
      energy.ticker ? e(DM.LiveWinsTicker, null) : null,
      // history
      e(DM.HistoryBar, { history: state.history, roundSuit: state.roundSuit }),
      // felt
      e(
        'div',
        { className: 'dm-felt' + (busted ? ' is-bust' : '') + heatClass },
        e('div', { className: 'dm-felt__sun' }),
        e(DM.SuitWatermark, { suit: state.roundSuit }),
        e(DM.RoundSuit, { suit: state.roundSuit }),
        e(DM.Embers, { count: energy.embers }),
        busted && dramaFull
          ? e('div', { className: 'dm-redflash', key: state.flash })
          : null,
        e(DM.MascotDeck, { shuffling, busted, secs: t.shuffleSecs }),
        e('div', { className: 'dm-felt__mascot' }),
        stage,
        bustOverlay,
        win
          ? e(
              'div',
              { className: 'dm-winflash' },
              e(
                'div',
                { className: 'dm-wincard' },
                e(
                  'span',
                  { className: 'dm-wincard__amt' },
                  '+◎ ' + win.amt.toFixed(2),
                ),
                e(
                  'span',
                  { className: 'dm-wincard__x' },
                  '×' + win.mult.toFixed(2) + ' · ЗАБРАНО',
                ),
              ),
            )
          : null,
      ),
      // bottom
      e('div', { className: 'dm-bottom' }, bottom),

      // tweaks
      e(
        window.TweaksPanel,
        null,
        e(window.TweakSection, { label: 'Запуск' }),
        e(window.TweakRadio, {
          label: 'Стартовый экран',
          value: t.startScreen,
          options: ['Онбординг', 'Игра'],
          onChange: (v) => setTweak('startScreen', v),
        }),
        e(window.TweakSection, { label: 'Оформление' }),
        e(window.TweakRadio, {
          label: 'Шрифты',
          value: t.fonts,
          options: ['Гротеск', 'Чистый', 'Слаб'],
          onChange: (v) => setTweak('fonts', v),
        }),
        e(window.TweakSection, { label: 'Стол' }),
        e(window.TweakRadio, {
          label: 'Раскладка карт',
          value: t.cardLayout,
          options: ['Ряд', 'Сетка', 'Веер'],
          onChange: (v) => setTweak('cardLayout', v),
        }),
        e(window.TweakRadio, {
          label: 'Множитель',
          value: t.multiplier,
          options: ['По центру', 'Сбоку'],
          onChange: (v) => setTweak('multiplier', v),
        }),
        e(window.TweakSection, { label: 'Драма и темп' }),
        e(window.TweakRadio, {
          label: 'Развязка смерти',
          value: t.deathDrama,
          options: ['Полная', 'Сдержанная'],
          onChange: (v) => setTweak('deathDrama', v),
        }),
        e(window.TweakRadio, {
          label: 'Панель ставки',
          value: t.betLayout,
          options: ['Полная', 'Компактная'],
          onChange: (v) => setTweak('betLayout', v),
        }),
        e(window.TweakSection, { label: 'Энергия' }),
        e(window.TweakRadio, {
          label: 'Живость',
          value: t.energy,
          options: ['Спокойно', 'Живо', 'Хайп'],
          onChange: (v) => setTweak('energy', v),
        }),
        e(window.TweakSlider, {
          label: 'Темп карт',
          value: t.pace,
          min: 0.6,
          max: 2.5,
          step: 0.1,
          unit: ' с',
          onChange: (v) => setTweak('pace', v),
        }),
        e(window.TweakSlider, {
          label: 'Тасовка',
          value: t.shuffleSecs,
          min: 3,
          max: 8,
          step: 0.5,
          unit: ' с',
          onChange: (v) => setTweak('shuffleSecs', v),
        }),
      ),
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(e(App));

  // scale the phone frame to fit the viewport
  function fit() {
    const stage = document.getElementById('stage');
    const phone = document.getElementById('phone');
    if (!stage || !phone) return;
    const s = Math.min(
      (window.innerWidth - 24) / 390,
      (window.innerHeight - 24) / 844,
      1.15,
    );
    phone.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  setTimeout(fit, 0);
  fit();
})();
