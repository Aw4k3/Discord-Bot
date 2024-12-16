import "dotenv/config";
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { ICommand } from "./Interfaces";
import { readdirSync } from "fs";
import path from "path"

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

const commandFiles = readdirSync("./commands", { recursive: true }).filter(file => file.toString().endsWith(".js"));
commandFiles.forEach(commandFile => {
	const command: ICommand = require(path.join(__dirname, "commands", commandFile.toString()));

	if ("data" in command && "execute" in command) {
		commands.push(command.data.toJSON());
		console.log(`Prepared the command "${command.data.name}" for registry.`);
	} else {
		console.error(`Failed to prepare the command at "${commandFile}" for registry. It might be missing it's "data" or "execute" property.`);
	}
});

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data: any = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID as string),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (e) {
		console.error(e);
	}
})();