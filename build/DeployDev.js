"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const commands = [];
const rest = new discord_js_1.REST().setToken(process.env.DISCORD_TOKEN);
const commandFiles = (0, fs_1.readdirSync)("./commands", { recursive: true }).filter(file => file.toString().endsWith(".js"));
commandFiles.forEach(commandFile => {
    const command = require(path_1.default.join(__dirname, "./commands", commandFile.toString()));
    if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
        console.log(`Prepared the command "${command.data.name}" for registry.`);
    }
    else {
        console.error(`Failed to prepare the command at "${commandFile}" for registry. It might be missing it's "data" or "execute" property.`);
    }
});
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_SERVER_ID), { body: [] });
        console.log("Deleted all commands for the Bot Testing server.");
        const data = await rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_SERVER_ID), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (e) {
        console.error(e);
    }
})();
