import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import OpenAI from "openai";
import { logError } from "../../utils/Log";
import { deleteFile, downloadFile } from "../../utils/FileManager";

const imagePath: string = "./temp/generated.png";
const openAi = new OpenAI({
    apiKey: process.env.OPENAI_TOKEN
});

const data = new SlashCommandBuilder()
    .setName("visualise")
    .setDescription("Give me a prompt and I'll turn it into an image.")
    .addStringOption(option =>
        option
            .setName("prompt")
            .setDescription("Prompt")
            .setRequired(true)
    );

async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const message = interaction.options.get("prompt");
    
    if (!message) {
        logError("[ImageAI] Failed to obtain \"message\" parameter.");
        await interaction.editReply("Internal Error");
        return;
    }

    const prompt = message.value as string;
    const response = await openAi.images.generate({ model: "dall-e-3", prompt: prompt, n: 1, size: "1792x1024"});
    const url = response.data[0].url;

    if (url) {
        await downloadFile(url, imagePath);
        await interaction.editReply({ files: [imagePath] });
        await deleteFile(imagePath);
    }
}

export { data, execute };
