import { Channel, Client, VoiceBasedChannel } from "discord.js";
import { logError, logWarning } from "../utils/Log";
import { joinVc } from "../utils/VoiceConnections";

const name: string = "join-voice-channel";

function execute(client: Client, args: string[]) {
  if (args.length < 2) {
    logWarning("Usage: join-voice-channel <channelId>");
    return;
  }

  const channelId: string = args.shift() as string;
  const channel: Channel | undefined = client.channels.cache.get(channelId);

  if (!channel) {
    logError("Failed to get voice channel");
    return;
  }

  try {
      joinVc(channel as VoiceBasedChannel);
      return {
        message: `Successfully connected to channel "${(channel as VoiceBasedChannel).guild.name} > ${
          (channel as VoiceBasedChannel).name
        }"`,
      };
    } catch (error) {
      return {
        error: `Failed to join voice channel "${(channel as VoiceBasedChannel).guild.name} > ${
          (channel as VoiceBasedChannel).name
        }"`,
      };
    }
}

export { name, execute };
