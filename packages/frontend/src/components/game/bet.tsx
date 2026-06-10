import { Button, Chip, AmountField, Switch } from '@dmh/ui';
import { useGameStore } from '../../store/gameStore';
import { haptic } from '../../lib/telegram';
import { fmtCoin, fmtX } from './util';

const QUICK = [0.5, 1, 2, 5];

/* --------------------------------------------------- pre-round bet panel */
export function BetPanel() {
  const balance = useGameStore((s) => s.balance);
  const bet = useGameStore((s) => s.bet);
  const stake = useGameStore((s) => s.stake);
  const setStake = useGameStore((s) => s.setStake);
  const autoEnabled = useGameStore((s) => s.autoEnabled);
  const autoTarget = useGameStore((s) => s.autoTarget);
  const placeBet = useGameStore((s) => s.placeBet);
  const cancelBet = useGameStore((s) => s.cancelBet);
  const setAuto = useGameStore((s) => s.setAuto);
  const setAutoTarget = useGameStore((s) => s.setAutoTarget);

  const canAfford = stake > 0 && stake <= balance;

  const onBet = () => {
    if (!canAfford) return;
    haptic('medium');
    placeBet(stake);
  };
  const onCancel = () => {
    haptic('light');
    cancelBet();
  };

  return (
    <div className="dm-betpanel">
      <div className="dm-betpanel__status">
        <span className={`dm-status${bet ? ' dm-status--in' : ''}`}>
          {bet
            ? '✓ Ставка принята · в игре со старта'
            : 'Сделай ставку, пока тасуется колода'}
        </span>
      </div>

      <div className="dm-chips">
        {QUICK.map((v) => (
          <button
            key={v}
            type="button"
            className={`dm-chipbtn${stake === v ? ' is-active' : ''}`}
            disabled={!!bet || v > balance}
            onClick={() => {
              haptic('light');
              setStake(v);
            }}
          >
            <Chip value={v} tone={stake === v ? 'gold' : undefined} />
          </button>
        ))}
      </div>

      <div className="dm-amount-wrap">
        <AmountField
          value={stake}
          onChange={setStake}
          step={0.5}
          min={0.5}
          max={100}
          unit="◎"
        />
      </div>

      <div className="dm-auto">
        <Switch checked={autoEnabled} onChange={setAuto} label="Авто-вывод" />
        <div className={`dm-auto__target${autoEnabled ? '' : ' is-off'}`}>
          <button
            type="button"
            className="dm-auto__btn"
            disabled={!autoEnabled}
            onClick={() => setAutoTarget(autoTarget - 0.25)}
            aria-label="Меньше"
          >
            –
          </button>
          <span className="dm-auto__val">{fmtX(autoTarget)}</span>
          <button
            type="button"
            className="dm-auto__btn"
            disabled={!autoEnabled}
            onClick={() => setAutoTarget(autoTarget + 0.25)}
            aria-label="Больше"
          >
            +
          </button>
        </div>
      </div>

      {bet ? (
        <Button variant="danger" block onClick={onCancel}>
          ОТМЕНИТЬ · ◎ {fmtCoin(bet.amount)}
        </Button>
      ) : (
        <Button block disabled={!canAfford} onClick={onBet}>
          СТАВКА · ◎ {fmtCoin(stake)}
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------ in-round cash-out bar */
export function CashOutBar() {
  const phase = useGameStore((s) => s.phase);
  const bet = useGameStore((s) => s.bet);
  const stake = useGameStore((s) => s.stake);
  const multiplier = useGameStore((s) => s.multiplier);
  const lastAuto = useGameStore((s) => s.lastAuto);
  const cashout = useGameStore((s) => s.cashout);

  // no bet this round — show the "what your stake would have made" nudge
  if (!bet) {
    return (
      <div className="dm-cashbar dm-cashbar--idle">
        <span className="dm-cashbar__regret-lab">
          СТАВКА ◎{fmtCoin(stake)} ДАЛА БЫ СЕЙЧАС
        </span>
        <span className="dm-cashbar__regret-amt">◎ {fmtCoin(stake * multiplier)}</span>
        <span className="dm-cashbar__idle-s">депни и не упусти заход</span>
      </div>
    );
  }

  // active bet — the big cash-out button (dead the instant the round ends)
  if (bet.active) {
    const dead = phase !== 'running';
    return (
      <button
        type="button"
        className={`dm-cashout${dead ? ' is-dead' : ''}`}
        disabled={dead}
        onClick={
          dead
            ? undefined
            : () => {
                haptic('medium');
                cashout();
              }
        }
      >
        <span className="dm-cashout__top">{dead ? 'СГОРЕЛО' : 'ЗАБРАТЬ'}</span>
        <span className="dm-cashout__amt">◎ {fmtCoin(bet.amount * multiplier)}</span>
        <span className="dm-cashout__x">{fmtX(multiplier)}</span>
      </button>
    );
  }

  // already cashed out
  const at = bet.cashedAt ?? 1;
  return (
    <div className="dm-cashbar dm-cashbar--done">
      <div className="dm-cashbar__done-l">
        <span className="dm-cashbar__done-x">{fmtX(at)}</span>
        <span className="dm-cashbar__done-lab">
          {lastAuto ? 'авто-вывод' : 'забрано'}
        </span>
      </div>
      <span className="dm-cashbar__done-amt">+◎ {fmtCoin(bet.amount * at)}</span>
    </div>
  );
}
