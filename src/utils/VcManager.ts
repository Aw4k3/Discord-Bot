import { VoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { GuildMember, VoiceBasedChannel } from "discord.js";

const voiceConnections: Map<string, VoiceConnection> = new Map();

export function joinVc(voiceChannel: VoiceBasedChannel) {
    voiceConnections.set(voiceChannel.guildId, joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    }));
}

export function leaveVc(guildId: string) {
    const connection = voiceConnections.get(guildId);
    if (connection) connection.destroy();
    voiceConnections.delete(guildId);
}