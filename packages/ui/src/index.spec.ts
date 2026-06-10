import { describe, it, expect } from 'vitest';
import { Button, Icon, PlayingCard, HN_ICONS } from './index';

describe('@dmh/ui', () => {
  it('exports component functions', () => {
    expect(typeof Button).toBe('function');
    expect(typeof Icon).toBe('function');
    expect(typeof PlayingCard).toBe('function');
  });

  it('ships the western icon set', () => {
    expect(Object.keys(HN_ICONS)).toContain('skull');
    expect(Object.keys(HN_ICONS)).toContain('spade');
    expect(Object.keys(HN_ICONS).length).toBeGreaterThan(20);
  });
});
