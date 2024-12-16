import "dotenv/config";
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  Interaction,
  ActivityType,
} from "discord.js";
import { readdirSync } from "fs";
import { log, logError } from "./api/Log";
import path from "path";
import { ICommand } from "./api/Command";
import { ICliCommand } from "./api/CliCommand";
import readline from "node:readline";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands: Collection<string, ICommand> = new Collection();
const cliCommands: Collection<string, ICliCommand> = new Collection();

/* Load Bot Commands */
const commandFiles = readdirSync("./commands", { recursive: true }).filter(
  (file) => file.toString().endsWith(".js")
);
let successfulLoads: number = 0,
  failedLoads: number = 0;
commandFiles.forEach((commandFile) => {
  const command: ICommand = require(path.join(
    __dirname,
    "./commands",
    commandFile.toString()
  ));

  if ("data" in command && "execute" in command) {
    commands.set(command.data.name, command);
    successfulLoads++;
    log(
      `Successfully loaded the command "${command.data.name}" from "${commandFile}"`
    );
  } else {
    failedLoads++;
    logError(
      `Failed to load the command at "${commandFile}. It might be missing it's "data" or "execute" property.`
    );
  }
});

log(
  `Found ${commandFiles.length} commands with ${successfulLoads} successfully loaded and ${failedLoads} failures`
);

/* Load CLI Commands */
const cliCommandFiles = readdirSync("./cli", { recursive: true }).filter(
  (file) => file.toString().endsWith(".js")
);

cliCommandFiles.forEach(commandFile => {
    const command: ICliCommand = require(path.join(__dirname, "./cli", commandFile.toString()));
    cliCommands.set(command.name, command);
});
console.log(commands);

/* Initialise CLI */
const stdin = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  stdin.on("line", onInput);

  function onInput(input: string): void {
    if (input.toLowerCase() === "help") {
        cliCommands.forEach(command => log(command.name));
        return;
    }

    const command = cliCommands.get(input.toLowerCase());

    if (command) command.execute(client);
    else log(`"${input}" is not a command`);
  }

/* Bot Ready */
function onReady(): void {
  log(`Logged in as ${client.user?.tag}`);
  client.user?.setActivity({
    name: "FakeAwake: Battle Royal",
    type: ActivityType.Competing,
  });
}

async function onInteraction(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    logError(
      `No commands matching the name "${interaction.commandName}" was found`
    );
    return;
  }

  try {
    await command.execute(interaction);
    log(`${interaction.user.displayName} executed ${interaction.commandName}`);
  } catch (e: any) {
    logError(e);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}

client.once(Events.ClientReady, onReady);
client.on(Events.InteractionCreate, onInteraction);

client.login(process.env.DISCORD_TOKEN);
