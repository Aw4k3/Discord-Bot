import { Client } from "discord.js";

export type CliCommand = {
    name: string,
    execute: (client: Client, args: string[]) => void;
}