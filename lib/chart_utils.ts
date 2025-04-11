import { Filters, TransactionWithRelations } from "@/app/types";
import { format } from "date-fns";

// Prepare monthly data for bar chart
export const getMonthlyData = (transactions: TransactionWithRelations[]) => {
	const months: Record<string, { month: string; moneyIn: number; moneyOut: number }> = {};

	transactions.forEach((transaction) => {
		const month = format(new Date(transaction.date), "MMM yyyy");

		if (!months[month]) {
			months[month] = { month, moneyIn: 0, moneyOut: 0 };
		}

		if (transaction.amount > 0) {
			months[month].moneyIn += transaction.amount;
		} else {
			months[month].moneyOut += Math.abs(transaction.amount);
		}
	});

	return Object.values(months).sort((a, b) => {
		return new Date(a.month).getTime() - new Date(b.month).getTime();
	});
};

export const getCategoryData = (
	filteredTransactions: TransactionWithRelations[],
	filters: Filters,
	isMoneyIn: boolean
) => {
	const category = isMoneyIn ? filters.moneyInCategory : filters.moneyOutCategory;
	const subcategory = isMoneyIn ? filters.moneyInSubcategory : filters.moneyOutSubcategory;

	const filtered = filteredTransactions.filter((t) => {
		const isCorrectType = (isMoneyIn && t.amount > 0) || (!isMoneyIn && t.amount < 0);

		const matchesCategory = !category || t.category?.name === category;
		const matchesSubcategory = !subcategory || t.subcategory?.name === subcategory;

		return isCorrectType && matchesCategory && matchesSubcategory;
	});

	const aggregation: Record<string, number> = {};

	filtered.forEach((t) => {
		let key: string | null = null;

		if (!category && !subcategory) {
			key = t.category?.name ?? null;
		} else if (category && !subcategory) {
			key = t.subcategory?.name ?? "Uncategorized";
		} else if (category && subcategory) {
			key = t.subcategory?.name ?? "Uncategorized";
		}

		if (key) {
			const absAmount = Math.abs(t.amount);
			aggregation[key] = (aggregation[key] || 0) + absAmount;
		}
	});

	return Object.entries(aggregation)
		.map(([name, value]) => ({ name, value }))
		.sort((a, b) => b.value - a.value);
};

// Prepare category data for pie charts
// export const getCategoryData = (transactions: TransactionWithRelations[], isIncome: boolean) => {
// 	const categories: Record<string, number> = {};

// 	transactions
// 		.filter((t) => (isIncome ? t.amount > 0 : t.amount < 0))
// 		.forEach((transaction) => {
// 			const categoryName = transaction.category?.name;
// 			if (categoryName) {
// 				if (!categories[categoryName]) {
// 					categories[categoryName] = 0;
// 				}
// 				categories[categoryName] += Math.abs(transaction.amount);
// 			}
// 		});

// 	return Object.entries(categories).map(([name, value]) => ({ name, value }));
// };

// Prepare merchant data for pie chart
export const getMerchantData = (transactions: TransactionWithRelations[], isMoneyIn: boolean) => {
	const merchants: Record<string, number> = {};

	transactions
		.filter((t) => (isMoneyIn ? t.amount > 0 : t.amount < 0))
		.forEach((transaction) => {
			const merchantName = transaction.merchant?.name;
			if (merchantName) {
				if (!merchants[merchantName]) {
					merchants[merchantName] = 0;
				}
				merchants[merchantName] += Math.abs(transaction.amount);
			}
		});

	return Object.entries(merchants)
		.map(([name, value]) => ({ name, value }))
		.sort((a, b) => b.value - a.value);
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
