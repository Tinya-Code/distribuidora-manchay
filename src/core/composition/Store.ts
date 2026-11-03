export type Unsubscribe = () => void;

export class Store<T> {
  private value: T;
  private listeners: Set<(value: T) => void> = new Set();

  constructor(initial: T) {
    this.value = initial;
  }

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
    this.notify();
  }

  update(updater: (prev: T) => T): void {
    this.value = updater(this.value);
    this.notify();
  }

  subscribe(listener: (value: T) => void): Unsubscribe {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const l of this.listeners) l(this.value);
  }
}
