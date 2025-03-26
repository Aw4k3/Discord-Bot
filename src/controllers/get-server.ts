import { IncomingMessage, ServerResponse } from "http";
import { ApiRoute } from "../models";
import { bot } from "../services";
import { ChannelType, Guild, PresenceUpdateStatus } from "discord.js";

const missingTextureUrl: string = "https://developer.valvesoftware.com/w/images/8/8b/Debugempty.png";
const route: string = "/get-server";

async function execute(req: IncomingMessage, res: ServerResponse, data: { serverId: string }): Promise<void> {
  const server: Guild = await bot.client.guilds.fetch(data.serverId);
  const serverDetails: DetailedServerInfo = {
    name: server.name,
    iconUrl: server.iconURL() || missingTextureUrl,
    memberCount: server.memberCount,
    onlineMemberCount: server.members.cache.filter((member) => member.presence?.status !== PresenceUpdateStatus.Offline).size,
    ownerName: (await server.fetchOwner()).user.username,
    ownerIconUrl: (await server.fetchOwner()).user.displayAvatarURL(),
    textChannels: server.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).map((channel) => channel.name),
    voiceChannels: server.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).map((channel) => channel.name),
    roles: server.roles.cache.map((role) => role.name),
    createdTimestamp: server.createdTimestamp,
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(server));
  res.end();
}

export default { route, execute } satisfies ApiRoute;
