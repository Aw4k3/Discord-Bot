type BotCommandEntry = {
  id: number;
  commandName: string;
  commandOptions: string;
  userDiscriminator: string;
  userIconUrl: string;
  channelName: string;
  guildName: string;
  guildIconUrl: string;
  timestamp: number;
};

export default BotCommandEntry;
