import { useState } from 'react';
import { GameScreen } from './GameScreen';
import { OnboardingScreen } from './OnboardingScreen';

const ONBOARDED_KEY = 'dm_onboarded';
const NICK_KEY = 'dm_nick';

const isOnboarded = () => {
  // dev-only: `/?game` skips onboarding for quick local inspection
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('game')) {
    return true;
  }
  try {
    return localStorage.getItem(ONBOARDED_KEY) === '1';
  } catch {
    return false;
  }
};

/** Root: shows onboarding on first launch, then the game. */
export function Home() {
  const [onboarded, setOnboarded] = useState(isOnboarded);

  if (!onboarded) {
    return (
      <OnboardingScreen
        onDone={(nick) => {
          try {
            localStorage.setItem(ONBOARDED_KEY, '1');
            localStorage.setItem(NICK_KEY, nick || 'gunslinger');
          } catch {
            /* storage unavailable — proceed anyway */
          }
          setOnboarded(true);
        }}
      />
    );
  }
  return <GameScreen />;
}
