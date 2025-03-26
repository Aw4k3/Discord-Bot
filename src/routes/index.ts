import { createServer, IncomingMessage, ServerResponse } from "http";
import { log } from "../utilities";
import { loadRoutes, routes } from "./route-manager";
import path from "path";

const server = createServer(listener);

function start(port: number = 8080) {
  loadRoutes(path.join(__dirname, "../controllers"));
  server.listen(port, () => log(`Server running on port ${port}`));
}

function listener(req: IncomingMessage, res: ServerResponse) {
  const route = routes.get(req.url!);

  if (route) {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      route.execute(req, res, JSON.parse(data));
    });

    // route.execute(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write("Not Found");
    res.end();
  }
}

export default { start };
