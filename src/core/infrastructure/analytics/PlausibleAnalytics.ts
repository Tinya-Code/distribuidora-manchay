import { Analytics } from '../../application';

export class PlausibleAnalytics implements Analytics {
  constructor(private readonly domain?: string) {}

  track(event: string, payload?: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    const w = window as any;
    if (typeof w.plausible === 'function') {
      w.plausible(event, payload ? { props: payload } : undefined);
    }
  }
}
