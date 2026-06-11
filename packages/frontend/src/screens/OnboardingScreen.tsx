import { useState, type CSSProperties } from 'react';
import { PlayingCard, Input, Checkbox, Button } from '@dmh/ui';
import type { Rank, Suit } from '@dmh/engine';
import { RuleSlides } from '../components/game/rules';

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

/* --------------------------------------------------------- onboarding */
export function OnboardingScreen({ onDone }: { onDone: (nick: string) => void }) {
  const [showRules, setShowRules] = useState(false);
  const [nick, setNick] = useState('');
  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);

  const canSignup = nick.trim().length >= 2 && adult && terms;
  const finish = () => onDone(nick.trim());

  if (showRules) {
    return (
      <div className="dm-app dm-app--live">
        <RuleSlides onDone={finish} />
      </div>
    );
  }

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
          <p className="dm-onb__sub">Пара формальностей — и раздаём первую руку.</p>

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
            <Button block disabled={!canSignup} onClick={() => setShowRules(true)}>
              ЗА СТОЛ →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
