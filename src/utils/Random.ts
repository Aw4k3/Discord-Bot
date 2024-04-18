/**
 * @param lower Lower limit (inclusive)
 * @param upper Upper limit (exclusive)
 * @returns A random number between the lower limit and the upper limit -1.
 */
export function randomInt(lower: number, upper: number): number {
    const minCeiled = Math.ceil(lower);
    const maxFloored = Math.floor(upper);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}