import { readdirSync } from "fs";
import BotCommand from "../../models/bot-command";
import { log, logError } from "../../utilities";

const commands = new Map<string, BotCommand>();

function loadCommands(directory: string) {
  const folders = readdirSync(directory);

  for (const folder of folders) {
    const commandDirectory = `${directory}/${folder}`;
    const commandFiles = readdirSync(commandDirectory).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`${commandDirectory}/${file}`).default;
      if (command satisfies BotCommand) {
        commands.set(command.data.name, command);
        log(`Command "${command.data.name}" loaded`);
      } else {
        logError(`Command "${command.data.name}" does not satisfy the type BotCommand`);
      }
    }
  }
}

export { commands, loadCommands };
