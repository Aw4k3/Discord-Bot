import "dotenv/config";
import { bot, cli } from "./services";

bot.start(process.env.BOT_TOKEN!);
cli.start();