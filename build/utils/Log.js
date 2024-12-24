"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.logWarning = logWarning;
exports.logError = logError;
exports.logDebug = logDebug;
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
function logDebug(message) {
    console.log(`\x1b[36m[${new Date().toLocaleString().replace(",", "")}] ${message}\x1b[0m`);
    // Implement API related functionality here.
}
