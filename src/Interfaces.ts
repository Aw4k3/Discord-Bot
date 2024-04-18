import { Interaction, SlashCommandBuilder } from "discord.js";

export interface ICommand {
    data: SlashCommandBuilder,
    execute: (interaction: Interaction) => void;
}