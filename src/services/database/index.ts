import { Client } from "pg";
import { log } from "../../utilities";
import createBotCommandEntry from "./create-bot-command-entry";

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? undefined : undefined,
  user: "admin",
  password: process.env.DB_PASSWORD,
  database: "fakeawake",
});

client.on("error", (err) => {
  console.error(err.stack);
});

async function connectToDatabase() {
  await client.connect();
  log("Connected to database");
  await client.query(
    `
    CREATE TABLE IF NOT EXISTS CommandHistory (
    id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    commandName TEXT NOT NULL,
    commandOptions TEXT NOT NULL,
    userDiscriminator TEXT NOT NULL,
    userIconUrl TEXT NOT NULL,
    channelName TEXT NOT NULL,
    guildName TEXT NOT NULL,
    guildIconUrl TEXT NOT NULL,
    timestamp BIGINT NOT NULL
    );
    `
  );
}

export default {
  client,
  connectToDatabase,
  createBotCommandEntry
};
