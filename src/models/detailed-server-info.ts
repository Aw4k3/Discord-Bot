type DetailedServerInfo = {
  memberCount: number;
  onlineMemberCount: number;
  ownerName: string;
  ownerIconUrl: string;
  textChannels: string[];
  voiceChannels: string[];
  roles: string[];
  createdTimestamp: number;
} & BasicServerInfo;
