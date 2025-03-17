import { Response, ErrorResponse } from "@/app/types";

/**
 * Standardized response builder for success and error.
 * @param {string} status - The status of the response ("success" or "error").
 * @param {number} statusCode - The HTTP status code (e.g., 200, 400, 500).
 * @param {string | object} message - The message to send (could be an error message or response data).
 * @returns {Response<T>} - The standardized response object.
 */
export const sendResponse = <T>(statusCode: number, data: T): Response<T> => {
	return {
		success: true,
		statusCode: statusCode,
		data: data
	};
};

export const sendErrorResponse = (statusCode: number, data: string): ErrorResponse => {
	return {
		success: false,
		statusCode: statusCode,
		data: data
	};
};
