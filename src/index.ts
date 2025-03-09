import "dotenv/config";
import { bot, cli, db } from "./services";

db.connectToDatabase();
cli.start();
bot.start(process.env.BOT_TOKEN!);