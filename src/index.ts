import "dotenv/config";
import { bot } from "./services";

bot.start(process.env.BOT_TOKEN!);
