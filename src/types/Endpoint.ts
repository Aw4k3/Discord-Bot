import { Client } from "discord.js";

export type Endpoint = {
  path: string;
  execute: (client: Client, data?: {}) => {};
}
