export class EventBus {
  // 1. We keep the static private record
  static #listener: Record<string, any> = {};

  static subscribe({
    eventName,
    cb,
  }: {
    eventName: string;
    cb: (e: any) => void;
  }) {
    if (!eventName || !cb) return;

    this.#listener[eventName] = cb;

    document.addEventListener(eventName, cb);

    return () => EventBus.unsubscribe(eventName);
  }

  // 3. Adding an unsubscribe method makes the #listener incredibly useful
  static unsubscribe(eventName: string) {
    if (!eventName) return;
    const cb = this.#listener[eventName];
    if (cb) {
      document.removeEventListener(eventName, cb);
      delete this.#listener[eventName]; // Clean up the reference
    }
  }

  static emit(eventName: string, data: any) {
    if (!eventName) return;

    const customEvent = new CustomEvent(eventName, {
      detail: data,
    });

    document.dispatchEvent(customEvent);
  }
}
