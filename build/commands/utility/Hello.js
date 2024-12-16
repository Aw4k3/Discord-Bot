"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const data = new discord_js_1.SlashCommandBuilder()
    .setName("hello")
    .setDescription("Learn about me.");
exports.data = data;
async function execute(interaction) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle("Hello there!")
        .setDescription("My name is FakeAwake, I am a Discord Bot created by <@301985885870882827>.\nI like to eat lasagne and uranium. 😋\nMy birthday is on 25 February 2021. 🎂");
    await interaction.reply({ embeds: [embed] });
}
