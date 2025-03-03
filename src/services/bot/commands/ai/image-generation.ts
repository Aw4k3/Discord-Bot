import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../../../../models";
import { deleteFile, downloadFile, logError } from "../../../../utilities";
import OpenAI from "openai";
import { ImageGenerateParams } from "openai/resources";

const path: string = ".temp/generated-image.png";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const data = new SlashCommandBuilder()
  .setName("visualise")
  .setDescription("Brooooo I'm tripping balls rn, tell me something and I'll hallucinate it for you.")
  .addStringOption((opt) => opt.setName("prompt").setDescription("Let me show you something.").setRequired(true))
  .addStringOption((opt) =>
    opt
      .setName("style")
      .setDescription("Pick an image style.")
      .addChoices([
        { name: "vivid", value: "vivid" },
        { name: "natural", value: "natural" },
      ])
  );

async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  const prompt = interaction.options.getString("prompt");
  const style = (interaction.options.getString("natural-style") || "vivid") as ImageGenerateParams["style"];

  if (!prompt) {
    interaction.editReply("Internal Error: Failed to read prompt");
    logError('[Image Generation] Failed to get "prompt" parameter');
    return;
  }

  const res = await openai.images.generate({
    model: "dall-e-3",
    n: 1,
    size: "1024x1792",
    prompt,
    style
  });

  const url = res.data[0].url;

  if (url) {
    await downloadFile(url, path);
    await interaction.editReply({ files: [path] });
    await deleteFile(path);
  }
}

export default { data, execute } satisfies BotCommand;
