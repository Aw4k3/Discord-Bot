import "dotenv/config";
import { Client, Events, GatewayIntentBits, Collection, Interaction, ActivityType, GuildTextBasedChannel, Guild } from "discord.js";
import { readdirSync } from "fs";
import { log, logDebug, logError } from "./utils/Log";
import path from "path";
import { BotCommand } from "./types/Command";
import { CliCommand } from "./types/CliCommand";
import readline from "node:readline";
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { Endpoint } from "./types/Endpoint";
import { connectToDatabase, insertCommandHistory } from "./services/DatabaseAccess";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// #region Load Bot Commands
const botCommands: Collection<string, BotCommand> = new Collection();
const commandFiles = readdirSync("./commands", { recursive: true }).filter((file) => file.toString().endsWith(".js"));
let successfulLoads: number = 0,
  failedLoads: number = 0;
commandFiles.forEach((commandFile) => {
  const command: BotCommand = require(path.join(__dirname, "./commands", commandFile.toString()));

  if ("data" in command && "execute" in command) {
    successfulLoads++;
    botCommands.set(command.data.name, command);
    log(`Successfully loaded the command "${command.data.name}" from "${commandFile}"`);
  } else {
    failedLoads++;
    logError(`Failed to load the command at "${commandFile}. It might be missing it's "data" or "execute" property.`);
  }
});

log(
  `Found ${commandFiles.length} bot commands with ${successfulLoads} successfully loaded and ${failedLoads} failures`
);

// #endregion

// #region Load CLI Commands
const cliCommands: Collection<string, CliCommand> = new Collection();
successfulLoads = 0;
failedLoads = 0;

const cliCommandFiles = readdirSync("./cli", { recursive: true }).filter((file) => file.toString().endsWith(".js"));

cliCommandFiles.forEach((commandFile) => {
  const command: CliCommand = require(path.join(__dirname, "./cli", commandFile.toString()));
  if ("name" in command && "execute" in command) {
    successfulLoads++;
    cliCommands.set(command.name, command);
    log(`Successfully loaded the command "${command.name}" from "${commandFile}"`);
  } else {
    failedLoads++;
    logError(`Failed to load the command at "${commandFile}. It might be missing it's "data" or "execute" property.`);
  }
});

log(
  `Found ${commandFiles.length} CLI commands with ${successfulLoads} successfully loaded and ${failedLoads} failures`
);

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

// #endregion

// #region Load API Endpoints
const endpoints: Collection<string, Endpoint> = new Collection();
successfulLoads = 0;
failedLoads = 0;

const endpointFiles = readdirSync("./services/api", {
  recursive: true,
}).filter((file) => file.toString().endsWith(".js"));

endpointFiles.forEach((endpointFile) => {
  const endpoint: Endpoint = require(path.join(__dirname, "./services/api", endpointFile.toString()));
  if (endpoint satisfies Endpoint) {
    successfulLoads++;
    endpoints.set(endpoint.path, endpoint);
    log(`Successfully loaded the endpoint "${endpoint.path}" from "${endpointFile}"`);
  } else {
    failedLoads++;
    logError(`Failed to load the endpoint at "${endpointFile}. It might be missing it's "data" or "execute" property.`);
  }
});

log(`Found ${endpointFiles.length} endpoints with ${successfulLoads} successfully loaded and ${failedLoads} failures`);

const webServer = http.createServer(requestListener);

async function requestListener(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "Content-Type",
    });
    res.end();
    return;
  }

  res.writeHead(200, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
  });

  const endpoint = endpoints.get(req.url as string);

  if (!endpoint) {
    res.write(JSON.stringify({ message: "Endpoint not found" }));
    res.end();
    return;
  }

  log(`Received request for ${req.url}`);

  if (req.method === "POST") {
    let data: string = "";

    req.on("data", (chunk: string) => {
      data += chunk;
    });

    req.on("end", async () => {
      const json = JSON.parse(data);
      logDebug(data);
      const result = await endpoint.execute(client, json);
      res.write(JSON.stringify(result));
      res.end();
    });
  } else {
    res.write(JSON.stringify(await endpoint.execute(client)));
    res.end();
  }
}

webServer.listen(process.env.API_PORT);

// #endregion

// #region Database Connection
(async () => {
  await connectToDatabase();
})();

// #endregion

// #region Bot Events
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
    logError(`No commands matching the name "${interaction.commandName}" was found`);
    return;
  }

  try {
    await command.execute(interaction);
    log(`${interaction.user.displayName} executed ${interaction.commandName}`);
    
    insertCommandHistory(
      interaction.commandName,
      JSON.stringify(interaction.options.data),
      interaction.user.id,
      interaction.user.displayName,
      interaction.user.avatarURL() as string,
      (interaction.channel as GuildTextBasedChannel).id,
      (interaction.channel as GuildTextBasedChannel).name,
      (interaction.guild as Guild).id,
      (interaction.guild as Guild).name,
      (interaction.guild as Guild).iconURL() as string,
      Date.now().toString(),
    );
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

// #endregion
