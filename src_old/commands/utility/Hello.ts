import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

const data = new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Learn about me.");

async function execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle("Hello there!")
        .setDescription("My name is FakeAwake, I am a Discord Bot created by <@301985885870882827>.\nI like to eat lasagne and uranium. 😋\nMy birthday is on 25 February 2021. 🎂");
    await interaction.reply({embeds: [embed]});
}

export { data, execute };
