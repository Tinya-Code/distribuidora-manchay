import { Analytics } from '../../application';

export class Ga4Analytics implements Analytics {
  constructor(private readonly measurementId?: string) {}

  track(event: string, payload?: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    const w = window as any;
    if (typeof w.gtag === 'function') {
      w.gtag('event', event, payload ?? {});
    }
  }
}
