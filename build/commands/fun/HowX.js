"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const Random_1 = require("../../utils/Random");
const data = new discord_js_1.SlashCommandBuilder()
    .setName("how")
    .setDescription("How \"somthing\" is someone")
    .addStringOption(option => option
    .setName("criteria")
    .setDescription("What to measure the percentage of")
    .setRequired(true))
    .addMentionableOption(option => option
    .setName("user")
    .setDescription("Who should the criteria be tested against"));
exports.data = data;
async function execute(interaction) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(`How ${interaction.options.get("criteria")?.value}`)
        .setDescription(`${interaction.options.get("user")?.member || interaction.member}: ${(0, Random_1.randomInt)(0, 101)}%`);
    await interaction.reply({ embeds: [embed] });
}
