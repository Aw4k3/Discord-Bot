"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = void 0;
exports.execute = execute;
const path = "/servers";
exports.path = path;
function execute(client) {
    const servers = client.guilds.cache.map((guild) => {
        const { id, name, icon, memberCount } = guild;
        return { id, name, icon, memberCount };
    });
    return JSON.stringify(servers);
}
