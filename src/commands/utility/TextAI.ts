import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import OpenAI from "openai";
import { logError } from "../../services/Api";
import { ChatCompletionCreateParamsBase, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { Thread } from "openai/resources/beta/threads/threads";
import { Message } from "openai/resources/beta/threads/messages";
import { Run } from "openai/resources/beta/threads/runs/runs";

// Key will be the channel ID
const threads: Map<string, Thread> = new Map();
const messageLimit: number = 10;
const dateTime = new Date();
const assistantId = "asst_pXLCP8LRtVSeup8g1SNVPJp7";
const openAi = new OpenAI({
    apiKey: process.env.OPENAI_TOKEN
});

const data = new SlashCommandBuilder()
    .setName("fakeawake")
    .setDescription("Lets talk")
    .addStringOption(option =>
        option
            .setName("message")
            .setDescription("Message to start or continue the conversation with.")
            .setRequired(true)
    );

async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const message = interaction.options.get("message");
    
    if (!message) {
        logError("[TextAI] Failed to obtain \"message\" parameter.");
        await interaction.editReply("Internal Error");
        return;
    }

    const thread: Thread = threads.get(interaction.channelId) || await openAi.beta.threads.create();
    const threadMessage: Message = await openAi.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message.value as string,
        metadata: {
            currentDateAndTime: dateTime.toString()
        }
    });

    let run: Run = await openAi.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistantId,
        max_completion_tokens: 200
    });

    if (run.status === "completed") {
        const messages = await openAi.beta.threads.messages.list(run.thread_id);
        interaction.editReply((messages.data[0].content[0] as any).text.value);
    }

    threads.set(interaction.channelId, thread);
}

export { data, execute };
