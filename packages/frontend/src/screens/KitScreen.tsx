import { useState } from 'react';
import {
  HN_ICONS,
  type IconName,
  type Rank,
  type Suit,
  Icon,
  Wordmark,
  Button,
  IconButton,
  Input,
  AmountField,
  SegmentedControl,
  Switch,
  Checkbox,
  Card,
  Modal,
  Drawer,
  Badge,
  Banner,
  ProgressBar,
  Spinner,
  Toast,
  Tooltip,
  Stat,
  PlayingCard,
  Chip,
  Coin,
  PotPile,
  AmmoMeter,
  FuseTimer,
  Avatar,
  Tabs,
  BottomNav,
} from '@dmh/ui';
import { CardFlame } from '../components/game/board';
import { ItemIcon, type ItemName } from '../components/game/ItemIcon';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="kit-section">
      <h2 className="kit-section__h">{title}</h2>
      {children}
    </section>
  );
}

function Cell({ cap, children }: { cap: string; children: React.ReactNode }) {
  return (
    <div className="kit-cell">
      <span className="kit-cap">{cap}</span>
      {children}
    </div>
  );
}

const DEMO_CARDS: Array<{ rank: Rank; suit: Suit }> = [
  { rank: 'A', suit: 'spade' },
  { rank: 'K', suit: 'heart' },
  { rank: 'Q', suit: 'club' },
  { rank: 'J', suit: 'diamond' },
  { rank: '10', suit: 'spade' },
  { rank: '7', suit: 'heart' },
];

const ALL_RANKS: Rank[] = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A',
];
const ALL_SUITS: Suit[] = ['spade', 'heart', 'club', 'diamond'];

