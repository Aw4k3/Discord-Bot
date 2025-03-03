import { Client } from "discord.js";
import { log } from "console";
import { getCommandHistory } from "../services/DatabaseAccess";

const name: string = "get-command-history";

function execute(client: Client, args: string[]) {
  log("-------------Command History-------------");
  getCommandHistory().then((history) => history.forEach((server) => log(server)));
  log("-----------------------------------------");
}

export { name, execute };
