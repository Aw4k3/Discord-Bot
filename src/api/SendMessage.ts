import { Client, GuildTextBasedChannel } from "discord.js";

type Data = { textChannelId: string; message: string };

const path: string = "/sendmessage";

function execute(client: Client, data: Data): {} {
  if (!(data satisfies Data)) {
    return {
      error: "Required parameters - textChannelId: string, message: string",
    };
  }

  const textChannel = client.channels.cache.get(data.textChannelId);

  if (!textChannel) {
    return { error: `Server with id "${data.textChannelId}" not found` };
  }

  try {
    (textChannel as GuildTextBasedChannel).send(data.message);
    return {
      message: `Successfully sent message to channel "${(textChannel as GuildTextBasedChannel).guild.name} > ${
        (textChannel as GuildTextBasedChannel).name
      }"`,
    };
  } catch (error) {
    return {
      error: `Failed to send message to channel "${(textChannel as GuildTextBasedChannel).guild.name} > ${
        (textChannel as GuildTextBasedChannel).name
      }"`,
    };
  }
}

export { path, execute };
