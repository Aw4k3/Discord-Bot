"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.execute = execute;
const Log_1 = require("../api/Log");
const name = "send-message";
exports.name = name;
function execute(client, args) {
    if (args.length < 2) {
        (0, Log_1.logWarning)("Usage: send-message <channelId> <message>");
        return;
    }
    const channelId = args.shift();
    const message = args.join(" ");
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
        (0, Log_1.logError)("Failed to get text channel");
        return;
    }
    channel.send(message);
}
