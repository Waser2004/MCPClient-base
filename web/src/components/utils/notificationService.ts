import type { AlertProps } from "../Notifications";

let notifyFn: ((msg: string, duration: number) => void) | null = null;
let alertFn: ((props: AlertProps) => void) | null = null;

/** Call this once in your <Notifications> component */
export function registerNotificationHandlers(
  _notifyFn: (msg: string, duration: number) => void,
  _alertFn: (props: AlertProps) => void
) {
  notifyFn = _notifyFn;
  alertFn = _alertFn;
}

/** Call this from anywhere to fire a toast */
export function setNotification(message: string, duration: number = 2000) {
  if (!notifyFn) throw new Error("Notifications not initialized");
  notifyFn(message, duration);
}

/** Call this from anywhere to fire an alert */
export function setAlert(props: AlertProps) {
  if (!alertFn) throw new Error("Notifications not initialized");
  alertFn(props);
}