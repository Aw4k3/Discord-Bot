"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.execute = execute;
const console_1 = require("console");
const name = "list-servers";
exports.name = name;
function execute(client, args) {
    let list = client.guilds.cache.map((guild) => guild.name);
    list = list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    (0, console_1.log)("-------------Server List-------------");
    list.forEach((server) => (0, console_1.log)(server));
    (0, console_1.log)("-------------------------------------");
}
