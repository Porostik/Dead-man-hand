import { Icon } from '@dmh/ui';
import { fmtX, fmtCoin } from './util';

interface Win {
  name: string;
  mult: number;
  amt: number;
}

// Static fake-player win stream — social liveness flavour (no backend in Phase 0).
const WINS: Win[] = [
  { name: '@calamity', mult: 2.07, amt: 2.07 },
  { name: '@rust_kid', mult: 1.42, amt: 0.71 },
  { name: '@doc_holiday', mult: 6.31, amt: 12.6 },
  { name: '@viuda', mult: 1.88, amt: 1.88 },
  { name: '@sandstorm', mult: 3.4, amt: 6.8 },
  { name: '@ace_high', mult: 1.21, amt: 0.6 },
  { name: '@coyote', mult: 5.17, amt: 10.34 },
  { name: '@belle_star', mult: 2.65, amt: 1.32 },
  { name: '@django', mult: 1.59, amt: 0.8 },
  { name: '@sundown', mult: 4.02, amt: 8.04 },
  { name: '@el_paso', mult: 1.73, amt: 1.73 },
  { name: '@dusty', mult: 2.94, amt: 2.94 },
  { name: '@mirage', mult: 7.88, amt: 15.76 },
  { name: '@laredo', mult: 1.34, amt: 0.67 },
];

function Item({ w }: { w: Win }) {
  return (
    <span className={`dm-tick__item${w.mult > 5 ? ' is-big' : ''}`}>
      <span className="dm-tick__name">{w.name}</span>
      <span className="dm-tick__x">{fmtX(w.mult)}</span>
      <span className="dm-tick__amt">+◎{fmtCoin(w.amt)}</span>
    </span>
  );
}

export function LiveWinsTicker() {
  return (
    <div className="dm-tick">
      <span className="dm-tick__lab">
        <Icon name="trophy" size={11} />
        ВЫПЛАТЫ
      </span>
      <div className="dm-tick__vp">
        <div className="dm-tick__track">
          {WINS.map((w, i) => (
            <Item key={`a${i}`} w={w} />
          ))}
          {WINS.map((w, i) => (
            <Item key={`b${i}`} w={w} />
          ))}
        </div>
      </div>
    </div>
  );
}
