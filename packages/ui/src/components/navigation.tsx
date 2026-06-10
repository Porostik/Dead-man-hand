import type { ReactNode } from 'react';

/* ---------------------------------------------------------------- Tabs */
export type TabOption = string | { value: string; label: ReactNode };

export interface TabsProps {
  tabs: TabOption[];
  value: string;
  onChange: (value: string) => void;
}

/** Underline tabs for in-screen sections. */
export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="hn-tabs" role="tablist">
      {tabs.map((t) => {
        const val = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        return (
          <button
            key={val}
            type="button"
            role="tab"
            aria-selected={val === value}
            className="hn-tab"
            onClick={() => onChange(val)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ BottomNav */
export interface BottomNavItem {
  value: string;
  label: ReactNode;
  icon: ReactNode;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  value: string;
  onChange: (value: string) => void;
}

/** App bottom navigation bar. */
export function BottomNav({ items, value, onChange }: BottomNavProps) {
  return (
    <nav className="hn-bottomnav">
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          aria-selected={it.value === value}
          className="hn-navitem"
          onClick={() => onChange(it.value)}
        >
          <span className="hn-navitem__icon">{it.icon}</span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
