import { Filters, TransactionWithRelations } from "@/app/types";
import { format } from "date-fns";

export const getMonthlyData = (transactions: TransactionWithRelations[]) => {
	const months: Record<string, { name: string; moneyIn: number; moneyOut: number }> = {};

	transactions.forEach((transaction) => {
		const month = format(new Date(transaction.date), "MMM yyyy");

		if (!months[month]) {
			months[month] = { name: month, moneyIn: 0, moneyOut: 0 };
		}

		if (transaction.amount > 0) {
			months[month].moneyIn += transaction.amount;
		} else {
			months[month].moneyOut += Math.abs(transaction.amount);
		}
	});

	return Object.values(months).sort((a, b) => {
		return new Date(a.name).getTime() - new Date(b.name).getTime();
	});
};

export const getAccountData = (transactions: TransactionWithRelations[]) => {
	const accounts: Record<string, { name: string; moneyIn: number; moneyOut: number }> = {};

	transactions.forEach((transaction) => {
		const accountName = transaction.accountName ? transaction.accountName : "Uncategorized";

		if (!accounts[accountName]) {
			accounts[accountName] = { name: accountName, moneyIn: 0, moneyOut: 0 };
		}

		if (transaction.amount > 0) {
			accounts[accountName].moneyIn += transaction.amount;
		} else {
			accounts[accountName].moneyOut += Math.abs(transaction.amount);
		}
	});

	return Object.values(accounts).sort((a, b) => {
		return a.name.localeCompare(b.name);
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

		const matchesCategory =
			!category || (!t.category && category == "Uncategorized") || t.category?.name === category;
		const matchesSubcategory =
			!subcategory || (!t.subcategory && subcategory == "Uncategorized") || t.subcategory?.name === subcategory;

		return isCorrectType && matchesCategory && matchesSubcategory;
	});

	const aggregation: Record<string, number> = {};

	filtered.forEach((t) => {
		let key: string | null = null;

		if (!category && !subcategory) {
			key = t.category?.name ?? "Uncategorized";
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
// export const getAccountData = (transactions: TransactionWithRelations[]) => {
// 	const accounts: Record<string, number> = {};

// 	transactions
// 		.filter((t) => t.amount < 0) // Only expenses
// 		.forEach((transaction) => {
// 			const accountName = transaction.accountName;
// 			if (accountName) {
// 				if (!accounts[accountName]) {
// 					accounts[accountName] = 0;
// 				}
// 				accounts[accountName] += Math.abs(transaction.amount);
// 			}
// 		});

// 	return Object.entries(accounts).map(([name, value]) => ({ name, value }));
// };
