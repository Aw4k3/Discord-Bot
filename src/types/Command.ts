import { Interaction, SlashCommandBuilder } from "discord.js";

export type BotCommand = {
    data: SlashCommandBuilder,
    execute: (interaction: Interaction) => void;
}