import { Client } from "discord.js";
import { ServerResponse } from "http";

const path: string = "/servers";

function execute(client: Client): {} {
  const servers = client.guilds.cache.map((guild) => {
    const { id, name, icon, memberCount } = guild;
    return { id, name, icon, memberCount };
  });

  return JSON.stringify(servers);
}

export { path, execute };
