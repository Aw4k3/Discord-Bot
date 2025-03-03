import { ActivityType, Client, Events, GatewayIntentBits, Interaction, MessageFlags } from "discord.js";
import { commands, loadCommands } from "./command-handler";
import { log, logError } from "../../utilities";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function onReady(client: Client<true>) {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  client.user.setActivity({
    name: "My last 2 transistors are fighting for 3rd place 🐒",
    type: ActivityType.Competing,
  });
}

async function onInteractionCreate(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    logError(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  log(`Command "${interaction.commandName}" executed by ${interaction.user.tag}`);
}

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
