import { Client } from "discord.js";
import { getCommandHistory } from "../DatabaseAccess";

const path: string = "/commandhistory";

async function execute(client: Client): Promise<{}> {
  return await getCommandHistory();
}

export { path, execute };
