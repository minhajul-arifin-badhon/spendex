import { TransactionWithRelations } from "@/app/types";

export const fieldOptions = ["Date", "Description", "Amount", "Credit", "Debit"];
// Time period options
export const timePeriods = [
	{ value: "custom", label: "Custom" },
	{ value: "today", label: "Today" },
	{ value: "week", label: "This Week" },
	{ value: "month", label: "This Month" },
	{ value: "3months", label: "Last 3 Months" },
	{ value: "6months", label: "Last 6 Months" },
	{ value: "year", label: "This Year" }
];

// Colors for charts
export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658"];

// Define subcategories for each category
export const categorySubcategories: Record<string, string[]> = {
	Food: ["Groceries", "Restaurants", "Fast Food", "Coffee"],
	Transport: ["Fuel", "Public Transport", "Taxi", "Car Maintenance"],
	Entertainment: ["Movies", "Games", "Concerts", "Subscriptions"],
	Utilities: ["Electricity", "Water", "Internet", "Phone"],
	Salary: ["Regular", "Bonus", "Overtime"],
	Freelance: ["Design Work", "Development", "Consulting", "Writing"],
	// Sideproject: ["Design Work", "Development", "Consulting", "Writing"],
	Gifts: ["Received", "Given"]
};

// Mock data for demonstration
export const mockTransactions: TransactionWithRelations[] = Array.from({ length: 100 }).map((_, i) => {
	const isIncome = Math.random() > 0.7;
	const amount = isIncome ? Math.floor(Math.random() * 2000) + 500 : -1 * (Math.floor(Math.random() * 1000) + 100);

	const categories = ["Food", "Transport", "Entertainment", "Utilities", "Salary", "Freelance", "Gifts"];
	const merchants = ["Amazon", "Uber", "Netflix", "Walmart", "Target", "Starbucks", "Apple"];
	const accounts = ["Main Account", "Savings", "Credit Card"];

	const date = new Date();
	date.setDate(date.getDate() - Math.floor(Math.random() * 180));

	const categoryIndex = isIncome ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 4);
	const categoryName = categories[categoryIndex];

	// Get subcategories for this category
	const subcategories = categorySubcategories[categoryName] || [];
	const subcategoryName = subcategories[Math.floor(Math.random() * subcategories.length)];

	return {
		id: i + 1,
		amount,
		date,
		accountName: accounts[Math.floor(Math.random() * accounts.length)],
		description: isIncome ? "Income payment" : "Purchase",
		categoryId: categoryIndex + 1,
		category: { id: categoryIndex + 1, name: categoryName, group: "expense" },
		subcategoryId: 1,
		subcategory: { id: 1, name: subcategoryName },
		merchantId: Math.floor(Math.random() * merchants.length) + 1,
		merchant: {
			id: Math.floor(Math.random() * merchants.length) + 1,
			name: merchants[Math.floor(Math.random() * merchants.length)]
		},
		userId: "user1",
		createdAt: date,
		updatedAt: date
	};
});
