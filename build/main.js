"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const Api_1 = require("./services/Api");
const path_1 = __importDefault(require("path"));
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
const commands = new discord_js_1.Collection();
const commandFiles = (0, fs_1.readdirSync)("./commands", { recursive: true }).filter(file => file.toString().endsWith(".js"));
let successfulLoads = 0, failedLoads = 0;
commandFiles.forEach(commandFile => {
    const command = require(path_1.default.join(__dirname, "./commands", commandFile.toString()));
    if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
        successfulLoads++;
        (0, Api_1.log)(`Successfully loaded the command "${command.data.name}" from "${commandFile}"`);
    }
    else {
        failedLoads++;
        (0, Api_1.logError)(`Failed to load the command at "${commandFile}. It might be missing it's "data" or "execute" property.`);
    }
});
(0, Api_1.log)(`Found ${commandFiles.length} commands with ${successfulLoads} successfully loaded and ${failedLoads} failures`);
function onReady() {
    (0, Api_1.log)(`Logged in as ${client.user?.tag}`);
    client.user?.setActivity({
        name: "FakeAwake: Battle Royal",
        type: discord_js_1.ActivityType.Competing
    });
}
async function onInteraction(interaction) {
    if (!interaction.isChatInputCommand())
        return;
    const command = commands.get(interaction.commandName);
    if (!command) {
        (0, Api_1.logError)(`No commands matching the name "${interaction.commandName}" was found`);
        return;
    }
    try {
        await command.execute(interaction);
        (0, Api_1.log)(`${interaction.user.displayName} executed ${interaction.commandName}`);
    }
    catch (e) {
        (0, Api_1.logError)(e);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}
client.once(discord_js_1.Events.ClientReady, onReady);
client.on(discord_js_1.Events.InteractionCreate, onInteraction);
client.login(process.env.DISCORD_TOKEN);
