import { Client } from "pg";
import { log } from "../utils/Log";

const client = new Client({
  host: "192.168.1.168",
  user: "admin",
  password: process.env.POSTGRESS_PASSWORD,
  database: "fakeawake",
});

export async function connectToDatabase(): Promise<void> {
  try {
    async () => {
      await client.connect();
      log("Connected to the database");
      await client.query(
        "IF NOT EXISTS TABLE CommandHistory THEN CREATE TABLE CommandHistory (id SMALLINT PRIMARY KEY, commandId TEXT NOT NULL, userId TEXT NOT NULL, channelId TEXT NOT NULL, timestamp TEXT NOT NULL);"
      );
    };
  } catch (e: any) {
    log(e);
  }
}
