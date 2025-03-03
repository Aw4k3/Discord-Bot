import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands, loadCommands } from "./command-manager";
import { onInteractionCreate, onReady } from "./handlers";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function start(token: string) {
  loadCommands(`${__dirname}/commands`);
  client.once(Events.ClientReady, onReady);
  client.on(Events.InteractionCreate, onInteractionCreate);
  client.login(token);
}

export default {
  client,
  commands,
  start,
};
