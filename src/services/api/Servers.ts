import { Client } from "discord.js";

const path: string = "/servers";

function execute(client: Client): {} {
  const servers = client.guilds.cache.map((guild) => {
    const { id, name } = guild;
    let iconUrl = "";
    try {
      iconUrl = guild.iconURL() as string;
    } catch (error) {
      return { error: `Failed to get icon for server "${name}"` };
    }
    return { id, name, iconUrl };
  });

  return servers;
}

export { path, execute };
