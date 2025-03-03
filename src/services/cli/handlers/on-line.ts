import bot from "../../bot";
import { commands } from "../command-manager";

function onLine(input: string) {
  const args: string[] = input.split(" ");
  const alias: string = args.shift()!;
  const command = commands.get(alias);

  if (command) {
    command.execute(bot.client, args);
  }
}

export default onLine;
