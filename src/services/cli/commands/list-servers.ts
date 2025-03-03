import { Client } from "discord.js";
import { log } from "../../../utilities";
import { CliCommand } from "../../../models";

const alias: string = "list-servers";
const description: string = "Lists all the servers the bot is a part of.";

async function execute(client: Client, args: string[]): Promise<void> {
  log("Server List");
}

export default { alias, description, execute } satisfies CliCommand;
