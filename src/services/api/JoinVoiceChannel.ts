import { Client, VoiceBasedChannel } from "discord.js";
import { joinVc } from "../../utils/VoiceConnections";

type Data = { voiceChannelId: string };

const path: string = "/joinvoicechannel";

function execute(client: Client, data: Data): {} {
  if (!(data satisfies Data)) {
    return {
      error: "Required parameters - voiceChannelId: string",
    };
  }

  const voiceChannel = client.channels.cache.get(data.voiceChannelId);

  if (!voiceChannel) return { error: `Voice channel with id "${data.voiceChannelId}" not found` };

  try {
    joinVc(voiceChannel as VoiceBasedChannel);
    return {
      message: `Successfully sent message to channel "${(voiceChannel as VoiceBasedChannel).guild.name} > ${
        (voiceChannel as VoiceBasedChannel).name
      }"`,
    };
  } catch (error) {
    return {
      error: `Failed to join voice channel "${(voiceChannel as VoiceBasedChannel).guild.name} > ${
        (voiceChannel as VoiceBasedChannel).name
      }"`,
    };
  }
}

export { path, execute };
