"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loader;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const Log_1 = require("./Log");
const discord_js_1 = require("discord.js");
function loader(directory) {
    let successfulLoads = 0, failedLoads = 0;
    const collection = new discord_js_1.Collection();
    const files = (0, fs_1.readdirSync)(directory, { recursive: true }).filter((file) => file.toString().endsWith(".js"));
    files.forEach((file) => {
        const command = require(path_1.default.join(__dirname, directory, file.toString()));
        if (command) {
            successfulLoads++;
            collection.set(command.name, command);
            (0, Log_1.log)(`Successfully loaded the command "${command.name}" from "${file}"`);
        }
        else {
            failedLoads++;
            (0, Log_1.logError)(`Failed to load the command at "${file}. It might be missing it's "data" or "execute" property.`);
        }
    });
    (0, Log_1.log)(`Found ${files.length} items with ${successfulLoads} successfully loaded and ${failedLoads} failures`);
}
