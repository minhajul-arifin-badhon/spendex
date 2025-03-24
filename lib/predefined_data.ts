export const initialCategories = {
	expense: [
		{
			id: 1,
			name: "Home",
			subcategories: [
				{ id: 1, name: "Mortgages" },
				{ id: 2, name: "Utilities" },
				{ id: 3, name: "Property Tax" }
			]
		},
		{
			id: 2,
			name: "Transportation",
			subcategories: [
				{ id: 4, name: "Gas" },
				{ id: 5, name: "Maintainance" },
				{ id: 6, name: "Insurance" },
				{ id: 7, name: "Other Transportation" }
			]
		},
		{
			id: 3,
			name: "Food",
			subcategories: [
				{ id: 8, name: "Groceries" },
				{ id: 9, name: "Restaurants" },
				{ id: 10, name: "Other Food" }
			]
		},
		{
			id: 4,
			name: "Health and Wellness",
			subcategories: [
				{ id: 11, name: "Medical" },
				{ id: 12, name: "Gym" },
				{ id: 13, name: "Other Health" }
			]
		},
		{
			id: 5,
			name: "Travel",
			subcategories: []
		},
		{
			id: 6,
			name: "Vacation",
			subcategories: [{ id: 17, name: "Lodging" }]
		},
		{
			id: 7,
			name: "Shopping",
			subcategories: [
				{ id: 14, name: "Clothing" },
				{ id: 15, name: "Other Shopping" },
				{ id: 16, name: "Electronics" },
				{ id: 18, name: "Home" },
				{ id: 19, name: "Beauty" }
			]
		},
		{
			id: 8,
			name: "Entertainment",
			subcategories: [
				{ id: 20, name: "Gaming" },
				{ id: 21, name: "Movies & Streaming" },
				{ id: 22, name: "Music & Concerts" },
				{ id: 23, name: "Sports & Events" },
				{ id: 24, name: "Amusement & Attractions" }
			]
		},
		{
			id: 9,
			name: "Education",
			subcategories: []
		},
		{
			id: 10,
			name: "Subscriptions",
			subcategories: [
				{ id: 25, name: "Software & Apps" },
				{ id: 26, name: "Internet & Mobile Services" },
				{ id: 27, name: "Cloud Storage & Hosting" },
				{ id: 28, name: "Digital Newspapers & Magazines" }
			]
		},
		{
			id: 11,
			name: "Gifts and Donations",
			subcategories: []
		},
		{
			id: 12,
			name: "Business and Work",
			subcategories: []
		},
		{
			id: 13,
			name: "Investments",
			subcategories: []
		},
		{
			id: 14,
			name: "Insurance",
			subcategories: []
		},
		{
			id: 15,
			name: "Loans and Fees",
			subcategories: []
		},
		{
			id: 16,
			name: "Other Expenses",
			subcategories: []
		}
	],
	income: [
		{
			id: 17,
			name: "Primary Paycheck",
			subcategories: []
		},
		{
			id: 18,
			name: "Business Income",
			subcategories: []
		},
		{
			id: 19,
			name: "Repayment from Others",
			subcategories: []
		},
		{
			id: 20,
			name: "Other Income",
			subcategories: []
		}
	],
	transfer: [
		{
			id: 21,
			name: "Transfer",
			subcategories: []
		},
		{
			id: 22,
			name: "Credit Card Payment",
			subcategories: []
		},
		{
			id: 23,
			name: "Buy and Trade",
			subcategories: []
		},
		{
			id: 24,
			name: "Sell and Trade",
			subcategories: []
		}
	]
};

