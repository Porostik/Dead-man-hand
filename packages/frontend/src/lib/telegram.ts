/**
 * Telegram Mini App adapter.
 *
 * Prod: runs inside Telegram — mount the mini app, theme, viewport (expanded) and
 * back button, and bind their CSS vars. Local dev: `mockTelegramEnv` simulates the
 * environment so `pnpm dev` runs (and feels like a TMA) in a plain browser.
 *
 * Everything is best-effort and guarded — the game is fully client-side, so it
 * keeps working even if the SDK is unavailable.
 */
import {
  init as initSDK,
  isTMA,
  mockTelegramEnv,
  mountMiniApp,
  bindMiniAppCssVars,
  setMiniAppHeaderColor,
  setMiniAppBackgroundColor,
  setMiniAppBottomBarColor,
  mountThemeParams,
  bindThemeParamsCssVars,
  mountViewport,
  expandViewport,
  bindViewportCssVars,
  requestFullscreen,
  isFullscreen,
  mountBackButton,
  hapticFeedbackImpactOccurred,
  type ImpactHapticFeedbackStyle,
} from '@telegram-apps/sdk';

const safe = (fn: () => void): void => {
  try {
    fn();
  } catch {
    /* SDK feature unavailable in this environment — ignore */
  }
};

/** Minimal launch params so the SDK mounts cleanly in a local browser. */
function mockEnv(): void {
  mockTelegramEnv({
    launchParams: {
      tgWebAppThemeParams: {
        bg_color: '#160f0a',
        text_color: '#f4e8d2',
        hint_color: '#a3917a',
        link_color: '#ffb066',
        button_color: '#ff7a3c',
        button_text_color: '#1a0f08',
        secondary_bg_color: '#1e150f',
      },
      tgWebAppData: new URLSearchParams([
        ['auth_date', String(Math.floor(Date.now() / 1000))],
        ['hash', 'mock'],
        ['user', JSON.stringify({ id: 1, first_name: 'Local', username: 'local' })],
      ]).toString(),
      tgWebAppVersion: '8.0',
      tgWebAppPlatform: 'tdesktop',
    },
  });
}

let booted = false;

/** Initialise the Telegram SDK (or its local mock). Call once at startup. */
export function initTelegram(): void {
  if (booted) return;
  booted = true;

  if (import.meta.env.DEV && !isTMA()) safe(mockEnv);

  safe(() => initSDK());

  safe(() => {
    if (mountThemeParams.isAvailable()) {
      mountThemeParams();
      if (bindThemeParamsCssVars.isAvailable()) bindThemeParamsCssVars();
    }
  });
  safe(() => {
    if (mountMiniApp.isAvailable()) {
      mountMiniApp();
      if (bindMiniAppCssVars.isAvailable()) bindMiniAppCssVars();
    }
    // Match the Telegram chrome to the game's dark palette so the header/bar
    // blend with the app (RGB header where supported, else the theme bg key).
    if (setMiniAppHeaderColor.isAvailable()) {
      setMiniAppHeaderColor(
        setMiniAppHeaderColor.supports?.rgb?.() ? '#160f0a' : 'bg_color',
      );
    }
    if (setMiniAppBackgroundColor.isAvailable()) {
      setMiniAppBackgroundColor('#0a0705');
    }
    if (setMiniAppBottomBarColor.isAvailable()) {
      setMiniAppBottomBarColor('#0a0705');
    }
  });
  safe(() => {
    if (mountViewport.isAvailable()) {
      void mountViewport();
      if (expandViewport.isAvailable()) expandViewport();
      if (bindViewportCssVars.isAvailable()) bindViewportCssVars();
    }
  });
  // Go fullscreen (TG 8.0+) so the app fills the screen and the TG header is
  // hidden — our own header takes over (safe-area padding handled in CSS).
  // Reflect the state onto <html class="tg-fullscreen"> so the layout can lift
  // the game name up into the TG controls strip (between the native buttons).
  safe(() => {
    if (requestFullscreen.isAvailable()) void requestFullscreen();
    const sync = () => {
      try {
        document.documentElement.classList.toggle('tg-fullscreen', !!isFullscreen());
      } catch {
        /* ignore */
      }
    };
    sync();
    if (typeof isFullscreen.sub === 'function') isFullscreen.sub(sync);
  });
  safe(() => {
    if (mountBackButton.isAvailable()) mountBackButton();
  });
}

let hapticEnabled = true;

/** Toggle haptics (wired to the Vibration setting). */
export function setHapticEnabled(on: boolean): void {
  hapticEnabled = on;
}

/** Fire a haptic impact (no-op outside Telegram or when vibration is off). */
export function haptic(style: ImpactHapticFeedbackStyle = 'light'): void {
  if (!hapticEnabled) return;
  safe(() => {
    if (hapticFeedbackImpactOccurred.isAvailable()) {
      hapticFeedbackImpactOccurred(style);
    }
  });
}
