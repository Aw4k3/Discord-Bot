import "dotenv/config";
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { BotCommand } from "./models";

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

const commandFiles = readdirSync("./services/bot/commands", { recursive: true }).filter((file) =>
  file.toString().endsWith(".js")
);
commandFiles.forEach((commandFile) => {
  const command = require(path.join(__dirname, "./services/bot/commands", commandFile.toString()));

  if (command.default satisfies BotCommand) {
    commands.push(command.default.data.toJSON());
    console.log(`Prepared the command "${command.default.data.name}" for registry.`);
  } else {
    console.error(`Failed to prepare the command at "${commandFile}" for registry.`);
  }
});

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.TEST_SERVER_ID as string),
      { body: [] }
    );

    console.log("Deleted all commands for the Bot Testing server.");

    const data: any = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.TEST_SERVER_ID as string),
      { body: commands }
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (e) {
    console.error(e);
  }
})();
