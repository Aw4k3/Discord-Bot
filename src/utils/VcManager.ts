import { AudioPlayer, AudioResource, PlayerSubscription, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { GuildMember, VoiceBasedChannel } from "discord.js";
import { log } from "../services/Api";

class Stream {
    private connection: VoiceConnection | undefined;
    private subscription: PlayerSubscription | undefined;
    private player: AudioPlayer = createAudioPlayer();
    private resource: AudioResource | undefined;
    private guildName: string = "";
    private vcName: string = "";

    constructor(vc: VoiceBasedChannel) {
        this.connection = joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guildId,
            adapterCreator: vc.guild.voiceAdapterCreator
        });

        this.connection.subscribe(this.player);
        this.guildName = vc.guild.name;
        this.vcName = vc.name;
    }

    private onReady(): void {
        log(`Connect and ready to stream audio to [${this.guildName} -> ${this.vcName}]`);
    }

    private onDisconnected(): void {
        log(`Disconnected from [${this.guildName} -> ${this.vcName}]`);
    }

    public diconnect(): void {
        this.connection?.destroy();
    }
}

const voiceConnections: Map<string, Stream> = new Map();

export function joinVc(vc: VoiceBasedChannel) {
    voiceConnections.set(vc.guildId, new Stream(vc));
}

export function leaveVc(guildId: string) {
    const connection = voiceConnections.get(guildId);
    if (connection) connection.diconnect();
    voiceConnections.delete(guildId);
}