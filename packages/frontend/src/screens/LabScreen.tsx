import { useMemo, useState } from 'react';
import {
  createRound,
  DEFAULT_CONFIG,
  mulberry32,
  type DealtCard,
  type GameConfig,
  type Round,
} from '@dmh/engine';
import { Link } from '@tanstack/react-router';
import { SUIT_GLYPH, SUIT_RED, COMBO_LABEL } from '../components/game/util';

/**
 * Dev "lab" (/lab) — inspect what the engine actually produces: cards, their
 * weights, combos, the running multiplier, where each round busts, plus aggregate
 * stats and the RTP curve. Compare the Phase-0 feel model vs the Phase-1 crash
 * (house-edge) model side by side. Not part of the player flow.
 */

type Mode = 'feel' | 'crash';

const TARGETS = [1.2, 1.5, 2, 3, 5];
const BUCKETS: [string, number, number][] = [
  ['<1.5', 0, 1.5],
  ['1.5–2', 1.5, 2],
  ['2–3', 2, 3],
  ['3–5', 3, 5],
  ['5–10', 5, 10],
  ['10+', 10, Infinity],
];

function makeConfig(mode: Mode, edge: number, cap: number): GameConfig {
  return mode === 'crash'
    ? { ...DEFAULT_CONFIG, economics: { houseEdge: edge, maxWinCap: cap } }
    : DEFAULT_CONFIG;
}

function genRounds(config: GameConfig, seed: number, count: number): Round[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => createRound(config, rng));
}

function finalX(r: Round): number {
  return r.sequence.length ? r.sequence[r.sequence.length - 1]!.multiplier : 1;
}

function rtpAt(rounds: Round[], t: number): number {
  let staked = 0;
  let returned = 0;
  for (const r of rounds) {
    staked += 1;
    const hit = r.sequence.find((c) => c.multiplier >= t);
    if (hit) returned += hit.multiplier;
  }
  return returned / staked;
}

