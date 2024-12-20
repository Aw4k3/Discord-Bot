"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.logWarning = logWarning;
exports.logError = logError;
function log(message) {
    console.log(`\x1b[0m[${new Date().toLocaleString().replace(",", "")}] ${message}\x1b[0m`);
    // Implement API related functionality here.
}
function logWarning(message) {
    console.log(`\x1b[33m[${new Date().toLocaleString().replace(",", "")}] ${message}\x1b[0m`);
    // Implement API related functionality here.
}
function logError(message) {
    console.log(`\x1b[31m[${new Date().toLocaleString().replace(",", "")}] ${message}\x1b[0m`);
    // Implement API related functionality here.
}
