import { db } from "..";
import { BotCommandEntry } from "../../models";

async function createBotCommandEntry(entry: BotCommandEntry) {
  await db.client.query(
    `
    INSERT INTO CommandHistory (commandName, commandOptions, userDiscriminator, userIconUrl, channelName, guildName, guildIconUrl, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      entry.commandName,
      entry.commandOptions,
      entry.userDiscriminator,
      entry.userIconUrl,
      entry.channelName,
      entry.guildName,
      entry.guildIconUrl,
      entry.timestamp,
    ]
  );
}

export default createBotCommandEntry;
