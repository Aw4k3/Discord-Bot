export type Server = {
  id: string;
  name: string;
  iconUrl: string;
  memberCount: number;
  createdTimestamp: number;
  joinedTimestamp: number;
  owner: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  channels: {
    id: string;
    name: string;
    type: string;
  }[];
};
