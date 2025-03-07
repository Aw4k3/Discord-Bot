type BotCommandEntry = {
  id: number;
  commandName: string;
  commandOptions: Map<string, any>;
  userDiscriminator: string;
  userIconUrl: string;
  channelName: string;
  guildName: string;
  guildIconUrl: string;
  timestamp: number;
};

export default BotCommandEntry;
