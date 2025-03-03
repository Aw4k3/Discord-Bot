import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import OpenAI from "openai";
import { BotCommand } from "../../../../models";
import { logError } from "../../../../utilities";
import { MessageContentPartParam } from "openai/resources/beta/threads/messages";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const threads = new Map<string, OpenAI.Beta.Thread>();

const data = new SlashCommandBuilder()
  .setName("fakeawake")
  .setDescription("👁️👄👁️")
  .addStringOption((opt) => opt.setName("prompt").setDescription("prompt").setRequired(true));

for (let i = 0; i < 10; i++) data.addAttachmentOption((opt) => opt.setName(`file-${i}`).setDescription(`file-${i}`));

async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const prompt = interaction.options.getString("prompt");
  const images: MessageContentPartParam[] = [];

  for (let i = 0; i < 10; i++) {
    const file = interaction.options.getAttachment(`file-${i}`);
    if (file) {
      images.push({
        type: "image_url",
        image_url: { url: file.url, detail: "low" },
      });
    }
  }

  if (!prompt) {
    interaction.editReply("Internal Error: Failed to read prompt");
    logError('[Image Generation] Failed to get "prompt" parameter');
    return;
  }

  if (!threads.has(interaction.guildId!)) threads.set(interaction.guildId!, await openai.beta.threads.create());

  const thread = threads.get(interaction.guildId!)!;
  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: [
      {
        type: "text",
        text: prompt,
      },
      ...images,
    ],
  });
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: "asst_pXLCP8LRtVSeup8g1SNVPJp7",
    max_completion_tokens: 400,
  });

  switch (run.status) {
    case "completed":
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      interaction.editReply((messages.data[0].content[0] as any).text.value);
      break;

    case "cancelled":
      logError("[Text Generation] Run was cancelled.");
      interaction.editReply("Internal Error: Request was cancelled.");
      break;

    case "failed":
      logError("[Text Generation] Run failed.");
      interaction.editReply("Internal Error: Request resulted in a failure.");
      break;

    case "incomplete":
      logError("[Text Generation] Run ended, incomplete.");
      interaction.editReply("Internal Error: Failed to complete request.");
      break;
  }
}

export default { data, execute } satisfies BotCommand;
