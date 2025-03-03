import { Client } from "pg";
import { log } from "../utils/Log";
import { CommandHistoryData } from "../types/CommandHistoryData";

const client = new Client({
  host: process.env.DATABASE_ADDRESS,
  port: process.env.DATABASE_PORT as number | undefined,
  user: "admin",
  password: process.env.DATABASE_PASSWORD,
  database: "fakeawake",
});

export async function connectToDatabase(): Promise<void> {
  await client.connect();
  log("Connected to the database");
  await client.query(
    `
    CREATE TABLE IF NOT EXISTS CommandHistory (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    commandName TEXT NOT NULL,
    commandOptions TEXT NOT NULL,
    userId TEXT NOT NULL,
    userName TEXT NOT NULL,
    userIconUrl TEXT NOT NULL,
    channelId TEXT NOT NULL,
    channelName TEXT NOT NULL,
    guildId TEXT NOT NULL,
    guildName TEXT NOT NULL,
    guildIconUrl TEXT NOT NULL,
    timestamp TEXT NOT NULL
    );
    `
  );
}

client.on("error", (err) => {
  console.error(err.stack);
});

export async function insertCommandHistory(
  commandName: string,
  commandOptions: string,
  userId: string,
  userName: string,
  userIconUrl: string,
  channelId: string,
  channelName: string,
  guildId: string,
  guildName: string,
  guildIconUrl: string,
  timestamp: string
): Promise<void> {
  await client.query(
    `
    INSERT INTO CommandHistory (commandName, commandOptions, userId, userName, userIconUrl, channelId, channelName, guildId, guildName, guildIconUrl, timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
    [
      commandName,
      commandOptions,
      userId,
      userName,
      userIconUrl,
      channelId,
      channelName,
      guildId,
      guildName,
      guildIconUrl,
      timestamp,
    ]
  );
}

export async function getCommandHistory(): Promise<CommandHistoryData[]> {
  const result = await client.query<CommandHistoryData>("SELECT * FROM CommandHistory");
  return result.rows;
}
