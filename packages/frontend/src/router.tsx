import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { Home } from './screens/Home';
import { KitScreen } from './screens/KitScreen';

const rootRoute = createRootRoute({ component: Outlet });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const kitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kit',
  component: KitScreen,
});

const routeTree = rootRoute.addChildren([indexRoute, kitRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
