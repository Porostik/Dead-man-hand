import type { InputHTMLAttributes, ReactNode } from 'react';

/* ---------------------------------------------------------------- Input */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  help?: ReactNode;
  error?: boolean;
}

/** Text input with optional label, prefix/suffix affix and helper/error text. */
export function Input({
  label,
  prefix,
  suffix,
  help,
  error = false,
  id,
  className = '',
  ...rest
}: InputProps) {
  const inputId =
    id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div
      className={['hn-field', error && 'hn-field--error', className]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <label className="hn-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="hn-input-wrap">
        {prefix && <span className="hn-affix">{prefix}</span>}
        <input id={inputId} className="hn-input" {...rest} />
        {suffix && <span className="hn-affix">{suffix}</span>}
      </div>
      {help && <span className="hn-help">{help}</span>}
    </div>
  );
}

/* ----------------------------------------------------------- AmountField */
export interface AmountFieldProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}

/** Stepper for choosing a stake / amount. Controlled: pass value + onChange. */
export function AmountField({
  value,
  onChange,
  step = 0.1,
  min = 0,
  max = Infinity,
  unit = 'TON',
}: AmountFieldProps) {
  const fmt = (n: number) => Number(n.toFixed(2)).toString();
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(2)));
  return (
    <div className="hn-amount">
      <span className="hn-amount__val">
        <b>{fmt(value)}</b> {unit}
      </span>
      <span className="hn-amount__step">
        <button
          type="button"
          className="hn-step-btn"
          onClick={dec}
          disabled={value <= min}
          aria-label="Меньше"
        >
          –
        </button>
        <button
          type="button"
          className="hn-step-btn"
          onClick={inc}
          disabled={value >= max}
          aria-label="Больше"
        >
          +
        </button>
      </span>
    </div>
  );
}

/* ------------------------------------------------------ SegmentedControl */
export type SegmentOption = string | { value: string; label: ReactNode };

export interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  block?: boolean;
}

/** Segmented control / radio group rendered as a pill. */
export function SegmentedControl({
  options,
  value,
  onChange,
  block = false,
}: SegmentedControlProps) {
  return (
    <div
      className={['hn-seg', block && 'hn-seg--block'].filter(Boolean).join(' ')}
      role="tablist"
    >
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        return (
          <button
            key={val}
            type="button"
            role="tab"
            aria-selected={val === value}
            className="hn-seg__opt"
            onClick={() => onChange(val)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------- Switch */
export interface SwitchProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
}

/** On/off toggle. Controlled via checked + onChange. */
export function Switch({ checked = false, onChange, label }: SwitchProps) {
  return (
    <div
      className="hn-switch"
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <span className="hn-switch__track">
        <span className="hn-switch__thumb" />
      </span>
      {label && <span className="hn-switch__label">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------- Checkbox */
export interface CheckboxProps {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
}

/** Checkbox for consents / multi-select. Controlled. */
export function Checkbox({ checked = false, onChange, label }: CheckboxProps) {
  return (
    <div
      className="hn-check"
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <span className="hn-check__box" />
      {label && <span className="hn-switch__label">{label}</span>}
    </div>
  );
}
