import { useState } from 'react';
import { PlayingCard, Button, Icon } from '@dmh/ui';
import type { Rank, Suit } from '@dmh/engine';
import { DeathCard } from './board';

/* --------------------------------------------------------- rule slides */
interface Slide {
  title: string;
  body: string;
  visual: React.ReactNode;
  note?: string;
}

const CLIMB: Array<{ rank: Rank; suit: Suit }> = [
  { rank: '7', suit: 'spade' },
  { rank: '10', suit: 'heart' },
  { rank: 'K', suit: 'club' },
];

const COMBOS: Array<{ name: string; desc: string; jackpot?: boolean }> = [
  { name: 'ПАРА', desc: 'две одинаковые подряд' },
  { name: 'СЕТ', desc: 'три одинаковые подряд' },
  { name: 'СТРИТ', desc: 'три по порядку' },
  { name: 'ФЛЕШ', desc: 'три одной масти подряд' },
  { name: "☠ DEAD MAN'S HAND", desc: 'тузы и восьмёрки — джекпот', jackpot: true },
];

const SLIDES: Slide[] = [
  {
    title: 'Карты идут — банк растёт',
    body: 'Каждая новая карта поднимает множитель. Чем дольше держится раздача, тем жирнее куш.',
    visual: (
      <div className="dm-onb-vis">
        <div className="dm-onb-climb">
          {CLIMB.map((c, i) => (
            <div
              key={i}
              className="dm-onb-climb__c"
              style={{ ['--i' as string]: i }}
            >
              <PlayingCard rank={c.rank} suit={c.suit} size="sm" />
            </div>
          ))}
        </div>
        <span className="dm-onb-x">×2.40</span>
      </div>
    ),
  },
  {
    title: 'Где-то спит мёртвая карта',
    body: 'Она спрятана в колоде с самого начала. Перевернёшь её — раунд сгорает, и ставка вместе с ним.',
    visual: (
      <div className="dm-onb-vis dm-onb-vis--dead">
        <DeathCard />
        <span className="dm-onb-burn">раунд сгорает</span>
      </div>
    ),
  },
  {
    title: 'Всё решает один нерв',
    body: 'Жми CASH OUT до мёртвой карты — и выигрыш твой. Дрогнул позже — забираешь пепел.',
    note: 'Масть раунда даёт +0.3 каждой карте этой масти.',
    visual: (
      <div className="dm-onb-vis">
        <div className="dm-onb-cash">
          <span className="dm-onb-cash__lab">ЗАБРАТЬ</span>
          <span className="dm-onb-cash__amt">◎ 6.00</span>
          <span className="dm-onb-cash__x">×2.40 · ЗАБРАНО</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Комбо умножают банк',
    body: 'Карты складываются в покерные комбо — каждое разом множит твой икс. Чем круче рука, тем жирнее бонус.',
    visual: (
      <div className="dm-onb-combos">
        {COMBOS.map((c) => (
          <div
            key={c.name}
            className={`dm-onb-combo${c.jackpot ? ' is-jackpot' : ''}`}
          >
            <span className="dm-onb-combo__n">{c.name}</span>
            <span className="dm-onb-combo__d">{c.desc}</span>
          </div>
        ))}
      </div>
    ),
  },
];

/**
 * The rule-slide carousel — reused by the onboarding gate and the in-game
 * "rules" drawer. Self-contained step state; `onDone` finishes / closes.
 */
export function RuleSlides({
  onDone,
  doneLabel = 'РАЗДАВАЙ',
}: {
  onDone: () => void;
  doneLabel?: string;
}) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;

  return (
    <div className="dm-onb dm-onb--rules">
      <div className="dm-onb__rh">
        <span className="dm-onb__rh-lab">КАК ЭТО РАБОТАЕТ</span>
        <button type="button" className="dm-onb__skip" onClick={onDone}>
          Пропустить
        </button>
      </div>

      <div className="dm-onb__stage" key={step}>
        {slide.visual}
        <h2 className="dm-onb__rtitle">{slide.title}</h2>
        <p className="dm-onb__rbody">{slide.body}</p>
        {slide.note && (
          <div className="dm-onb__rnote">
            <Icon name="flame" size={14} />
            {slide.note}
          </div>
        )}
      </div>

      <div className="dm-onb__rfoot">
        <div className="dm-onb__dots">
          {SLIDES.map((_, i) => (
            <span key={i} className={`dm-onb__dot${i === step ? ' is-on' : ''}`} />
          ))}
        </div>
        <div className="dm-onb__rnav">
          {step > 0 && (
            <button
              type="button"
              className="dm-onb__back"
              onClick={() => setStep(step - 1)}
              aria-label="Назад"
            >
              ←
            </button>
          )}
          <Button block onClick={() => (last ? onDone() : setStep(step + 1))}>
            {last ? doneLabel : 'ДАЛЬШЕ'}
          </Button>
        </div>
      </div>
    </div>
  );
}
