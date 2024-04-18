import "dotenv/config";
import { Client, Events, GatewayIntentBits, Collection, Interaction, ActivityType } from "discord.js";
import { readdirSync } from "fs";
import { log, logError } from "./services/Api";
import { ICommand } from "./Interfaces";
import path from "path"

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands: Collection<string, ICommand> = new Collection();

const commandFiles = readdirSync("./release/commands", { recursive: true }).filter(file => file.toString().endsWith(".js"));
let successfulLoads: number = 0, failedLoads: number = 0;
commandFiles.forEach(commandFile => {
    const command: ICommand = require(path.join(__dirname, "./commands", commandFile.toString()));

    if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
        successfulLoads++;
        log(`Successfully loaded the command "${command.data.name}" from "${commandFile}"`);
    } else {
        failedLoads++;
        logError(`Failed to load the command at "${commandFile}. It might be missing it's "data" or "execute" property.`);
    }
});

log(`Found ${commandFiles.length} commands with ${successfulLoads} successfully loaded and ${failedLoads} failures`);

function onReady(): void {
    console.log(`Logged in as ${client.user?.tag}`);
    client.user?.setActivity({
        name: "FakeAwake: Battle Royal",
        type: ActivityType.Competing
    })
}

async function onInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) {
        logError(`No commands matching the name "${interaction.commandName}" was found`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (e: any) {
        logError(e);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}

client.once(Events.ClientReady, onReady);
client.on(Events.InteractionCreate, onInteraction);

client.login(process.env.DISCORD_TOKEN);