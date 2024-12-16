"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const openai_1 = __importDefault(require("openai"));
const Log_1 = require("../../api/Log");
const FileManager_1 = require("../../utils/FileManager");
const imagePath = "./temp/generated.png";
const openAi = new openai_1.default({
    apiKey: process.env.OPENAI_TOKEN
});
const data = new discord_js_1.SlashCommandBuilder()
    .setName("visualise")
    .setDescription("Give me a prompt and I'll turn it into an image.")
    .addStringOption(option => option
    .setName("prompt")
    .setDescription("Prompt")
    .setRequired(true));
exports.data = data;
async function execute(interaction) {
    await interaction.deferReply();
    const message = interaction.options.get("prompt");
    if (!message) {
        (0, Log_1.logError)("[ImageAI] Failed to obtain \"message\" parameter.");
        await interaction.editReply("Internal Error");
        return;
    }
    const prompt = message.value;
    const response = await openAi.images.generate({ model: "dall-e-3", prompt: prompt, n: 1, size: "1792x1024" });
    const url = response.data[0].url;
    if (url) {
        await (0, FileManager_1.downloadFile)(url, imagePath);
        await interaction.editReply({ files: [imagePath] });
        await (0, FileManager_1.deleteFile)(imagePath);
    }
}
