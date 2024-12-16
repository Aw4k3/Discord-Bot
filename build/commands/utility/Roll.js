"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const Random_1 = require("../../utils/Random");
const data = new discord_js_1.SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a random number between 1 ~ 100 (range can be customised)")
    .addIntegerOption(option => option
    .setName("lower")
    .setDescription("Set the lowest possible number to roll")
    .setRequired(false))
    .addIntegerOption(option => option
    .setName("upper")
    .setDescription("Set the highest possible number to roll")
    .setRequired(false));
exports.data = data;
async function execute(interaction) {
    let lower = interaction.options.get("lower")?.value || 0, upper = interaction.options.get("upper")?.value || 100;
    await interaction.reply((0, Random_1.randomInt)(lower, upper).toString());
}
