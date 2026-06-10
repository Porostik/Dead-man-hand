/**
 * @dmh/ui — High Noon design system.
 * Components apply global `hn-*` classes; import the stylesheet once:
 *   import '@dmh/ui/styles.css';
 */
export { HN_ICONS, type IconName } from './icons';
export { Icon, type IconProps } from './components/Icon';
export { Wordmark, type WordmarkProps } from './components/brand';
export {
  Button,
  type ButtonProps,
  IconButton,
  type IconButtonProps,
} from './components/buttons';
export {
  Input,
  type InputProps,
  AmountField,
  type AmountFieldProps,
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentOption,
  Switch,
  type SwitchProps,
  Checkbox,
  type CheckboxProps,
} from './components/forms';
export {
  Card,
  type CardProps,
  Modal,
  type ModalProps,
  Drawer,
  type DrawerProps,
} from './components/surfaces';
export {
  Badge,
  type BadgeProps,
  Banner,
  type BannerProps,
  ProgressBar,
  type ProgressBarProps,
  Spinner,
  type SpinnerProps,
  Toast,
  type ToastProps,
  Tooltip,
  type TooltipProps,
  Stat,
  type StatProps,
} from './components/feedback';
export {
  PlayingCard,
  type PlayingCardProps,
  type Suit,
  type Rank,
  Chip,
  type ChipProps,
  Coin,
  type CoinProps,
  PotPile,
  type PotPileProps,
  AmmoMeter,
  type AmmoMeterProps,
  FuseTimer,
  type FuseTimerProps,
  Avatar,
  type AvatarProps,
} from './components/game';
export {
  Tabs,
  type TabsProps,
  type TabOption,
  BottomNav,
  type BottomNavProps,
  type BottomNavItem,
} from './components/navigation';
