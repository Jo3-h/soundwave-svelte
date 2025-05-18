// src/lib/utils/assert.ts

/**
 * Custom assert function that throws in development and logs in production.
 * @param condition - The boolean condition to assert.
 * @param message - The message to throw or log if the assertion fails.
 */
export function assert(condition: boolean, message: string): void {
	if (typeof condition !== 'boolean' || typeof message !== 'string') {
		throw new TypeError('assertion type error');
	}

	if (condition) return; // if condition passes then return nothing

	if (import.meta.env.DEV) {
		throw new Error(message);
	} else {
		console.warn(`!! [Assertion Warning]: ${message}`);
	}
}
