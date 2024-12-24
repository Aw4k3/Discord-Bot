import { Client } from "discord.js";

const path: string = "/servers";

function execute(client: Client): {} {
  const servers = client.guilds.cache.map((guild) => {
    const { id, name, memberCount } = guild;
    let icon = "";
    try {
      icon = guild.iconURL() as string;
    } catch (error) {
      return { error: `Failed to get icon for server "${name}"` };
    }
    return { id, name, icon, memberCount };
  });

  return servers;
}

export { path, execute };
