import { Client } from "discord.js";
import { ServerResponse } from "http";

export interface IEndpoint {
  path: string;
  execute: (client: Client) => {};
}
