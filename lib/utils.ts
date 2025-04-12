import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const truncateText = (text: string, maxLength = 30) => {
	if (!text) return "";

	// Remove quotation marks from the beginning and end
	let processedText = text;
	if (typeof processedText === "string") {
		if (processedText.startsWith('"') && processedText.endsWith('"')) {
			processedText = processedText.substring(1, processedText.length - 1);
		}
		if (processedText.startsWith("'") && processedText.endsWith("'")) {
			processedText = processedText.substring(1, processedText.length - 1);
		}
	}

	return processedText.length > maxLength ? `${processedText.substring(0, maxLength)}...` : processedText;
};

export const filterByAmount = (amount: number, filterValue: string): boolean => {
	if (filterValue.includes(":")) {
		const [minStr, maxStr] = filterValue.split(":").map((s) => s.trim());
		const min = parseFloat(minStr);
		const max = parseFloat(maxStr);

		if (!isNaN(min) && !isNaN(max)) {
			return amount >= min && amount <= max;
		}
		if (!isNaN(min) && isNaN(max)) {
			return amount >= min;
		}
		if (isNaN(min) && !isNaN(max)) {
			return amount <= max;
		}

		return false;
	}

	return amount.toFixed(2).toLowerCase().includes(filterValue.toLowerCase());
};
