import { unlinkSync } from "fs";

async function deleteFile(filePath: string) {
  await unlinkSync(filePath);
  console.log(`[File Manager] Deleted "${filePath}"`);
}

export default deleteFile;
