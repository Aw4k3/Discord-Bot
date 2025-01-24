import { Client } from "discord.js";
import { getLogHistory } from "../../utils/Log";

const path: string = "/logs";

async function execute(client: Client): Promise<{}> {
  return await getLogHistory(1000);
}

export { path, execute };
