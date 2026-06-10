/* Dead Men — first-launch sign-up + rules onboarding, and the brand AceFan crest.
   Russian copy, human & a touch swaggering. Reuses High Noon DS components. */
(function () {
  const e = React.createElement;
  const { useState } = React;
  const HN = window.HighNoonQuickDrawDesignSystem_d935db;

  /* --------- the brand hand: two aces · hole card · two aces, fanned --------- */
  const FAN_CARDS = [
    { rank: 'A', suit: 'spade' },
    { rank: 'A', suit: 'club' },
    { back: true },
    { rank: 'A', suit: 'heart' },
    { rank: 'A', suit: 'diamond' },
  ];

  function AceFan({ variant = 'hero' }) {
    const mid = (FAN_CARDS.length - 1) / 2;
    return e(
      'div',
      { className: 'dm-fan dm-fan--' + variant, 'aria-hidden': 'true' },
      e('div', { className: 'dm-fan__glow' }),
      FAN_CARDS.map((c, i) => {
        const off = i - mid;
        const rot = off * 8.5;
        const tx = off * 27;
        const ty = off * off * 7 - (i === mid ? 8 : 0);
        return e(
          'div',
          {
            key: i,
            className: 'dm-fan__slot' + (i === mid ? ' is-hole' : ''),
            style: {
              transform: `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg)`,
              zIndex: i === mid ? 9 : 5 - Math.abs(off),
            },
          },
          e(
            HN.PlayingCard,
            c.back
              ? { faceDown: true, size: 'sm' }
              : { rank: c.rank, suit: c.suit, size: 'sm' },
          ),
        );
      }),
    );
  }

  /* ---------------------------- rules slides ---------------------------- */
  const RULES = [
    {
      key: 'climb',
      title: 'Карты идут — банк растёт',
      body: 'Каждая новая карта поднимает множитель. Чем дольше держится раздача, тем жирнее куш.',
      visual: () =>
        e(
          'div',
          { className: 'dm-onb-vis dm-onb-vis--climb' },
          e(
            'div',
            { className: 'dm-onb-climb' },
            [0, 1, 2].map((i) =>
              e(
                'div',
                { key: i, className: 'dm-onb-climb__c', style: { '--i': i } },
                e(HN.PlayingCard, {
                  rank: ['7', '10', 'K'][i],
                  suit: ['spade', 'heart', 'club'][i],
                  size: 'sm',
                }),
              ),
            ),
          ),
          e('span', { className: 'dm-onb-x' }, '×2.40'),
        ),
    },
    {
      key: 'dead',
      title: 'Где-то спит мёртвая карта',
      body: 'Она спрятана в колоде с самого начала. Перевернёшь её — раунд сгорает, и ставка вместе с ним.',
      visual: () =>
        e(
          'div',
          { className: 'dm-onb-vis dm-onb-vis--dead' },
          e(window.DM.DeathCard, null),
          e('span', { className: 'dm-onb-burn' }, 'раунд сгорает'),
        ),
    },
    {
      key: 'cash',
      title: 'Всё решает один нерв',
      body: 'Жми CASH OUT до мёртвой карты — и выигрыш твой. Дрогнул позже — забираешь пепел.',
      note: 'Масть раунда даёт +0.3 к каждой карте этой масти. Лови серию.',
      visual: () =>
        e(
          'div',
          { className: 'dm-onb-vis dm-onb-vis--cash' },
          e(
            'div',
            { className: 'dm-onb-cash' },
            e('span', { className: 'dm-onb-cash__lab' }, 'CASH OUT'),
            e('span', { className: 'dm-onb-cash__amt' }, '◎ 6.00'),
            e('span', { className: 'dm-onb-cash__x' }, '×2.40 · ЗАБРАНО'),
          ),
        ),
    },
  ];

  /* ----------------------------- the flow ----------------------------- */
  function Onboarding({ onDone }) {
    const [step, setStep] = useState(0); // 0 = sign-up, 1..3 = rules
    const [nick, setNick] = useState('');
    const [adult, setAdult] = useState(false);
    const [terms, setTerms] = useState(false);

    const canStart = nick.trim().length >= 2 && adult && terms;
    const finish = () => onDone(nick.trim() || 'gunslinger');

    // ---- sign-up ----
    if (step === 0) {
      return e(
        'div',
        { className: 'dm-onb dm-onb--signup' },
        e(
          'div',
          { className: 'dm-onb__crest' },
          e(AceFan, { variant: 'hero' }),
          e(
            'div',
            { className: 'dm-onb__brand' },
            e('span', { className: 'dm-onb__brand-n' }, 'DEAD MEN HAND'),
          ),
        ),
        e(
          'div',
          { className: 'dm-onb__body' },
          e('h1', { className: 'dm-onb__h' }, 'Садись за стол'),
          e(
            'p',
            { className: 'dm-onb__sub' },
            'Пара формальностей — и раздаём первую руку.',
          ),
          e(
            'div',
            { className: 'dm-onb__form' },
            e(HN.Input, {
              label: 'Имя за столом',
              placeholder: 'gunslinger',
              maxLength: 16,
              value: nick,
              onChange: (ev) => setNick(ev.target.value),
              help: 'так тебя увидят соперники',
            }),
            e(
              'div',
              { className: 'dm-onb__checks' },
              e(HN.Checkbox, {
                checked: adult,
                onChange: setAdult,
                label: 'Мне есть 18 лет',
              }),
              e(HN.Checkbox, {
                checked: terms,
                onChange: setTerms,
                label: e(
                  React.Fragment,
                  null,
                  'Принимаю ',
                  e('span', { className: 'dm-onb__link' }, 'правила игры'),
                  ' и ',
                  e('span', { className: 'dm-onb__link' }, 'политику'),
                ),
              }),
            ),
          ),
          e(
            'div',
            { className: 'dm-onb__foot' },
            e(
              HN.Button,
              { block: true, disabled: !canStart, onClick: () => setStep(1) },
              'ЗА СТОЛ  →',
            ),
            e(
              'p',
              { className: 'dm-onb__fine' },
              'Ставки в реальных TON. Играй на трезвую голову. 18+',
            ),
          ),
        ),
      );
    }

    // ---- rules ----
    const idx = step - 1;
    const slide = RULES[idx];
    const last = idx === RULES.length - 1;
    return e(
      'div',
      { className: 'dm-onb dm-onb--rules' },
      e(
        'header',
        { className: 'dm-onb__rh' },
        e('span', { className: 'dm-onb__rh-lab' }, 'КАК ЭТО РАБОТАЕТ'),
        e(
          'button',
          { type: 'button', className: 'dm-onb__skip', onClick: finish },
          'Пропустить',
        ),
      ),
      e(
        'div',
        { className: 'dm-onb__stage', key: slide.key },
        slide.visual(),
        e('h2', { className: 'dm-onb__rtitle' }, slide.title),
        e('p', { className: 'dm-onb__rbody' }, slide.body),
        slide.note
          ? e(
              'div',
              { className: 'dm-onb__rnote' },
              e(HN.Icon, { name: 'flame', size: 15 }),
              e('span', null, slide.note),
            )
          : null,
      ),
      e(
        'div',
        { className: 'dm-onb__rfoot' },
        e(
          'div',
          { className: 'dm-onb__dots' },
          RULES.map((_, i) =>
            e('span', {
              key: i,
              className: 'dm-onb__dot' + (i === idx ? ' is-on' : ''),
            }),
          ),
        ),
        e(
          'div',
          { className: 'dm-onb__rnav' },
          e(
            'button',
            {
              type: 'button',
              className: 'dm-onb__back',
              onClick: () => setStep(step - 1),
            },
            '←',
          ),
          e(
            HN.Button,
            {
              block: true,
              onClick: () => (last ? finish() : setStep(step + 1)),
            },
            last ? 'РАЗДАВАЙ' : 'ДАЛЬШЕ',
          ),
        ),
      ),
    );
  }

  Object.assign(window.DM, { AceFan, Onboarding });
})();
