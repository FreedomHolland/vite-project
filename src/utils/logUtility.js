/**
 * Logs a message with a [Utility] prefix and optionally calls a callback function.
 * 
 * @param {string} message - The message to log.
 * @param {Function} [callback] - Optional callback function to execute after logging.
 */
export function logMessage(message, callback) {
    const logMessage = `[Utility] ${message}`;
    console.log(logMessage);
    if (callback) callback();
}

/**
 * Logs a message with a [Utility] prefix.
 * 
 * @param {string} message - The message to log.
 */
export function log(message) {
    const logMessage = `[Utility] ${message}`;
    console.log(logMessage);
    // Implement any additional logic if needed
}
