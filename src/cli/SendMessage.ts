import { Channel, Client, GuildTextBasedChannel } from "discord.js";
import { logError, logWarning } from "../api/Log";

const name: string = "send-message";

function execute(client: Client, args: string[]) {
  if (args.length < 2) {
    logWarning("Usage: send-message <channelId> <message>");
    return;
  }

  const channelId: string = args.shift() as string;
  const message: string = args.join(" ");
  
  const channel: Channel | undefined = client.channels.cache.get(channelId);

  if (!channel) {
    logError("Failed to get text channel");
    return;
  }

  (channel as GuildTextBasedChannel).send(message);
}

export { name, execute };
