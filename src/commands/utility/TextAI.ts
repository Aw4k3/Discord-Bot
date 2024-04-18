import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import OpenAI from "openai";
import { logError } from "../../services/Api";
import { ChatCompletionCreateParamsBase, ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Key will be the channel ID
const conversations: Map<string, ChatCompletionMessageParam[]> = new Map<string, ChatCompletionMessageParam[]>();
const conversationMessageLimit: number = 10;
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
        return;
    }

    const conversation: ChatCompletionMessageParam[] = conversations.get(interaction.channelId) || [{ role: "system", content: "Your name is FakeAwake, you are a casual AI. Use UK English."}];
    conversation.push({ role: "user", content: message.value as string });

    const response = await openAi.chat.completions.create({
        model: "gpt-4",
        max_tokens: 150,
        messages: conversation
    });

    const reply = response.choices[0].message.content as string;

    if (reply === "") {
        logError("[TextAI] Failed to generate reply.");
        await interaction.reply("I don't know (╯°□°)╯︵ ┻━┻");
        return;
    } else {
        await interaction.editReply(reply);
        conversation.push({ role: "assistant", content: reply });
        if (conversation.length > conversationMessageLimit) conversation.shift();
        conversations.set(interaction.channelId, conversation);
    }
}

export { data, execute };
