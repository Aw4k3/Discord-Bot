import { log } from "console";
import { readdirSync } from "fs";
import { CliCommand } from "../../models";
import { logError } from "../../utilities";

const commands = new Map<string, CliCommand>();

function loadCommands(directory: string) {
  const folders = readdirSync(directory);

  for (const folder of folders) {
    const commandDirectory = `${directory}/${folder}`;
    const commandFiles = readdirSync(commandDirectory).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command: CliCommand = require(`${commandDirectory}/${file}`).default;
      if (command satisfies CliCommand) {
        commands.set(command.alias, command);
        log(`Command "${command.alias}" loaded`);
      } else {
        logError(`Command "${command.alias}" does not satisfy the type CliCommand`);
      }
    }
  }
}

export { commands, loadCommands };
