import timestamp from "./timestamp";

function log(message: string): void {
  console.log(`\x1b[0m[${timestamp()}] ${message}\x1b[0m`);
}

export default log;