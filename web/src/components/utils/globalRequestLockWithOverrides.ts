import { setNotification } from "./notificationService";

// Lock states
export let isProcessingRequestWrapper: boolean = false;
export let isErrorWrapper: boolean = false;
export let isEditingWrapper: boolean = false;

export function setIsProcessingRequestWrapper(state: boolean) {
  isProcessingRequestWrapper = state
}

export function setIsErrorWrapper(state: boolean) {
  isErrorWrapper = state
}

export function setIsEditingWrapper(state: boolean) {
  isEditingWrapper = state
}

type AsyncFn<Args extends any[], R> = (...args: Args) => Promise<R>;

export interface WrappedFn<Args extends any[], R> {
  (...args: Args): Promise<R | undefined>;
  /** Bypass lock; resets lock when done */
  force: (...args: Args) => Promise<R>;
  /** Bypass lock; keeps lock = true when done */
  forcePersistent: (...args: Args) => Promise<R>;
}

export function handleRequestWrapper<Args extends any[], R>(
  fn: AsyncFn<Args, R>
): WrappedFn<Args, R> {
  // The “normal” wrapper
  const wrapped = (async (...args: Args): Promise<R | undefined> => {
    if (isProcessingRequestWrapper) {
      setNotification("Wiel gerade andere Funktionen ausgeführt werden kann diese Funktion nicht gebraucht werden! Bitte warten Sie", 5000)
      return;
    } else if (isEditingWrapper) {
      setNotification("Sie bearbeiten gerade eine Nachricht beenden sie das Bearbeiten um dies Funktion zu brauchen", 5000)
      return;
    } else if (isErrorWrapper) {
      setNotification("Es ist ein Fehler aufgetreten, Verwenden sie die Knöpfe in der Fehlermeldung um den Fehler zu löschen oder die Funktion zu wiederholen!", 5000)
      return;
    }
    isProcessingRequestWrapper = true;
    try {
      return await fn(...args);
    } finally {
      isProcessingRequestWrapper = false;
    }
  }) as WrappedFn<Args, R>;

  // force: ignore lock, but still reset it afterward
  wrapped.force = async (...args: Args): Promise<R> => {
    // no lock check
    isProcessingRequestWrapper = true;
    try {
      return await fn(...args);
    } finally {
      isProcessingRequestWrapper = false;
    }
  };

  // forcePersistent: ignore lock, and leave it on afterward
  wrapped.forcePersistent = async (...args: Args): Promise<R> => {
    isProcessingRequestWrapper = true;
    return fn(...args);
    // note: we deliberately do *not* reset isProcessingRequestWrapper here
  };

  return wrapped;
}