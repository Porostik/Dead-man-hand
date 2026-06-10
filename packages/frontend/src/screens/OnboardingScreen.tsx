import { useState, type CSSProperties } from 'react';
import { PlayingCard, Input, Checkbox, Button, Icon } from '@dmh/ui';
import type { Rank, Suit } from '@dmh/engine';
import { DeathCard } from '../components/game/board';

/* ----------------------------------------------------- fanned aces crest */
const FAN: Array<{ rank?: Rank; suit?: Suit; hole?: boolean }> = [
  { rank: 'A', suit: 'spade' },
  { rank: 'A', suit: 'club' },
  { hole: true },
  { rank: 'A', suit: 'heart' },
  { rank: 'A', suit: 'diamond' },
];

function AceFan() {
  return (
    <div className="dm-fan dm-fan--hero">
      <div className="dm-fan__glow" />
      {FAN.map((c, i) => {
        const off = i - 2;
        const style: CSSProperties = {
          transform: `translateX(${off * 30}px) translateY(${Math.abs(off) * 10}px) rotate(${off * 12}deg)`,
          zIndex: 10 - Math.abs(off),
        };
        return (
          <div
            key={i}
            className={`dm-fan__slot${c.hole ? ' is-hole' : ''}`}
            style={style}
          >
            {c.hole ? (
              <PlayingCard faceDown size="sm" />
            ) : (
              <PlayingCard rank={c.rank} suit={c.suit} size="sm" />
            )}
          </div>
        );
      })}
    </div>
  );
}

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
    note: 'Масть раунда даёт +0.3 каждой карте этой масти. Серии, стриты и Dead Man’s Hand дают бонус — лови комбо.',
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
];

/* --------------------------------------------------------- onboarding */
export function OnboardingScreen({ onDone }: { onDone: (nick: string) => void }) {
  const [step, setStep] = useState(0); // 0 = signup, 1..3 = rule slides
  const [nick, setNick] = useState('');
  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);

  const canSignup = nick.trim().length >= 2 && adult && terms;
  const finish = () => onDone(nick.trim());

  // sign-up
  if (step === 0) {
    return (
      <div className="dm-app dm-app--live">
        <div className="dm-onb dm-onb--signup">
          <div className="dm-onb__crest">
            <AceFan />
            <div className="dm-onb__brand">
              <span className="dm-onb__brand-k">CARD CRASH</span>
              <span className="dm-onb__brand-n">DEAD MEN</span>
            </div>
          </div>

          <div className="dm-onb__body">
            <h1 className="dm-onb__h">Садись за стол</h1>
            <p className="dm-onb__sub">
              Пара формальностей — и раздаём первую руку.
            </p>

            <div className="dm-onb__form">
              <Input
                label="Имя за столом"
                placeholder="gunslinger"
                maxLength={16}
                help="так тебя увидят соперники"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
              <div className="dm-onb__checks">
                <Checkbox checked={adult} onChange={setAdult} label="Мне есть 18 лет" />
                <Checkbox
                  checked={terms}
                  onChange={setTerms}
                  label="Принимаю правила игры"
                />
              </div>
            </div>

            <div className="dm-onb__foot">
              <Button block disabled={!canSignup} onClick={() => setStep(1)}>
                ЗА СТОЛ →
              </Button>
              <p className="dm-onb__fine">
                Фейковые фишки — играем на фан, без реальных денег. 18+
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // rule slides
  const slide = SLIDES[step - 1];
  const last = step === SLIDES.length;
  return (
    <div className="dm-app dm-app--live">
      <div className="dm-onb dm-onb--rules">
        <div className="dm-onb__rh">
          <span className="dm-onb__rh-lab">КАК ЭТО РАБОТАЕТ</span>
          <button type="button" className="dm-onb__skip" onClick={finish}>
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
              <span
                key={i}
                className={`dm-onb__dot${i === step - 1 ? ' is-on' : ''}`}
              />
            ))}
          </div>
          <div className="dm-onb__rnav">
            <button
              type="button"
              className="dm-onb__back"
              onClick={() => setStep(step - 1)}
              aria-label="Назад"
            >
              ←
            </button>
            <Button block onClick={() => (last ? finish() : setStep(step + 1))}>
              {last ? 'РАЗДАВАЙ' : 'ДАЛЬШЕ'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
