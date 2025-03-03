import timestamp from "./timestamp";

function logDebug(message: any): void {
  console.log(`\x1b[34m[${timestamp()}] ${message}\x1b[0m`);
}

export default logDebug;