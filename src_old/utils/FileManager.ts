import fs from "fs";
import path from "path";
import { log } from "./Log";
import { AxiosResponse } from "axios";
import * as Axios from "axios";
import { pipeline } from "stream/promises";

export async function downloadFile(url: string, filePath: string) {
    let wstream = fs.createWriteStream(filePath);
    if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
    let res: AxiosResponse = await Axios.default.get(url, { responseType: "stream" });
    log(`\x1b[36m[File Manager] Status Code: ${res.status}\x1b[0m`);
    log(`\x1b[36m[File Manager] Downloading "${filePath}" from "${url}"\x1b[0m`);
    await pipeline(res.data, wstream);
    wstream.close();
    log(`\x1b[36m[File Manager] Downloaded "${filePath}"\x1b[0m`);
}

export async function deleteFile(filePath: string) {
    await fs.unlinkSync(filePath);
    log(`\x1b[36m[File Manager] Deleted "${filePath}"\x1b[0m`);
}