export const initialMerchants = [
	// Grocery Stores
	{ name: "Walmart", category: "Food", subcategory: "Groceries", includes: ["walmart"] },
	{ name: "Costco", category: "Food", subcategory: "Groceries", includes: ["costco"] },
	{ name: "Safeway", category: "Food", subcategory: "Groceries", includes: ["safeway"] },
	{ name: "Whole Foods", category: "Food", subcategory: "Groceries", includes: ["whole foods"] },
	{ name: "Superstore", category: "Food", subcategory: "Groceries", includes: ["superstore"] },

	// Restaurants
	{ name: "McDonald's", category: "Food", subcategory: "Restaurants", includes: ["mcdonald"] },
	{ name: "Starbucks", category: "Food", subcategory: "Restaurants", includes: ["starbucks"] },
	{ name: "Subway", category: "Food", subcategory: "Restaurants", includes: ["subway"] },
	{ name: "Burger King", category: "Food", subcategory: "Restaurants", includes: ["burger king"] },
	{ name: "KFC", category: "Food", subcategory: "Restaurants", includes: ["kfc"] },
	{ name: "Domino's Pizza", category: "Food", subcategory: "Restaurants", includes: ["domino's pizza"] },
	{ name: "Pizza Hut", category: "Food", subcategory: "Restaurants", includes: ["pizza hut"] },

	// Gas Stations
	{ name: "Shell", category: "Transportation", subcategory: "Gas", includes: ["shell"] },
	{ name: "Chevron", category: "Transportation", subcategory: "Gas", includes: ["chevron"] },
	{ name: "ExxonMobil", category: "Transportation", subcategory: "Gas", includes: ["exxonmobil"] },
	{ name: "7-Eleven", category: "Transportation", subcategory: "Gas", includes: ["7-eleven"] },
	{ name: "Petro-Canada", category: "Transportation", subcategory: "Gas", includes: ["petro-canada"] },

	// Ride-Sharing
	{ name: "Uber", category: "Transportation", subcategory: "Other Transportation", includes: ["uber"] },
	{ name: "Lyft", category: "Transportation", subcategory: "Other Transportation", includes: ["lyft"] },

	// Insurance
	{ name: "TD Insurance", category: "Insurance", subcategory: null, includes: ["td insurance"] },
	{ name: "Allstate", category: "Insurance", subcategory: null, includes: ["allstate"] },

	// Health and Wellness
	{ name: "Planet Fitness", category: "Health and Wellness", subcategory: "Gym", includes: ["planet fitness"] },
	{ name: "24 Hour Fitness", category: "Health and Wellness", subcategory: "Gym", includes: ["24 hour fitness"] },
	{ name: "Goodlife Fitness", category: "Health and Wellness", subcategory: "Gym", includes: ["goodlife fitness"] },

	// Shopping - General
	{ name: "Amazon", category: "Shopping", subcategory: null, includes: ["amazon"] },
	{ name: "Target", category: "Shopping", subcategory: null, includes: ["target"] },
	{ name: "Walmart", category: "Shopping", subcategory: null, includes: ["walmart"] },
	{ name: "Best Buy", category: "Shopping", subcategory: "Electronics", includes: ["best buy"] },
	{ name: "eBay", category: "Shopping", subcategory: null, includes: ["ebay"] },

	// Shopping - Clothing
	{ name: "Nike", category: "Shopping", subcategory: "Clothing", includes: ["nike"] },
	{ name: "Adidas", category: "Shopping", subcategory: "Clothing", includes: ["adidas"] },
	{ name: "H&M", category: "Shopping", subcategory: "Clothing", includes: ["h&m"] },
	{ name: "Zara", category: "Shopping", subcategory: "Clothing", includes: ["zara"] },
	{ name: "Macy's", category: "Shopping", subcategory: "Clothing", includes: ["macy"] },
	{ name: "Old Navy", category: "Shopping", subcategory: "Clothing", includes: ["old navy"] },
	{ name: "Gap", category: "Shopping", subcategory: "Clothing", includes: ["gap"] },
	{ name: "Levi", category: "Shopping", subcategory: "Clothing", includes: ["levi"] },

	// Shopping - Footwear
	{ name: "Foot Locker", category: "Shopping", subcategory: "Clothing", includes: ["foot locker"] },
	{ name: "Skechers", category: "Shopping", subcategory: "Clothing", includes: ["skechers"] },

	// Shopping - Electronics
	{ name: "Apple", category: "Shopping", subcategory: "Electronics", includes: ["apple"] },
	{ name: "Samsung Store", category: "Shopping", subcategory: "Electronics", includes: ["samsung store"] },
	{ name: "Microsoft Store", category: "Shopping", subcategory: "Electronics", includes: ["microsoft store"] },

	// Shopping - Home & Furniture
	{ name: "IKEA", category: "Shopping", subcategory: "Home", includes: ["ikea"] },
	{ name: "Home Depot", category: "Shopping", subcategory: "Home", includes: ["home depot"] },
	{ name: "Lowe's", category: "Shopping", subcategory: "Home", includes: ["lowe"] },
	{ name: "Wayfair", category: "Shopping", subcategory: "Home", includes: ["wayfair"] },

	// Shopping - Beauty & Personal Care
	{ name: "Sephora", category: "Shopping", subcategory: "Beauty", includes: ["sephora"] },
	{ name: "Ulta Beauty", category: "Shopping", subcategory: "Beauty", includes: ["ulta beauty"] },

	// Subscriptions
	{ name: "Netflix", category: "Subscriptions", subcategory: null, includes: ["netflix"] },
	{ name: "Spotify", category: "Subscriptions", subcategory: null, includes: ["spotify"] },
	{ name: "Disney+", category: "Subscriptions", subcategory: null, includes: ["disney+"] },
	{ name: "Amazon Prime", category: "Subscriptions", subcategory: null, includes: ["amazon prime"] },

	// Travel & Vacation
	{ name: "Airbnb", category: "Vacation", subcategory: null, includes: ["airbnb"] },
	{ name: "Marriott", category: "Vacation", subcategory: "Lodging", includes: ["marriott"] },
	{ name: "American Airlines", category: "Travel", subcategory: null, includes: ["american airlines"] },
	{ name: "Delta Airlines", category: "Travel", subcategory: null, includes: ["delta airlines"] },

	// Entertainment
	{ name: "AMC Theatres", category: "Entertainment", subcategory: null, includes: ["amc theatres"] },
	{ name: "Regal Cinemas", category: "Entertainment", subcategory: null, includes: ["regal cinemas"] },
	{ name: "Steam", category: "Entertainment", subcategory: "Gaming", includes: ["steam"] },
	{ name: "PlayStation Store", category: "Entertainment", subcategory: "Gaming", includes: ["playstation store"] },
	{ name: "Xbox Store", category: "Entertainment", subcategory: "Gaming", includes: ["xbox store"] }
];
