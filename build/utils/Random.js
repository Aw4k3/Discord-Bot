"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInt = randomInt;
/**
 * @param lower Lower limit (inclusive)
 * @param upper Upper limit (exclusive)
 * @returns A random number between the lower limit and the upper limit -1.
 */
function randomInt(lower, upper) {
    const minCeiled = Math.ceil(lower);
    const maxFloored = Math.floor(upper);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
