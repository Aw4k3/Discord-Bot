import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { log, logError } from "../../utilities";

const connections: Map<string, VoiceConnection> = new Map();

function join(channel: VoiceBasedChannel) {
  connections.set(
    channel.id,
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guildId,
      adapterCreator: channel.guild.voiceAdapterCreator,
    })
  );

  log(`Joined voice channel "${channel.guild.name} > ${channel.name}"`);
}

function leave(channel: VoiceBasedChannel) {
  const connection = connections.get(channel.id);
  if (!connection) {
    logError(`A voice connection for "${channel.guild.name} > ${channel.name}" does not exist`);
    return;
  }

  connection.destroy();
  log(`Left voice channel "${channel.guild.name} > ${channel.name}"`);
}

export { join, leave };
