import { GuildMember, Message, OmitPartialGroupDMChannel } from "discord.js";
import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionUserMessageParam } from "openai/resources";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function onMessageCreate(message: OmitPartialGroupDMChannel<Message<boolean>>) {
  if (!message.mentions.users.has("707698652076048406")) return;
  
  const fakeawake: GuildMember = await message.guild!.members.fetch("707698652076048406");
  const prompt: string = message.cleanContent.replace(`@${fakeawake.displayName}`, "").trim();
  const attachments: string[] = message.attachments.map((attachment) => attachment.url);
  const reference = message.reference ? await message.fetchReference() : null;
  const referenceMessage: string = reference ? reference.cleanContent : "";
  const referenceAttachments: string[] = reference
    ? reference.attachments.map((attachment) => attachment.url)
    : [];

    // console.log(reference);
    // console.log(`${prompt.length} ${attachments.length} ${referenceMessage.length} ${referenceAttachments.length}`);

  if (prompt === "" && attachments.length < 1 && referenceMessage === "" && referenceAttachments.length < 1)
    return;

  message.channel.sendTyping();

  const input: ChatCompletionMessageParam[] = [
    {
      role: "developer",
      content:
        "Use British English and be casual but not posh. You're from the UK. Your name is FakeAwake. You were born on the 25th of February 2021.",
    },
  ];

  const content: ChatCompletionUserMessageParam["content"] = [];
  const referenceContent: ChatCompletionUserMessageParam["content"] = [];

  if (prompt !== "") content.push({ type: "text", text: prompt });
  if (attachments.length > 0) attachments.forEach((attachment) => content.push({ type: "image_url", image_url: { url: attachment } }));

  if (referenceMessage !== "") referenceContent.push({ type: "text", text: referenceMessage });
  if (referenceAttachments.length > 0) referenceAttachments.forEach((attachment) => referenceContent.push({ type: "image_url", image_url: { url: attachment } }));

  if (referenceContent.length > 0) input.push({ role: "user", content: referenceContent });
  if (content.length > 0) input.push({ role: "user", content: content });

  // console.log(referenceContent);
  // console.log(content);
  // return; // Debug return

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: false,
    messages: input,
    n: 1,
  });

  const response = completion.choices[0].message.content;
  if (response) message.reply(response);
  else message.reply("No clue mate");
}

export default onMessageCreate;
