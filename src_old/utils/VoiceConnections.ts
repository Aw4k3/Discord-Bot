import { joinVoiceChannel } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";

export function joinVc(voiceChannel: VoiceBasedChannel) {
  joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
}
