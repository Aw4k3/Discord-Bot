import { IncomingMessage, ServerResponse } from "http";

type ApiRoute = {
  route: string;
  execute: (req: IncomingMessage, res: ServerResponse, data: any) => Promise<void>;
};

export default ApiRoute;
