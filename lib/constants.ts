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
export const categorySubcategories = {
	Food: {
		group: "expense",
		subcategories: ["Groceries", "Restaurants", "Fast Food", "Coffee", "Snacks", "Takeout"]
	},
	Transport: {
		group: "expense",
		subcategories: ["Fuel", "Public Transport", "Taxi", "Car Maintenance", "Parking", "Tolls"]
	},
	Entertainment: {
		group: "expense",
		subcategories: ["Movies", "Games", "Concerts", "Subscriptions", "Streaming", "Books"]
	},
	Utilities: {
		group: "expense",
		subcategories: ["Electricity", "Water", "Internet", "Phone", "Gas", "Trash Collection"]
	},
	Pets: {
		group: "expense",
		subcategories: ["Food", "Vet", "Toys", "Grooming"]
	},
	Insurance: {
		group: "expense",
		subcategories: ["Health", "Car", "Home", "Life"]
	},
	Investments: {
		group: "expense",
		subcategories: ["Stocks", "Crypto", "Real Estate", "Savings"]
	},
	Personal: {
		group: "expense",
		subcategories: ["Haircut", "Salon", "Spa", "Therapy", "Self-care"]
	},
	Kids: {
		group: "expense",
		subcategories: ["Toys", "School Fees", "Clothes", "Childcare"]
	},
	Health: {
		group: "expense",
		subcategories: ["Doctor", "Medicine", "Dental", "Vision", "Insurance", "Gym"]
	},
	Education: {
		group: "expense",
		subcategories: ["Tuition", "Books", "Courses", "Workshops", "Supplies"]
	},
	Home: {
		group: "expense",
		subcategories: ["Rent", "Mortgage", "Maintenance", "Furniture", "Decor"]
	},
	Shopping: {
		group: "expense",
		subcategories: ["Clothing", "Electronics", "Accessories", "Beauty", "Footwear"]
	},
	Travel: {
		group: "expense",
		subcategories: ["Flights", "Hotels", "Car Rental", "Activities", "Travel Insurance"]
	},
	Salary: {
		group: "income",
		subcategories: ["Regular", "Bonus", "Overtime", "Commission"]
	},
	Freelance: {
		group: "income",
		subcategories: ["Design Work", "Development", "Consulting", "Writing", "Photography"]
	},
	Gifts: {
		group: "income",
		subcategories: ["Received", "Given", "Donations", "Charity"]
	},
	Transfers: {
		group: "transfer",
		subcategories: ["To Savings", "From Savings", "To Investment", "External Transfer"]
	}
};

const incomeCategoryPool = ["Salary", "Freelance", "Gifts"] as const;
const fallbackIncomeSources = ["Shopping", "Travel", "Home"] as const;
const categories = Object.keys(categorySubcategories);

const merchants = [
	"Amazon",
	"Uber",
	"Netflix",
	"Walmart",
	"Target",
	"Starbucks",
	"Apple",
	"Costco",
	"McDonald's",
	"Lyft",
	"DoorDash",
	"Best Buy",
	"Google",
	"Microsoft",
	"Airbnb",
	"Shell",
	"Chevron",
	"KFC",
	"Subway",
	"Domino's Pizza",
	"Spotify",
	"Disney+",
	"Home Depot",
	"Sephora",
	"Nike",
	"Adidas",
	"GoodLife Fitness",
	"Planet Fitness",
	"7-Eleven",
	"eBay",
	"Facebook",
	"Twitch",
	"Delta Airlines",
	"Marriott",
	"Steam"
];

const accounts = [
	"RBC Chequing",
	"TD Savings",
	"Scotiabank Credit Card",
	"BMO Savings",
	"CIBC Chequing",
	"Tangerine Credit Card",
	"Simplii Chequing",
	"Amex Credit Card"
];

// Mock data for demonstration
export const mockTransactions: TransactionWithRelations[] = Array.from({ length: 200 }).map((_, i) => {
	const isIncome = Math.random() > 0.7;
	const amount = isIncome ? Math.floor(Math.random() * 2000) + 500 : -1 * (Math.floor(Math.random() * 1000) + 100);

	const date = new Date();
	date.setDate(date.getDate() - Math.floor(Math.random() * 180));

	let categoryName = "";
	if (isIncome) {
		const useFallback = Math.random() < 0.15;

		if (useFallback) {
			const localIndex = Math.floor(Math.random() * fallbackIncomeSources.length);
			categoryName = fallbackIncomeSources[localIndex];
		} else {
			const localIndex = Math.floor(Math.random() * incomeCategoryPool.length);
			categoryName = incomeCategoryPool[localIndex];
		}
	} else {
		categoryName = categories[Math.floor(Math.random() * (categories.length - 4))];
	}

	// Get subcategories for this category
	const subcategories = categorySubcategories[categoryName as keyof typeof categorySubcategories].subcategories || [];
	const subcategoryId = Math.floor(Math.random() * subcategories.length);
	const subcategoryName = subcategories[subcategoryId];

	const merchantId = Math.floor(Math.random() * merchants.length);
	const categoryIndex = categories.indexOf(categoryName);

	return {
		id: i + 1,
		amount,
		date,
		accountName: accounts[Math.floor(Math.random() * accounts.length)],
		description: isIncome ? "Income payment" : "Purchase",
		categoryId: categoryIndex + 1,
		category: { id: categoryIndex + 1, name: categoryName, group: "expense" },
		subcategoryId: subcategoryId + 1,
		subcategory: { id: subcategoryId + 1, name: subcategoryName },
		merchantId: merchantId + 1,
		merchant: {
			id: merchantId + 1,
			name: merchants[merchantId]
		},
		userId: "user1",
		createdAt: date,
		updatedAt: date
	};
});
