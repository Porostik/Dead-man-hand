import { Button, AmountField, Switch } from '@dmh/ui';
import { useGameStore } from '../../store/gameStore';
import { haptic } from '../../lib/telegram';
import { fmtCoin, fmtX } from './util';

/* --------------------------------------------------- pre-round bet panel */
/** Two independent bet slots (cautious + greedy), each with its own auto-cashout. */
export function BetPanel() {
  const balance = useGameStore((s) => s.balance);
  const slots = useGameStore((s) => s.slots);
  const setStake = useGameStore((s) => s.setStake);
  const setAuto = useGameStore((s) => s.setAuto);
  const setAutoTarget = useGameStore((s) => s.setAutoTarget);
  const placeBet = useGameStore((s) => s.placeBet);
  const cancelBet = useGameStore((s) => s.cancelBet);

  return (
    <div className="dm-betpanel dm-betpanel--multi">
      {slots.map((sl, i) => {
        const placed = !!sl.bet;
        const canAfford = sl.stake > 0 && sl.stake <= balance;
        return (
          <div className={`dm-slot${placed ? ' is-placed' : ''}`} key={i}>
            <div className="dm-slot__row">
              <div className="dm-slot__field">
                <AmountField
                  value={sl.stake}
                  onChange={(v) => setStake(i, v)}
                  step={0.5}
                  min={0.5}
                  max={100}
                  unit="◎"
                />
              </div>
              {placed ? (
                <Button
                  variant="danger"
                  onClick={() => {
                    haptic('light');
                    cancelBet(i);
                  }}
                >
                  ОТМЕНА
                </Button>
              ) : (
                <Button
                  disabled={!canAfford}
                  onClick={() => {
                    if (!canAfford) return;
                    haptic('medium');
                    placeBet(i);
                  }}
                >
                  СТАВКА
                </Button>
              )}
            </div>
            <div className="dm-slot__auto">
              <Switch
                checked={sl.autoEnabled}
                onChange={(v) => setAuto(i, v)}
                label="авто"
              />
              <div className={`dm-auto__target${sl.autoEnabled ? '' : ' is-off'}`}>
                <button
                  type="button"
                  className="dm-auto__btn"
                  disabled={!sl.autoEnabled}
                  onClick={() => setAutoTarget(i, sl.autoTarget - 0.25)}
                  aria-label="Меньше"
                >
                  –
                </button>
                <span className="dm-auto__val">{fmtX(sl.autoTarget)}</span>
                <button
                  type="button"
                  className="dm-auto__btn"
                  disabled={!sl.autoEnabled}
                  onClick={() => setAutoTarget(i, sl.autoTarget + 0.25)}
                  aria-label="Больше"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------ in-round cash-out bar */
/** One cash-out control per active slot, each with a ½ partial-cashout button. */
export function CashOutBar() {
  const phase = useGameStore((s) => s.phase);
  const slots = useGameStore((s) => s.slots);
  const multiplier = useGameStore((s) => s.multiplier);
  const cashout = useGameStore((s) => s.cashout);
  const dead = phase !== 'running';

  const anyBet = slots.some((s) => s.bet);

  // no bets this round — the "what your stake would have made" nudge
  if (!anyBet) {
    const totalStake = slots.reduce((s, sl) => s + sl.stake, 0);
    return (
      <div className="dm-cashbar dm-cashbar--idle">
        <span className="dm-cashbar__regret-lab">
          СТАВКА ◎{fmtCoin(totalStake)} ДАЛА БЫ СЕЙЧАС
        </span>
        <span className="dm-cashbar__regret-amt">
          ◎ {fmtCoin(totalStake * multiplier)}
        </span>
      </div>
    );
  }

  return (
    <div className="dm-cashrow">
      {slots.map((sl, i) => {
        if (!sl.bet) return <div className="dm-cashcell is-empty" key={i} />;

        // already cashed out (fully)
        if (!sl.bet.active) {
          const at = sl.bet.cashedAt ?? 1;
          return (
            <div className="dm-cashcell" key={i}>
              <div className="dm-cashdone">
                <span className="dm-cashdone__x">{fmtX(at)}</span>
                <span className="dm-cashdone__amt">+◎ {fmtCoin(sl.bet.banked)}</span>
              </div>
            </div>
          );
        }

        // active — big cash-out + a ½ partial button
        return (
          <div className="dm-cashcell" key={i}>
            <button
              type="button"
              className={`dm-cashout dm-cashout--multi${dead ? ' is-dead' : ''}`}
              disabled={dead}
              onClick={
                dead
                  ? undefined
                  : () => {
                      haptic('medium');
                      cashout(i, 1);
                    }
              }
            >
              <span className="dm-cashout__top">{dead ? 'СГОРЕЛО' : 'ЗАБРАТЬ'}</span>
              <span className="dm-cashout__amt">
                ◎ {fmtCoin(sl.bet.riding * multiplier)}
              </span>
              <span className="dm-cashout__x">{fmtX(multiplier)}</span>
            </button>
            {!dead && (
              <button
                type="button"
                className="dm-half"
                onClick={() => {
                  haptic('light');
                  cashout(i, 0.5);
                }}
                aria-label="Забрать половину"
              >
                ½
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
