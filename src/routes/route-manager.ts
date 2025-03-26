import { readdirSync } from "fs";
import { ApiRoute } from "../models";
import { log, logError } from "../utilities";

const routes = new Map<string, ApiRoute>();

function loadRoutes(directory: string) {
  const folders: string[] = readdirSync(directory);

  log(">>> Loading API Routes <<<");

  const routeFiles: string[] = readdirSync(directory).filter((file) => file.endsWith(".js"));

    for (const file of routeFiles) {
      const route: ApiRoute = require(`${directory}/${file}`).default;
      if (route satisfies ApiRoute) {
        routes.set(route.route, route);
        log(`Command "${route.route}" loaded`);
      } else {
        logError(`Command "${route.route}" does not satisfy the type ApiRoute`);
      }
    }
}

export { routes, loadRoutes };
