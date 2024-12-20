"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = downloadFile;
exports.deleteFile = deleteFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Log_1 = require("./Log");
const Axios = __importStar(require("axios"));
const promises_1 = require("stream/promises");
async function downloadFile(url, filePath) {
    let wstream = fs_1.default.createWriteStream(filePath);
    if (!fs_1.default.existsSync(path_1.default.dirname(filePath)))
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
    let response = await Axios.default.get(url, { responseType: "stream" });
    (0, Log_1.log)(`\x1b[36m[File Manager] Status Code: ${response.status}\x1b[0m`);
    // log(`\x1b[36m[Download] Headers: ${JSON.stringify(response.headers, null, 2)}\x1b[0m`);
    (0, Log_1.log)(`\x1b[36m[File Manager] Downloading "${filePath}" from "${url}"\x1b[0m`);
    await (0, promises_1.pipeline)(response.data, wstream);
    wstream.close();
    (0, Log_1.log)(`\x1b[36m[File Manager] Downloaded "${filePath}"\x1b[0m`);
}
async function deleteFile(filePath) {
    await fs_1.default.unlinkSync(filePath);
    (0, Log_1.log)(`\x1b[36m[File Manager] Deleted "${filePath}"\x1b[0m`);
}
