export function log(message: string) {
    console.log(`\x1b[0m[${new Date().toLocaleString().replace(",", "")}] ${message}\x1b[0m`);

    // Implement API related functionality here.
}

export function logWarning(message: string) {
    console.log(`\x1b[33m[${new Date().toLocaleString().replace(",", "")}] ${message}\x1b[0m`);

    // Implement API related functionality here.
}

export function logError(message: string) {
    console.log(`\x1b[31m[${new Date().toLocaleString().replace(",", "")}] ${message}\x1b[0m`);

    // Implement API related functionality here.
}