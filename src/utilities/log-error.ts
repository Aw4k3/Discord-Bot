import timestamp from "./timestamp";

function logError(message: any): void {
  console.error(`\x1b[31m[${timestamp()}] ${message}\x1b[0m`);
}

export default logError;