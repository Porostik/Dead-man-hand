import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { Home } from './screens/Home';
import { KitScreen } from './screens/KitScreen';
import { LabScreen } from './screens/LabScreen';

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

const labRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lab',
  component: LabScreen,
});

const routeTree = rootRoute.addChildren([indexRoute, kitRoute, labRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
