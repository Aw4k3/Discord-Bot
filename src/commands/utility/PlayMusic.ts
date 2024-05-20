/***********************************************/
/*                                             */
/*     This file is merely a state manager     */
/*                                             */
/*     Audio data from here will be played     */
/*         from "./utils/VcManager.ts"         */
/*                                             */
/***********************************************/


import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextBasedChannel, InteractionReplyOptions } from "discord.js";
import { joinVc } from "../../utils/VcManager";

/********** UI Elements **********/
const playButton = new ButtonBuilder()
    .setCustomId("play")
    .setLabel("Play")
    .setStyle(ButtonStyle.Success);

const pauseButton = new ButtonBuilder()
    .setCustomId("pause")
    .setLabel("Pause")
    .setStyle(ButtonStyle.Secondary);

const nextButton = new ButtonBuilder()
    .setCustomId("nextButton")
    .setLabel("Next")
    .setStyle(ButtonStyle.Secondary);

const controlPanelEmbed = new EmbedBuilder()
    .setTitle("Music Control Panel")
    .setDescription("Now Playing: ");

const buttonRow = new ActionRowBuilder()
    .setComponents(playButton, nextButton);

/**********    Logic    **********/
class Instance {
    private tracks: string[] = [];
    private interaction: CommandInteraction | undefined;
    private controlPanel: InteractionReplyOptions = { embeds: [controlPanelEmbed], components: [buttonRow as any] };

    constructor(interaction: CommandInteraction) {
        this.interaction = interaction;
    }

    public addTrack(url: string): void {
        this.tracks.push(url);
    }

    public sendControlPanel(): void {
        this.interaction?.reply(this.controlPanel);
    }
}

const instances: Map<string, Instance> = new Map();
const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music in a vc from YouTube.")
    .addStringOption(option => option
        .setName("url")
        .setDescription("Youtube URL")
        .setRequired(true)
    );

function play() {

}

async function execute(interaction: CommandInteraction) {
    const voiceChannel = (await interaction.guild?.members.fetch(interaction.user))?.voice.channel;

    if (!voiceChannel) {
        await interaction.reply({
            ephemeral: true,
            content: "You must be in a VC to use this command."
        });

        return;
    }

    joinVc(voiceChannel);
    let instance: Instance | undefined = instances.get(interaction.guildId || "");
    if (!instance) {
        instance = new Instance(interaction);
        instances.set(interaction.guildId as string, instance);
    }
    const url = interaction.options.get("url")?.value as string;
    instance.addTrack(url);
}

export { data, execute };
