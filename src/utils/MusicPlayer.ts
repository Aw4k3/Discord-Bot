import { AudioPlayer, createAudioPlayer } from "@discordjs/voice";
import { VoiceBasedChannel, VoiceChannel } from "discord.js";
import { joinVc } from "./VcManager";

const audioPlayers: Map<string, AudioPlayer> = new Map();
const audioTracks: Map<string, string> = new Map()

export function addTrack() {

}

export function playTrack(voiceChannel: VoiceBasedChannel) {
    joinVc(voiceChannel)
}