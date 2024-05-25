import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import OpenAI from "openai";
import { DiffusionPipeline } from '@aislamov/diffusers.js'
import sharp from "sharp";
import { logError } from "../../services/Api";
import { deleteFile, downloadFile, tempPath } from "../../utils/FileManager";

const imagePath: string = tempPath + "generated.png";
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
    )
    .addStringOption(option =>
        option
            .setName("engine")
            .setDescription("What engine should be used in generating the image.")
            .setRequired(false)
            .addChoices(
                { name: "Dall-E 3", value: "dall-e-3" },
                { name: "Stable Diffusion (Default)", value: "stable-diffusion" }
            )
    );

async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const message = interaction.options.get("prompt");
    const engine = interaction.options.get("engine");

    if (!message) {
        logError("[ImageAI] Failed to obtain \"message\" parameter.");
        await interaction.editReply("Internal Error");
        return;
    }

    const prompt = message.value as string;

    switch (engine?.value as string) {
        case "dall-e-3":
            const response = await openAi.images.generate({ model: "dall-e-3", prompt: prompt, n: 1, size: "1792x1024" });
            const url = response.data[0].url as string;
            if (url) {
                await downloadFile(url, imagePath);
                await interaction.editReply({ files: [imagePath] });
                await deleteFile(imagePath);
            }
            break;

        default:
            interaction.editReply("You are using the default engine which is quite slow, this might take a while")
            const pipe = await DiffusionPipeline.fromPretrained("aislamov/stable-diffusion-2-1-base-onnx", { revision: "cpu" });
            const images = pipe.run({
                prompt: prompt,
                numInferenceSteps: 30
            });
            console.log(images.length);
            const data = sharp(images[0]).toFile(imagePath);
            await interaction.editReply({ files: [imagePath] });
            await deleteFile(imagePath);
    }
}

export { data, execute };
