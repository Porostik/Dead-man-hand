import { QueryClient } from '@tanstack/react-query';

// Foundation for Phase 2 server state. The F2P MVP runs the engine client-side,
// so there is nothing to fetch yet — this is wired up and ready.
export const queryClient = new QueryClient();
