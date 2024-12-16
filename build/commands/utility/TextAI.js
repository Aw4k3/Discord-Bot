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
// Key will be the channel ID
const threads = new Map();
const messageLimit = 10;
const dateTime = new Date();
const assistantId = "asst_pXLCP8LRtVSeup8g1SNVPJp7";
const openAi = new openai_1.default({
    apiKey: process.env.OPENAI_TOKEN
});
const data = new discord_js_1.SlashCommandBuilder()
    .setName("fakeawake")
    .setDescription("Lets talk")
    .addStringOption(option => option
    .setName("message")
    .setDescription("Message to start or continue the conversation with.")
    .setRequired(true));
exports.data = data;
for (var i = 0; i < 10; i++) {
    data.addAttachmentOption(option => option
        .setName(`attachment-${i}`)
        .setDescription("Add attachments for FakeAwake to stare at.")
        .setRequired(false));
}
async function execute(interaction) {
    await interaction.deferReply();
    const message = interaction.options.get("message");
    const images = [];
    if (!message) {
        (0, Log_1.logError)("[TextAI] Failed to obtain \"message\" parameter.");
        await interaction.editReply("Internal Error");
        return;
    }
    for (var i = 0; i < 10; i++) {
        const attachment = interaction.options.get(`image-${i}`);
        if (attachment)
            images.push({
                type: "image_url",
                image_url: { url: attachment.attachment?.url }
            });
    }
    const thread = threads.get(interaction.channelId) || await openAi.beta.threads.create();
    const threadMessage = await openAi.beta.threads.messages.create(thread.id, {
        role: "user",
        content: [
            { type: "text", text: message.value },
            ...images
        ],
        metadata: {
            currentDateAndTime: dateTime.toString()
        }
    });
    let run = await openAi.beta.threads.runs.createAndPoll(thread.id, {
        assistant_id: assistantId,
        max_completion_tokens: 400
    });
    switch (run.status) {
        case "completed":
            const messages = await openAi.beta.threads.messages.list(run.thread_id);
            interaction.editReply(messages.data[0].content[0].text.value);
            break;
        case "cancelled":
            (0, Log_1.logError)("[TextAI] Run was cancelled.");
            interaction.editReply("Internal Error: Request was cancelled.");
            break;
        case "failed":
            (0, Log_1.logError)("[TextAI] Run failed.");
            interaction.editReply("Internal Error: Request resulted in a failure.");
            break;
        case "incomplete":
            (0, Log_1.logError)("[TextAI] Run ended, incomplete.");
            interaction.editReply("Internal Error: Failed to complete request.");
            break;
    }
    threads.set(interaction.channelId, thread);
}