export function LabScreen() {
  const [mode, setMode] = useState<Mode>('crash');
  const [edge, setEdge] = useState(0.05);
  const [cap, setCap] = useState(25);
  const [seed, setSeed] = useState(12345);
  const [count, setCount] = useState(16);

  const config = useMemo(() => makeConfig(mode, edge, cap), [mode, edge, cap]);

  const shown = useMemo(
    () => genRounds(config, seed, count),
    [config, seed, count],
  );

  // bigger independent sample for the aggregate stats
  const stats = useMemo(() => {
    const N = 40000;
    const rounds = genRounds(config, seed + 777, N);
    const cards = rounds.reduce((s, r) => s + r.sequence.length, 0) / N;
    const combo = { pair: 0, set: 0, straight: 0, flush: 0, deadmans: 0 };
    let withCombo = 0;
    const dist = BUCKETS.map(() => 0);
    for (const r of rounds) {
      const kinds = new Set(r.sequence.map((c) => c.combo).filter(Boolean));
      if (kinds.size) withCombo += 1;
      for (const k of kinds) combo[k as keyof typeof combo] += 1;
      const x = finalX(r);
      const bi = BUCKETS.findIndex(([, lo, hi]) => x >= lo && x < hi);
      if (bi >= 0) dist[bi] += 1;
    }
    const rtp = TARGETS.map((t) => [t, rtpAt(rounds, t)] as const);
    return { N, cards, combo, withCombo, dist, rtp };
  }, [config, seed]);

  const w = (c: DealtCard) =>
    DEFAULT_CONFIG.rankWeights[c.rank] + (c.bonus ? DEFAULT_CONFIG.suitBonus : 0);

  return (
    <div className="lab">
      <style>{LAB_CSS}</style>

      <header className="lab-head">
        <h1>Dead Men — Lab</h1>
        <nav>
          <Link to="/">game</Link>
          <Link to="/kit">kit</Link>
        </nav>
      </header>

      {/* controls */}
      <div className="lab-controls">
        <div className="seg">
          <button className={mode === 'feel' ? 'on' : ''} onClick={() => setMode('feel')}>
            feel (Phase 0)
          </button>
          <button className={mode === 'crash' ? 'on' : ''} onClick={() => setMode('crash')}>
            crash (Phase 1)
          </button>
        </div>
        {mode === 'crash' && (
          <>
            <label>
              edge
              <input
                type="number"
                step={0.01}
                min={0}
                max={0.3}
                value={edge}
                onChange={(e) => setEdge(Number(e.target.value))}
              />
            </label>
            <label>
              cap ×
              <input
                type="number"
                step={1}
                min={2}
                value={cap}
                onChange={(e) => setCap(Number(e.target.value))}
              />
            </label>
          </>
        )}
        <label>
          rounds
          <input
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(200, Number(e.target.value))))}
          />
        </label>
        <label>
          seed
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value))}
          />
        </label>
        <button onClick={() => setSeed(Math.floor(Math.random() * 1e9))}>reroll</button>
      </div>

      {/* stats */}
      <div className="lab-stats">
        <div className="stat">
          <div className="stat__h">avg cards / round</div>
          <div className="stat__v">{stats.cards.toFixed(1)}</div>
          <div className="stat__sub">over {stats.N.toLocaleString()} rounds</div>
        </div>

        <div className="stat">
          <div className="stat__h">combo frequency</div>
          <table className="mini">
            <tbody>
              {(Object.keys(stats.combo) as (keyof typeof stats.combo)[]).map((k) => (
                <tr key={k}>
                  <td>{COMBO_LABEL[k]}</td>
                  <td>{((stats.combo[k] / stats.N) * 100).toFixed(1)}%</td>
                </tr>
              ))}
              <tr className="muted">
                <td>любое комбо</td>
                <td>{((stats.withCombo / stats.N) * 100).toFixed(1)}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="stat">
          <div className="stat__h">итоговый множитель</div>
          <div className="bars">
            {BUCKETS.map(([label], i) => {
              const pctv = (stats.dist[i]! / stats.N) * 100;
              return (
                <div className="bar" key={label}>
                  <span className="bar__l">{label}</span>
                  <span className="bar__t">
                    <span style={{ width: `${pctv}%` }} />
                  </span>
                  <span className="bar__p">{pctv.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stat">
          <div className="stat__h">
            RTP по таргету{mode === 'crash' ? ` (цель ~${((1 - edge) * 100).toFixed(0)}%)` : ''}
          </div>
          <table className="mini">
            <tbody>
              {stats.rtp.map(([t, v]) => (
                <tr key={t}>
                  <td>cash @{t}x</td>
                  <td className={v > 1 ? 'bad' : ''}>{(v * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="stat__sub">
            {mode === 'crash'
              ? 'должно быть плоско и ≤100%'
              : 'feel-модель: RTP не контролируется'}
          </div>
        </div>
      </div>

      {/* rounds */}
      <div className="lab-rounds">
        {shown.map((r, ri) => (
          <div className="round" key={ri}>
            <div className="round__meta">
              <span className="round__i">#{ri + 1}</span>
              <span className={`round__suit${SUIT_RED[r.roundSuit] ? ' red' : ''}`}>
                {SUIT_GLYPH[r.roundSuit]}
              </span>
              <span className="round__cards">{r.sequence.length} карт</span>
              <span className="round__x">→ ×{finalX(r).toFixed(2)}</span>
            </div>
            <div className="round__row">
              {r.sequence.map((c, ci) => (
                <div className={`cell${c.combo ? ' combo' : ''}`} key={ci}>
                  <div className={`cell__top${SUIT_RED[c.suit] ? ' red' : ''}`}>
                    {c.rank}
                    {SUIT_GLYPH[c.suit]}
                  </div>
                  <div className="cell__w">
                    +{w(c).toFixed(2)}
                    {c.bonus && <span className="cell__bonus"> ◆</span>}
                  </div>
                  {c.combo && (
                    <div className="cell__combo">
                      ×{DEFAULT_CONFIG.combo.bonus[c.combo]} {COMBO_LABEL[c.combo]}
                    </div>
                  )}
                  <div className="cell__x">×{c.multiplier.toFixed(2)}</div>
                </div>
              ))}
              <div className="cell dead">
                <div className="cell__top">☠</div>
                <div className="cell__w">bust</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const LAB_CSS = `
.lab{min-height:100vh;background:#15100b;color:#efe2cc;font-family:ui-monospace,Menlo,monospace;padding:16px 18px 60px;font-size:13px}
.lab-head{display:flex;align-items:baseline;gap:16px;margin-bottom:14px}
.lab-head h1{font-size:18px;margin:0;letter-spacing:.5px}
.lab-head nav a{color:#ffb066;margin-right:12px;text-decoration:none}
.lab-controls{display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:12px;border:1px solid #3a2c1f;border-radius:10px;background:#1c140d;margin-bottom:14px}
.lab-controls label{display:flex;flex-direction:column;gap:3px;font-size:11px;color:#a3917a;text-transform:uppercase;letter-spacing:.5px}
.lab-controls input{width:90px;background:#0f0a06;border:1px solid #3a2c1f;color:#efe2cc;border-radius:6px;padding:5px 7px;font:inherit}
.lab-controls button{background:#2a1f14;border:1px solid #3a2c1f;color:#efe2cc;border-radius:6px;padding:6px 10px;cursor:pointer;font:inherit}
.seg{display:flex}.seg button{border-radius:0}.seg button:first-child{border-radius:6px 0 0 6px}.seg button:last-child{border-radius:0 6px 6px 0;border-left:0}
.seg button.on{background:#ff7a3c;color:#1a0f08;border-color:#ff7a3c}
.lab-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:18px}
.stat{border:1px solid #3a2c1f;border-radius:10px;background:#1c140d;padding:12px}
.stat__h{font-size:11px;color:#a3917a;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
.stat__v{font-size:26px;color:#ffcf8a}
.stat__sub{font-size:10px;color:#7a6a56;margin-top:6px}
.mini{width:100%;border-collapse:collapse}
.mini td{padding:2px 0;color:#d8c8ad}.mini td:last-child{text-align:right;color:#ffcf8a}
.mini tr.muted td{color:#a3917a;border-top:1px solid #2a2018;padding-top:5px}
.mini td.bad{color:#ff6a4d;font-weight:bold}
.bars{display:flex;flex-direction:column;gap:4px}
.bar{display:flex;align-items:center;gap:6px;font-size:11px}
.bar__l{width:46px;color:#a3917a}
.bar__t{flex:1;height:10px;background:#0f0a06;border-radius:3px;overflow:hidden}
.bar__t span{display:block;height:100%;background:linear-gradient(90deg,#ff7a3c,#ffcf8a)}
.bar__p{width:34px;text-align:right;color:#ffcf8a}
.lab-rounds{display:flex;flex-direction:column;gap:10px}
.round{border:1px solid #2a2018;border-radius:10px;background:#181109;padding:10px}
.round__meta{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:12px}
.round__i{color:#7a6a56}
.round__suit{font-size:16px;color:#cfc0a6}.round__suit.red{color:#ff6a4d}
.round__cards{color:#a3917a}
.round__x{margin-left:auto;color:#ffcf8a;font-size:14px}
.round__row{display:flex;flex-wrap:wrap;gap:6px}
.cell{min-width:62px;border:1px solid #3a2c1f;border-radius:7px;background:#0f0a06;padding:5px 6px;text-align:center}
.cell.combo{border-color:#ff7a3c;box-shadow:0 0 0 1px #ff7a3c66}
.cell.dead{border-color:#5a2018;background:#1c0d0a;color:#ff6a4d;display:flex;flex-direction:column;justify-content:center}
.cell__top{font-size:15px;color:#efe2cc}.cell__top.red{color:#ff6a4d}
.cell__w{font-size:10px;color:#8fbf8f;margin-top:2px}
.cell__bonus{color:#ffcf8a}
.cell__combo{font-size:8px;color:#ffb066;margin-top:2px;letter-spacing:.3px}
.cell__x{font-size:12px;color:#ffcf8a;margin-top:3px}
`;
