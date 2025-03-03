import timestamp from "./timestamp";

function logWarning(message: string): void {
  console.log(`\x1b[33m[${timestamp()}] ${message}\x1b[0m`);
}

export default logWarning;