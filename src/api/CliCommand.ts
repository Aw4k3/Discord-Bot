import { Client } from "discord.js";

export interface ICliCommand {
    name: string,
    execute: (client: Client) => void;
}