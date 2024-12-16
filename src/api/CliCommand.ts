import { Client } from "discord.js";

export interface ICliCommand {
    name: string,
    execute: (client: Client, args: string[]) => void;
}