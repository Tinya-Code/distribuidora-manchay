import { Analytics } from '../../application';

export class NoopAnalytics implements Analytics {
  track(_event: string, _payload?: Record<string, unknown>): void {}
}
