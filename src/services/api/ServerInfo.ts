import { ChannelType, Client, GuildMember } from "discord.js";
import { Server } from "../../types/Server";

type Data = { serverId: string };

const path: string = "/serverinfo";

async function execute(client: Client, data: Data): Promise<Server | { error: string }> {
  if (!(data satisfies Data)) {
    return {
      error: "Required parameters - serverId: string",
    };
  }

  const server = client.guilds.cache.get(data.serverId);

  if (!server) return { error: `Server with id "${data.serverId}" not found` };

  const { id, name, memberCount, createdTimestamp, joinedTimestamp } = server;
  const iconUrl = server.iconURL() as string;
  const channels = server.channels.cache.map((channel) => ({
    id: channel.id,
    name: channel.name,
    type: ChannelType[channel.type],
  }));
  const _owner = await server.fetchOwner();
  const owner = {
    id: _owner.id,
    name: _owner.user.username,
    avatarUrl: _owner.user.displayAvatarURL(),
  };

  return { id, name, memberCount, createdTimestamp, joinedTimestamp, iconUrl, owner, channels };
}

export { path, execute };
