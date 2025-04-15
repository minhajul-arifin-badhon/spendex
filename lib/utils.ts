import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { BarSizeResult } from "@/app/types";
import { DateRange } from "react-day-picker";
import Papa from "papaparse";
import * as XLSX from "xlsx";

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

export const generateHSLColors = (count: number, saturation = 86, lightness = 55): string[] => {
	const colors: string[] = [];
	for (let i = 0; i < count; i++) {
		// const hue = Math.round((360 / count) * i); // even spacing
		const hue = Math.round((i + 1) * 20) % 360; // golden angle for good separation
		colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
	}
	return colors;
};

export const generateColorGradient = (
	count: number,
	to: { h: number; s: number; l: number },
	from: { h: number; s: number; l: number }
): string[] => {
	return Array.from({ length: count }, (_, i) => {
		const t = i / Math.max(count - 1, 1);
		const h = from.h + (to.h - from.h) * t;
		const s = from.s + (to.s - from.s) * t;
		const l = from.l + (to.l - from.l) * t;
		return `hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`;
	});
};

export const getDateRange = (timePeriod: string): DateRange | null => {
	const now = new Date();
	let from = now;
	let to = now;

	switch (timePeriod) {
		case "today":
			from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			to = now;
			break;

		case "week": {
			const dayOfWeek = now.getDay(); // 0 = Sunday
			from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
			to = now;
			break;
		}

		case "month":
			from = new Date(now.getFullYear(), now.getMonth(), 1);
			to = now;
			break;

		case "3months":
			to = new Date(now.getFullYear(), now.getMonth(), 0);
			from = new Date(to.getFullYear(), to.getMonth() - 2, 1);
			break;

		case "6months":
			to = new Date(now.getFullYear(), now.getMonth(), 0);
			from = new Date(to.getFullYear(), to.getMonth() - 5, 1);
			break;

		case "year":
			from = new Date(now.getFullYear(), 0, 1);
			to = now;
			break;

		case "custom":
			return null;
	}

	return { from, to };
};

export const getDateRangeOfMonth = (monthYear: string): DateRange => {
	const [monthStr, yearStr] = monthYear.split(" ");

	const monthIndex = new Date(`${monthStr} 1, ${yearStr}`).getMonth();
	const year = parseInt(yearStr, 10);

	const firstDate = new Date(year, monthIndex, 1);
	const lastDate = new Date(year, monthIndex + 1, 0);

	return { from: firstDate, to: lastDate };
};

export const getBarSize = <T>(data: T[], maxHeight = 300, minBarSize = 25, maxBarSize = 40): BarSizeResult<T> => {
	const maxItems = Math.floor(maxHeight / minBarSize);
	const isTrimmed = data.length > maxItems;
	const trimmedData = isTrimmed ? data.slice(0, maxItems) : data;
	const barSize = Math.min(Math.max(Math.floor(maxHeight / trimmedData.length), minBarSize), maxBarSize);

	return {
		barSize,
		chartData: trimmedData,
		isTrimmed,
		height: trimmedData.length * barSize
	};
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

/**
 * Parses a CSV or Excel file and returns a Promise that resolves to an array of rows.
 * Each row is either an array of values (for CSV) or an object (for Excel).
 */
export const parseFile = (file: File): Promise<string[][]> => {
	return new Promise((resolve, reject) => {
		const fileExtension = file.name.split(".").pop()?.toLowerCase();

		if (fileExtension === "csv") {
			Papa.parse<string[]>(file, {
				header: false,
				skipEmptyLines: true,
				// dynamicTyping: true,
				complete: (result) => {
					console.log("Parsed Data:", result.data);
					const cleaned = result.data.map((row: string[]) =>
						row.map((cell: string) => cell?.trim().replace(/^["']|["']$/g, ""))
					);
					resolve(cleaned);
				},
				error: (error) => {
					reject(error);
				}
			});
		} else if (fileExtension === "xlsx" || fileExtension === "xls") {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const data = new Uint8Array(event.target?.result as ArrayBuffer);
					const workbook = XLSX.read(data, { type: "array" });
					const sheet = workbook.Sheets[workbook.SheetNames[0]];
					const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
					resolve(rows);
				} catch (error) {
					reject(error);
				}
			};
			reader.onerror = () => reject(reader.error);
			reader.readAsArrayBuffer(file);
		} else {
			reject(new Error("Unsupported file format. Please upload a CSV or Excel file."));
		}
	});
};
