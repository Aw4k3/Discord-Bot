import { LogLine } from "../types/LogLine";

const history: LogLine[] = [];

export function getLogHistory(n: number = 100): LogLine[] {
    if (n >= history.length) {
        return history;
    }

    return history.slice(history.length - n);
}

export function log(message: string) {
  const date = new Date();
  console.log(`\x1b[0m[${date.toLocaleString().replace(",", "")}] ${message}\x1b[0m`);
  history.push({ type: "info", message, timestamp: date.getTime() });
}

export function logWarning(message: string) {
  const date = new Date();
  console.log(`\x1b[33m[${date.toLocaleString().replace(",", "")}] ${message}\x1b[0m`);
  history.push({ type: "warning", message, timestamp: date.getTime() });
}

export function logError(message: string) {
  const date = new Date();
  console.log(`\x1b[31m[${date.toLocaleString().replace(",", "")}] ${message}\x1b[0m`);
  history.push({ type: "error", message, timestamp: date.getTime() });
}

export function logDebug(message: string) {
  const date = new Date();
  console.log(`\x1b[36m[${date.toLocaleString().replace(",", "")}] ${message}\x1b[0m`);
  history.push({ type: "debug", message, timestamp: date.getTime() });
}