export function KitScreen() {
  const [amount, setAmount] = useState(1);
  const [room, setRoom] = useState('silver');
  const [auto, setAuto] = useState(true);
  const [agree, setAgree] = useState(false);
  const [tab, setTab] = useState('today');
  const [nav, setNav] = useState('play');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fuse, setFuse] = useState(false);

  return (
    <main className="kit">
      <header className="kit__head">
        <Wordmark
          kicker="HIGH NOON"
          name="Dead Men"
          tagline="design system · @dmh/ui"
        />
        <p className="kit__lede">UI kit — component catalogue</p>
      </header>

      <div className="kit__wrap">
        <Section title="Buttons">
          <div className="kit-row">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="kit-row">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <IconButton label="Close">
              <Icon name="close" />
            </IconButton>
            <IconButton variant="solid" label="Add">
              <Icon name="plus" />
            </IconButton>
            <IconButton variant="bare" label="Share">
              <Icon name="share" />
            </IconButton>
          </div>
        </Section>

        <Section title="Forms">
          <div className="kit-row" style={{ alignItems: 'flex-start' }}>
            <div style={{ minWidth: 220 }}>
              <Input label="Никнейм" placeholder="@calamity" />
            </div>
            <div style={{ minWidth: 220 }}>
              <Input
                label="Ставка"
                suffix="TON"
                defaultValue="1.00"
                help="Минимум 0.1 TON"
              />
            </div>
            <div style={{ minWidth: 220 }}>
              <Input label="Промокод" error help="Неверный код" defaultValue="XXX" />
            </div>
          </div>
          <div className="kit-row">
            <Cell cap="AmountField">
              <AmountField value={amount} onChange={setAmount} step={0.5} min={0.5} />
            </Cell>
            <Cell cap="Segmented">
              <SegmentedControl
                options={[
                  { value: 'bronze', label: 'Bronze' },
                  { value: 'silver', label: 'Silver' },
                  { value: 'gold', label: 'Gold' },
                ]}
                value={room}
                onChange={setRoom}
              />
            </Cell>
            <Cell cap="Switch">
              <Switch checked={auto} onChange={setAuto} label="Авто-вывод" />
            </Cell>
            <Cell cap="Checkbox">
              <Checkbox checked={agree} onChange={setAgree} label="Мне есть 18 лет" />
            </Cell>
          </div>
        </Section>

        <Section title="Surfaces">
          <div className="kit-row" style={{ alignItems: 'stretch' }}>
            <Card title="Default" style={{ width: 200 }}>
              Панель на тёмной коже с золотым волоском.
            </Card>
            <Card variant="raised" title="Raised" style={{ width: 200 }}>
              Поднятая поверхность.
            </Card>
            <Card variant="gold" title="Gold" style={{ width: 200 }}>
              Акцентная золотая рамка.
            </Card>
          </div>
          <div className="kit-row">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open Drawer
            </Button>
          </div>
          <div className="kit-frame">
            <div className="kit-frame__body">
              <span className="kit-cap">Modal / Drawer рендерятся в рамку 390px</span>
              <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Вывести выигрыш?"
                actions={
                  <>
                    <Button variant="ghost" onClick={() => setModalOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={() => setModalOpen(false)}>Забрать</Button>
                  </>
                }
              >
                Ставка ◎ 1.00 → ◎ 2.40. Дожмёшь или заберёшь сейчас?
              </Modal>
              <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Пополнить баланс"
              >
                <p style={{ color: 'var(--text-muted)' }}>
                  Выбери сумму депозита в TON.
                </p>
                <Button block onClick={() => setDrawerOpen(false)}>
                  Подтвердить
                </Button>
              </Drawer>
            </div>
          </div>
        </Section>

        <Section title="Feedback">
          <div className="kit-row">
            <Badge>Default</Badge>
            <Badge tone="gold" dot>
              Premium
            </Badge>
            <Badge tone="rust">Heat</Badge>
            <Badge tone="positive" dot>
              Online
            </Badge>
            <Badge tone="solid">×2</Badge>
          </div>
          <div className="kit-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <Banner title="Совет" tone="info">
              Кэшаут до карты смерти — иначе ставка сгорит.
            </Banner>
            <Banner title="Осторожно" tone="warning">
              Множитель в зоне риска.
            </Banner>
            <Banner title="Bust" tone="danger">
              Вышла карта смерти.
            </Banner>
            <Banner title="Забрано" tone="positive">
              Выигрыш зачислен.
            </Banner>
          </div>
          <div className="kit-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <ProgressBar value={70} />
            <ProgressBar value={45} tone="rust" />
            <ProgressBar value={90} tone="turq" size="lg" />
          </div>
          <div className="kit-row">
            <Spinner />
            <Spinner tone="rust" />
            <Spinner size="sm" />
            <Toast tone="positive" icon={<Icon name="check" />}>
              <b>+◎ 2.40</b> зачислено
            </Toast>
            <Toast tone="danger" icon={<Icon name="skull" />}>
              Раунд сгорел
            </Toast>
            <Tooltip label="Подсказка появляется здесь">
              <Button variant="ghost">Hover me</Button>
            </Tooltip>
            <Stat value="◎ 12.40" label="Balance" />
            <Stat value="1820" label="ELO" />
          </div>
        </Section>

        <Section title="Game">
          <div className="kit-row kit-row--cards">
            {DEMO_CARDS.map((c) => (
              <PlayingCard key={`${c.rank}${c.suit}`} rank={c.rank} suit={c.suit} />
            ))}
            <PlayingCard rank="A" suit="heart" win />
            <PlayingCard faceDown />
          </div>
          <div className="kit-row kit-row--cards">
            <PlayingCard rank="K" suit="spade" size="sm" />
            <PlayingCard rank="K" suit="spade" size="md" />
            <PlayingCard rank="K" suit="spade" size="lg" />
          </div>
          <Cell cap="Combo flame (debug)">
            <div
              className="dm-table--row"
              style={{ display: 'flex', gap: 28, paddingTop: 22 }}
            >
              {(
                [
                  { rank: 'K', suit: 'spade' },
                  { rank: 'K', suit: 'heart' },
                  { rank: 'A', suit: 'club' },
                ] as Array<{ rank: Rank; suit: Suit }>
              ).map((c, i) => (
                <div className="dm-card-wrap is-combo-hit" key={i}>
                  <CardFlame />
                  <div className="dm-card-fly">
                    <PlayingCard rank={c.rank} suit={c.suit} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </Cell>
          <Cell cap="Item art (generated)">
            <div className="kit-items">
              {(['coins', 'chips', 'ring', 'bullets', 'badge'] as ItemName[]).map(
                (n) => (
                  <span key={n} className="kit-item">
                    <ItemIcon name={n} />
                    {n}
                  </span>
                ),
              )}
            </div>
          </Cell>
          <div className="kit-row">
            <Cell cap="Chips">
              <div className="kit-row">
                <Chip value=".5" />
                <Chip value="1" tone="gold" />
                <Chip value="2" tone="turq" />
                <Chip value="5" size="sm" />
              </div>
            </Cell>
            <Cell cap="Coins">
              <div className="kit-row">
                <Coin />
                <Coin tone="silver" />
                <Coin tone="rust" />
                <Coin size="lg" count="×3" />
              </div>
            </Cell>
            <Cell cap="PotPile">
              <PotPile amount="4.0" count={5} />
            </Cell>
          </div>
          <div className="kit-row">
            <Cell cap="AmmoMeter (Bo3)">
              <AmmoMeter total={3} won={1} live={1} />
            </Cell>
            <Cell cap="Avatar">
              <div className="kit-row">
                <Avatar name="Calamity Jane" />
                <Avatar name="Wild Bill" gold />
                <Avatar name="Doc" active size="lg" />
              </div>
            </Cell>
            <Cell cap="FuseTimer">
              <div className="kit-row" style={{ width: 200 }}>
                <FuseTimer seconds={6} running={fuse} />
                <Button size="sm" variant="ghost" onClick={() => setFuse((v) => !v)}>
                  {fuse ? 'Reset' : 'Burn'}
                </Button>
              </div>
            </Cell>
          </div>
        </Section>

        <Section title="Колода — все 52 карты + рубашка">
          {ALL_SUITS.map((suit) => (
            <div key={suit} className="kit-row kit-row--cards">
              {ALL_RANKS.map((rank) => (
                <PlayingCard key={`${rank}${suit}`} rank={rank} suit={suit} size="sm" />
              ))}
            </div>
          ))}
          <div className="kit-row kit-row--cards">
            <PlayingCard faceDown size="sm" />
          </div>
        </Section>

        <Section title="Navigation">
          <Tabs
            tabs={[
              { value: 'today', label: 'Сегодня' },
              { value: 'week', label: 'Неделя' },
              { value: 'all', label: 'Всё время' },
            ]}
            value={tab}
            onChange={setTab}
          />
          <div className="kit-frame">
            <div className="kit-frame__body" />
            <BottomNav
              items={[
                { value: 'play', label: 'Игра', icon: <Icon name="target" /> },
                { value: 'wallet', label: 'Кошелёк', icon: <Icon name="wallet" /> },
                { value: 'top', label: 'Топ', icon: <Icon name="trophy" /> },
                { value: 'me', label: 'Профиль', icon: <Icon name="user" /> },
              ]}
              value={nav}
              onChange={setNav}
            />
          </div>
        </Section>

        <Section title="Icons">
          <div className="kit-icons">
            {(Object.keys(HN_ICONS) as IconName[]).map((name) => (
              <div key={name} className="kit-ico">
                <Icon name={name} size={24} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
