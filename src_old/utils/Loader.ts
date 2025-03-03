import { readdirSync } from "fs";
import path from "path";
import { log, logError } from "./Log";
import { Collection } from "discord.js";

interface ILoadable {
  name: any;
}

export default function loader<K, V extends ILoadable>(directory: string) {
  let successfulLoads = 0,
    failedLoads = 0;

  const collection: Collection<K, V> = new Collection();

  const files = readdirSync(directory, { recursive: true }).filter((file) =>
    file.toString().endsWith(".js")
  );

  files.forEach((file) => {
    const command: V = require(path.join(
      __dirname,
      directory,
      file.toString()
    ));

    if (command satisfies V) {
      successfulLoads++;
      collection.set(command.name, command);
      log(`Successfully loaded the command "${command.name}" from "${file}"`);
    } else {
      failedLoads++;
      logError(
        `Failed to load the command at "${file}. It might be missing it's "data" or "execute" property.`
      );
    }
  });

  log(
    `Found ${files.length} items with ${successfulLoads} successfully loaded and ${failedLoads} failures`
  );
}
