export interface Analytics {
  track(event: string, payload?: Record<string, unknown>): void;
}
