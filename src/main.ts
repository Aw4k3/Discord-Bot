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
import { log, logError } from "./utils/Log";
import path from "path";
import { ICommand } from "./api/Command";
import { ICliCommand } from "./api/CliCommand";
import readline from "node:readline";
import https from "https";
import { IncomingMessage, ServerResponse } from "http";
import { IEndpoint } from "./api/Endpoint";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/* Load Bot Commands */
const botCommands: Collection<string, ICommand> = new Collection();
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
    successfulLoads++;
    botCommands.set(command.data.name, command);
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
  `Found ${commandFiles.length} bot commands with ${successfulLoads} successfully loaded and ${failedLoads} failures`
);

/* Load CLI Commands */
const cliCommands: Collection<string, ICliCommand> = new Collection();
successfulLoads = 0;
failedLoads = 0;

const cliCommandFiles = readdirSync("./cli", { recursive: true }).filter(
  (file) => file.toString().endsWith(".js")
);

cliCommandFiles.forEach((commandFile) => {
  const command: ICliCommand = require(path.join(
    __dirname,
    "./cli",
    commandFile.toString()
  ));
  if ("name" in command && "execute" in command) {
    successfulLoads++;
    cliCommands.set(command.name, command);
    log(
      `Successfully loaded the command "${command.name}" from "${commandFile}"`
    );
  } else {
    failedLoads++;
    logError(
      `Failed to load the command at "${commandFile}. It might be missing it's "data" or "execute" property.`
    );
  }
});

log(
  `Found ${commandFiles.length} CLI commands with ${successfulLoads} successfully loaded and ${failedLoads} failures`
);

/* Initialise CLI */
const stdin = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

stdin.on("line", onInput);

function onInput(input: string): void {
  if (input.toLowerCase() === "help") {
    cliCommands.forEach((command) => log(command.name));
    return;
  }
  const args: string[] = input.toLowerCase().split(" ");
  const command = cliCommands.get(args.shift() as string);

  if (command) command.execute(client, args);
  else log(`"${input}" is not a command`);
}


/* Initialise Web Server */
const endpoints: Collection<string, object> = new Collection();
const host = "localhost";
const port = 8000;
successfulLoads = 0;
failedLoads = 0;

const endpointFiles = readdirSync("./api/endpoints/", { recursive: true }).filter(
  (file) => file.toString().endsWith(".js")
);

endpointFiles.forEach((endpointFile) => {
  const endpoint: IEndpoint = require(path.join(
    __dirname,
    "./api/endpoints/",
    endpointFile.toString()
  ));
  if ("name" in endpoint && "execute" in endpoint) {
    successfulLoads++;
    endpoints.set(endpoint.path, endpoint);
    log(
      `Successfully loaded the endpoint "${endpoint.name}" from "${endpointFile}"`
    );
  } else {
    failedLoads++;
    logError(
      `Failed to load the endpoint at "${endpointFile}. It might be missing it's "data" or "execute" property.`
    );
  }
});

log(
  `Found ${endpoints.length} endpoints with ${successfulLoads} successfully loaded and ${failedLoads} failures`
);

const webServer = https.createServer(requestListener);

function requestListener(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "content-type": "application/json" });
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

  const command = botCommands.get(interaction.commandName);

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
