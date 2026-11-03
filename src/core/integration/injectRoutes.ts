import type { AstroIntegrationLogger } from 'astro';
import { routeTable } from './routeTable';

export function injectCoreRoutes(injectRoute: (route: { pattern: string; entrypoint: string; prerender?: boolean }) => void): void {
  for (const r of routeTable) {
    injectRoute({ pattern: r.path, entrypoint: r.component, prerender: true });
  }
}
