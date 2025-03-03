import readline from "node:readline";
import { onLine } from "./handlers";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function start() {
  rl.on("line", onLine);
}

export default {
  start,
};
