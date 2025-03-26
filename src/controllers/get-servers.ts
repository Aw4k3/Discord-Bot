import { IncomingMessage, ServerResponse } from "http";
import { ApiRoute } from "../models";
import { bot } from "../services";

const missingTextureUrl: string = "https://developer.valvesoftware.com/w/images/8/8b/Debugempty.png";
const route: string = "/get-servers";

async function execute(req: IncomingMessage, res: ServerResponse, data: {}): Promise<void> {
  const servers: BasicServerInfo[] = bot.client.guilds.cache.map((guild) => {
    return { name: guild.name, iconUrl: guild.iconURL() ?? missingTextureUrl };
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(servers));
  res.end();
}

export default { route, execute } satisfies ApiRoute;
