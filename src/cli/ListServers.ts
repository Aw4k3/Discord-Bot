import { Client } from "discord.js";
import { log } from "console";

const name: string = "list-servers";

function execute(client: Client) {
  let list: string[] = client.guilds.cache.map((guild) => guild.name);
  list = list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  log("-------------Server List-------------");
  list.forEach((server) => log(server));
  log("-------------------------------------");
}

export { name, execute };
