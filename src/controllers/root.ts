import { IncomingMessage, ServerResponse } from "http";
import { ApiRoute } from "../models";

const route: string = "/";

async function execute(req: IncomingMessage, res: ServerResponse, data: {}): Promise<void> {
  res.write("FakeAwake API");
}

export default { route, execute } satisfies ApiRoute;
