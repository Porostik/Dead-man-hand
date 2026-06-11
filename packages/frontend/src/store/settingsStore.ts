import { create } from 'zustand';
import { setHapticEnabled } from '../lib/telegram';

/**
 * Local player settings (persisted). Vibration is wired to the haptic helper;
 * sound is stored for when we add audio (no sound engine yet).
 */
const KEY = 'dm_settings';

interface Saved {
  sound?: boolean;
  vibration?: boolean;
}

function load(): Saved {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Saved;
  } catch {
    return {};
  }
}

const saved = load();
// reflect the stored vibration preference into the haptic helper on boot
setHapticEnabled(saved.vibration ?? true);

interface SettingsState {
  sound: boolean;
  vibration: boolean;
  setSound: (v: boolean) => void;
  setVibration: (v: boolean) => void;
}

export const useSettings = create<SettingsState>((set, get) => {
  const persist = () =>
    localStorage.setItem(
      KEY,
      JSON.stringify({ sound: get().sound, vibration: get().vibration }),
    );
  return {
    sound: saved.sound ?? true,
    vibration: saved.vibration ?? true,
    setSound: (sound) => {
      set({ sound });
      persist();
    },
    setVibration: (vibration) => {
      set({ vibration });
      setHapticEnabled(vibration);
      persist();
    },
  };
});
