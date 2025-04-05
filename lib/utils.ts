import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { BarSizeResult, TransactionWithRelations } from "@/app/types";

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

export const getBarSize = <T>(data: T[], maxHeight = 300, minBarSize = 20, maxBarSize = 40): BarSizeResult<T> => {
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

// Prepare monthly data for bar chart
export const getMonthlyData = (
	transactions: TransactionWithRelations[],
	selectedExpenseCategory: string | null,
	selectedIncomeCategory: string | null,
	selectedSubcategory: string | null
) => {
	const months: Record<string, { month: string; income: number; expenses: number }> = {};

	transactions.forEach((transaction) => {
		const month = format(new Date(transaction.date), "MMM yyyy");

		if (!months[month]) {
			months[month] = { month, income: 0, expenses: 0 };
		}

		// Apply category filters for the monthly chart
		if (transaction.amount > 0) {
			// Only include income transactions that match the selected income category (if any)
			if (!selectedIncomeCategory || transaction.category?.name === selectedIncomeCategory) {
				months[month].income += transaction.amount;
			}
		} else {
			// Only include expense transactions that match the selected expense category (if any)
			if (!selectedExpenseCategory || transaction.category?.name === selectedExpenseCategory) {
				// Further filter by subcategory if selected
				if (!selectedSubcategory || transaction.subcategory?.name === selectedSubcategory) {
					months[month].expenses += Math.abs(transaction.amount);
				}
			}
		}
	});

	return Object.values(months).sort((a, b) => {
		return new Date(a.month).getTime() - new Date(b.month).getTime();
	});
};

// Prepare category data for pie charts
export const getCategoryData = (transactions: TransactionWithRelations[], isIncome: boolean) => {
	const categories: Record<string, number> = {};

	transactions
		.filter((t) => (isIncome ? t.amount > 0 : t.amount < 0))
		.forEach((transaction) => {
			const categoryName = transaction.category?.name;
			if (categoryName) {
				if (!categories[categoryName]) {
					categories[categoryName] = 0;
				}
				categories[categoryName] += Math.abs(transaction.amount);
			}
		});

	return Object.entries(categories).map(([name, value]) => ({ name, value }));
};

// Prepare merchant data for pie chart
export const getMerchantData = (transactions: TransactionWithRelations[]) => {
	const merchants: Record<string, number> = {};

	transactions
		.filter((t) => t.amount < 0) // Only expenses
		.forEach((transaction) => {
			const merchantName = transaction.merchant?.name;
			if (merchantName) {
				if (!merchants[merchantName]) {
					merchants[merchantName] = 0;
				}
				merchants[merchantName] += Math.abs(transaction.amount);
			}
		});

	return Object.entries(merchants).map(([name, value]) => ({ name, value }));
};

// Prepare account data for pie chart
export const getAccountData = (transactions: TransactionWithRelations[]) => {
	const accounts: Record<string, number> = {};

	transactions
		.filter((t) => t.amount < 0) // Only expenses
		.forEach((transaction) => {
			const accountName = transaction.accountName;
			if (accountName) {
				if (!accounts[accountName]) {
					accounts[accountName] = 0;
				}
				accounts[accountName] += Math.abs(transaction.amount);
			}
		});

	return Object.entries(accounts).map(([name, value]) => ({ name, value }));
};
