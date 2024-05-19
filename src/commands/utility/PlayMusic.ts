import { SlashCommandBuilder, CommandInteraction, GuildMember } from "discord.js";
import { playTrack } from "../../utils/MusicPlayer";

const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play music in a vc from YouTube.");

async function execute(interaction: CommandInteraction) {
    console.log(await interaction.guild?.members.fetch(interaction.user));
    const voiceChannel = null; // interaction.member.voice.channel;
    if (voiceChannel) {
        playTrack(voiceChannel);
    } else {
        await interaction.reply({
            ephemeral: true,
            content: "You must be in a VC to use this command."
        });
    }
}

export { data, execute };
