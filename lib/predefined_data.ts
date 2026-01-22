export const initialCategories = {
	expense: [
		{
			id: 1,
			name: "Home",
			subcategories: [
				{ id: 1, name: "Mortgages" },
				{ id: 2, name: "Utilities" },
				{ id: 3, name: "Property Tax" },
				{ id: 4, name: "Condo Fees" }
			]
		},
		{
			id: 2,
			name: "Transportation",
			subcategories: [
				{ id: 5, name: "Gas" },
				{ id: 6, name: "Maintainance" },
				{ id: 7, name: "Insurance" },
				{ id: 8, name: "Other Transportation" }
			]
		},
		{
			id: 3,
			name: "Food",
			subcategories: [
				{ id: 9, name: "Groceries" },
				{ id: 10, name: "Restaurants" },
				{ id: 11, name: "Other Food" }
			]
		},
		{
			id: 4,
			name: "Health and Wellness",
			subcategories: [
				{ id: 12, name: "Medical" },
				{ id: 13, name: "Gym" },
				{ id: 14, name: "Other Health" }
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
			subcategories: [{ id: 15, name: "Lodging" }]
		},
		{
			id: 7,
			name: "Shopping",
			subcategories: [
				{ id: 16, name: "Clothing" },
				{ id: 17, name: "Other Shopping" },
				{ id: 18, name: "Electronics" },
				{ id: 19, name: "Home" },
				{ id: 20, name: "Beauty" }
			]
		},
		{
			id: 8,
			name: "Entertainment",
			subcategories: [
				{ id: 21, name: "Gaming" },
				{ id: 22, name: "Movies & Streaming" },
				{ id: 23, name: "Music & Concerts" },
				{ id: 24, name: "Sports & Events" },
				{ id: 25, name: "Amusement & Attractions" }
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
				{ id: 26, name: "Software & Apps" },
				{ id: 27, name: "Internet & Mobile Services" },
				{ id: 28, name: "Cloud Storage & Hosting" },
				{ id: 29, name: "Digital Newspapers & Magazines" }
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
			subcategories: [{ id: 30, name: "Family Assistance" }]
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
			subcategories: [
				{ id: 31, name: "Cash back" },
				{ id: 32, name: "Rebate" },
				{ id: 33, name: "Refund" }
			]
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
			subcategories: [
				{ id: 34, name: "e-Transfer" },
				{ id: 35, name: "Between Accounts" }
			]
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
	{ name: "Sobeys", category: "Food", subcategory: "Groceries", includes: ["sobeys"] },
	{ name: "Loblaws", category: "Food", subcategory: "Groceries", includes: ["loblaws"] },
	{ name: "Metro", category: "Food", subcategory: "Groceries", includes: ["metro"] },
	{ name: "Trader Joe's", category: "Food", subcategory: "Groceries", includes: ["trader joe's"] },
	{ name: "Aldi", category: "Food", subcategory: "Groceries", includes: ["aldi"] },
	{ name: "Food Basics", category: "Food", subcategory: "Groceries", includes: ["food basics"] },
	{ name: "Save-On-Foods", category: "Food", subcategory: "Groceries", includes: ["save-on-foods"] },
	{ name: "No Frills", category: "Food", subcategory: "Groceries", includes: ["no frills"] },
	{ name: "FreshCo", category: "Food", subcategory: "Groceries", includes: ["freshco"] },
	{ name: "Giant Tiger", category: "Food", subcategory: "Groceries", includes: ["giant tiger"] },
	{ name: "Farmers Market", category: "Food", subcategory: "Groceries", includes: ["farmers market"] },
	{ name: "H-E-B", category: "Food", subcategory: "Groceries", includes: ["h-e-b"] },
	{ name: "Kroger", category: "Food", subcategory: "Groceries", includes: ["kroger"] },
	{ name: "Publix", category: "Food", subcategory: "Groceries", includes: ["publix"] },
	{ name: "Meijer", category: "Food", subcategory: "Groceries", includes: ["meijer"] },
	{ name: "WinCo Foods", category: "Food", subcategory: "Groceries", includes: ["winco foods"] },
	{ name: "Grocery Outlet", category: "Food", subcategory: "Groceries", includes: ["grocery outlet"] },
	{
		name: "Sprouts Farmers Market",
		category: "Food",
		subcategory: "Groceries",
		includes: ["sprouts farmers market"]
	},
	{ name: "Piggly Wiggly", category: "Food", subcategory: "Groceries", includes: ["piggly wiggly"] },
	{ name: "Food Lion", category: "Food", subcategory: "Groceries", includes: ["food lion"] },
	{ name: "Harris Teeter", category: "Food", subcategory: "Groceries", includes: ["harris teeter"] },
	{ name: "Giant Food", category: "Food", subcategory: "Groceries", includes: ["giant food"] },
	{ name: "Shoppers Drug Mart", category: "Food", subcategory: "Groceries", includes: ["shoppers drug mart"] },
	{ name: "H-Mart", category: "Food", subcategory: "Groceries", includes: ["h-mart", "h mart"] },
	{
		name: "T&T Supermarket",
		category: "Food",
		subcategory: "Groceries",
		includes: ["t&t supermarket", "t and t supermarket"]
	},
	{ name: "Asian Supermarket", category: "Food", subcategory: "Groceries", includes: ["asian supermarket"] },
	{
		name: "nolanhill halal meat & catering",
		category: "Food",
		subcategory: "Groceries",
		includes: ["nolanhill halal meat"]
	},
	{ name: "Fresh Market", category: "Food", subcategory: "Groceries", includes: ["fresh market"] },

	// Restaurants
	{ name: "McDonald's", category: "Food", subcategory: "Restaurants", includes: ["mcdonald"] },
	{ name: "Starbucks", category: "Food", subcategory: "Restaurants", includes: ["starbucks"] },
	{ name: "Subway", category: "Food", subcategory: "Restaurants", includes: ["subway"] },
	{ name: "Burger King", category: "Food", subcategory: "Restaurants", includes: ["burger king"] },
	{ name: "KFC", category: "Food", subcategory: "Restaurants", includes: ["kfc"] },
	{ name: "Domino's Pizza", category: "Food", subcategory: "Restaurants", includes: ["domino's pizza"] },
	{ name: "Pizza Hut", category: "Food", subcategory: "Restaurants", includes: ["pizza hut"] },
	{ name: "Utsav Sweets", category: "Food", subcategory: "Restaurants", includes: ["utsav sweets"] },
	{ name: "Red Swan Pizza", category: "Food", subcategory: "Restaurants", includes: ["red swan pizza"] },
	{ name: "A&W", category: "Food", subcategory: "Restaurants", includes: ["a&w"] },
	{ name: "Taco Bell", category: "Food", subcategory: "Restaurants", includes: ["taco bell"] },
	{ name: "Popeyes", category: "Food", subcategory: "Restaurants", includes: ["popeyes"] },
	{ name: "Chipotle", category: "Food", subcategory: "Restaurants", includes: ["chipotle"] },
	{ name: "Panera Bread", category: "Food", subcategory: "Restaurants", includes: ["panera bread"] },
	{ name: "Dunkin'", category: "Food", subcategory: "Restaurants", includes: ["dunkin'"] },
	{ name: "Shake Shack", category: "Food", subcategory: "Restaurants", includes: ["shake shack"] },
	{ name: "Five Guys", category: "Food", subcategory: "Restaurants", includes: ["five guys"] },
	{ name: "Wendy's", category: "Food", subcategory: "Restaurants", includes: ["wendy's"] },
	{ name: "Church's Texas Chicken", category: "Food", subcategory: "Restaurants", includes: ["church's chicken"] },
	{ name: "Little Caesars", category: "Food", subcategory: "Restaurants", includes: ["little caesars"] },
	{ name: "Cinnabon", category: "Food", subcategory: "Restaurants", includes: ["cinnabon"] },
	{ name: "Aroma Espresso Bar", category: "Food", subcategory: "Restaurants", includes: ["aroma espresso bar"] },
	{ name: "Cold Stone Creamery", category: "Food", subcategory: "Restaurants", includes: ["cold stone creamery"] },
	{ name: "Jollibee", category: "Food", subcategory: "Restaurants", includes: ["jollibee"] },
	{ name: "Tim Hortons", category: "Food", subcategory: "Other Food", includes: ["tim hortons"] },
	{ name: "Circle K", category: "Food", subcategory: "Other Food", includes: ["circle k"] },

	// Gas Stations
	{ name: "Shell", category: "Transportation", subcategory: "Gas", includes: ["shell"] },
	{ name: "Chevron", category: "Transportation", subcategory: "Gas", includes: ["chevron"] },
	{ name: "ExxonMobil", category: "Transportation", subcategory: "Gas", includes: ["exxonmobil"] },
	{ name: "7-Eleven", category: "Transportation", subcategory: "Gas", includes: ["7-eleven"] },
	{ name: "Petro-Canada", category: "Transportation", subcategory: "Gas", includes: ["petro-canada"] },
	{ name: "Esso", category: "Transportation", subcategory: "Gas", includes: ["esso"] },
	{ name: "Costco Gas", category: "Transportation", subcategory: "Gas", includes: ["costco gas"] },

	// Home
	{ name: "Enmax", category: "Home", subcategory: "Utilities", includes: ["enmax"] },
	{ name: "Urbantec", category: "Home", subcategory: "Condo Fees", includes: ["urbantec proper msp"] },
	{ name: "Property Tax", category: "Home", subcategory: "Property Tax", includes: ["tipp tax"] },

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
	{ name: "Best Buy", category: "Shopping", subcategory: "Electronics", includes: ["best buy"] },
	{ name: "eBay", category: "Shopping", subcategory: null, includes: ["ebay"] },
	{ name: "Dollaroma", category: "Shopping", subcategory: null, includes: ["dollaroma"] },
	{ name: "London Drugs", category: "Shopping", subcategory: null, includes: ["london drugs"] },
	{ name: "Canadian Tire", category: "Shopping", subcategory: null, includes: ["canadian tire"] },
	{ name: "Sukoshi mart", category: "Shopping", subcategory: null, includes: ["sukoshi mart"] },
	{ name: "Value Village", category: "Shopping", subcategory: null, includes: ["value village"] },

	// Shopping - Clothing
	{ name: "Nike", category: "Shopping", subcategory: "Clothing", includes: ["nike"] },
	{ name: "Adidas", category: "Shopping", subcategory: "Clothing", includes: ["adidas"] },
	{ name: "H&M", category: "Shopping", subcategory: "Clothing", includes: ["h&m"] },
	{ name: "Zara", category: "Shopping", subcategory: "Clothing", includes: ["zara"] },
	{ name: "Macy's", category: "Shopping", subcategory: "Clothing", includes: ["macy"] },
	{ name: "Old Navy", category: "Shopping", subcategory: "Clothing", includes: ["old navy"] },
	{ name: "Gap", category: "Shopping", subcategory: "Clothing", includes: ["gap"] },
	{ name: "Levi", category: "Shopping", subcategory: "Clothing", includes: ["levi"] },
	{ name: "Winners", category: "Shopping", subcategory: null, includes: ["winners"] },
	{ name: "Marshalls", category: "Shopping", subcategory: null, includes: ["marshalls"] },
	{ name: "Uniqlo", category: "Shopping", subcategory: "Clothing", includes: ["uniqlo"] },
	{ name: "American Eagle", category: "Shopping", subcategory: "Clothing", includes: ["american eagle"] },
	{ name: "Forever 21", category: "Shopping", subcategory: "Clothing", includes: ["forever 21"] },
	{ name: "Lululemon", category: "Shopping", subcategory: "Clothing", includes: ["lululemon"] },

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
	{ name: "PlayStation", category: "Entertainment", subcategory: "Gaming", includes: ["playstation"] },
	{ name: "Xbox Store", category: "Entertainment", subcategory: "Gaming", includes: ["xbox store"] },
	{ name: "Nintendo eShop", category: "Entertainment", subcategory: "Gaming", includes: ["nintendo eshop"] },
	{ name: "Nintendo", category: "Entertainment", subcategory: "Gaming", includes: ["nintendo"] },
	{
		name: "Concert Tickets",
		category: "Entertainment",
		subcategory: "Music & Concerts",
		includes: ["ticketmaster", "live nation"]
	},
	{
		name: "Spotify Concerts",
		category: "Entertainment",
		subcategory: "Music & Concerts",
		includes: ["spotify concerts"]
	},
	{
		name: "MovieTickets.com",
		category: "Entertainment",
		subcategory: "Movies & Streaming",
		includes: ["movietickets.com"]
	},
	{ name: "Fandango", category: "Entertainment", subcategory: "Movies & Streaming", includes: ["fandango"] },
	{ name: "Gamers Outlet", category: "Entertainment", subcategory: "Gaming", includes: ["gamers outlet"] },

	// Transfer
	{ name: "e-Transfer", category: "Transfer", subcategory: "e-Transfer", includes: ["e-transfer", "send e-tfr"] },

	// Loans and Fees
	{ name: "Affirm", category: "Loans and Fees", subcategory: null, includes: ["affirm"] },

	// Education
	{ name: "Udemy", category: "Education", subcategory: null, includes: ["udemy"] },
	{ name: "Coursera", category: "Education", subcategory: null, includes: ["coursera"] },
	{ name: "edX", category: "Education", subcategory: null, includes: ["edx"] },
	{ name: "Khan Academy", category: "Education", subcategory: null, includes: ["khan academy"] },
	{ name: "Skillshare", category: "Education", subcategory: null, includes: ["skillshare"] },
	{ name: "LinkedIn Learning", category: "Education", subcategory: null, includes: ["linkedin learning"] },
	{ name: "MasterClass", category: "Education", subcategory: null, includes: ["masterclass"] },
	{ name: "Pluralsight", category: "Education", subcategory: null, includes: ["pluralsight"] },
	{ name: "Codecademy", category: "Education", subcategory: null, includes: ["codecademy"] },
	{ name: "Treehouse", category: "Education", subcategory: null, includes: ["treehouse"] },
	{ name: "CreativeLive", category: "Education", subcategory: null, includes: ["creativelive"] },
	{ name: "FutureLearn", category: "Education", subcategory: null, includes: ["futurelearn"] },
	{ name: "Udacity", category: "Education", subcategory: null, includes: ["udacity"] },

	// Other Expenses
	{ name: "Taptap Send", category: "Other Expenses", subcategory: null, includes: ["taptap send"] },
	{ name: "Paypal", category: "Other Expenses", subcategory: null, includes: ["paypal"] },
	{ name: "Western Union", category: "Other Expenses", subcategory: null, includes: ["western union"] },
	{ name: "MoneyGram", category: "Other Expenses", subcategory: null, includes: ["moneygram"] },
	{ name: "Remitly", category: "Other Expenses", subcategory: null, includes: ["remitly"] },
	{ name: "WorldRemit", category: "Other Expenses", subcategory: null, includes: ["worldremit"] },
	{ name: "Xoom", category: "Other Expenses", subcategory: null, includes: ["xoom"] },
	{ name: "Ria Money Transfer", category: "Other Expenses", subcategory: null, includes: ["ria money transfer"] },
	{ name: "OFX", category: "Other Expenses", subcategory: null, includes: ["ofx"] },

	// Loans and Fees - Additional
	{ name: "ATB Financial", category: "Loans and Fees", subcategory: null, includes: ["atb financial loan"] },

	// Transfer - Additional
	{ name: "Scotia Card Payment", category: "Transfer", subcategory: null, includes: ["mb-credit-card"] },

	// Insurance - Additional
	{ name: "Greenshield", category: "Insurance", subcategory: null, includes: ["gsci"] },

	// Income - Cashback
	{ name: "Cashback", category: "Repayment from Others", subcategory: "Cash back", includes: ["cash back"] },

	// Shopping - Online Marketplaces
	{ name: "AliExpress", category: "Shopping", subcategory: null, includes: ["aliexpress"] },
	{ name: "Temu", category: "Shopping", subcategory: null, includes: ["temu"] },
	{ name: "Shein", category: "Shopping", subcategory: "Clothing", includes: ["shein"] },

	// Subscriptions - Additional
	{ name: "Chatr", category: "Subscriptions", subcategory: "Internet & Mobile Services", includes: ["chatr"] },
	{ name: "YouTube", category: "Subscriptions", subcategory: null, includes: ["youtube"] }
];

export const initialMappings = [
	{
		mappingName: "Scotia Chequing",
		accountName: "Scotia Chequing",
		columnFieldMapping: [
			{
				fieldName: "",
				columnIndex: 0
			},
			{
				fieldName: "Date",
				columnIndex: 1
			},
			{
				fieldName: "",
				columnIndex: 2
			},
			{
				fieldName: "Description",
				columnIndex: 3
			},
			{
				fieldName: "",
				columnIndex: 4
			},
			{
				fieldName: "Amount",
				columnIndex: 5
			},
			{
				fieldName: "",
				columnIndex: 6
			}
		],
		includesHeader: true,
		negativeAmountMeans: "Debit"
	},
	{
		mappingName: "Scotia Credit Card",
		accountName: "Scotia Credit Card",
		columnFieldMapping: [
			{
				fieldName: "",
				columnIndex: 0
			},
			{
				fieldName: "Date",
				columnIndex: 1
			},
			{
				fieldName: "Description",
				columnIndex: 2
			},
			{
				fieldName: "",
				columnIndex: 3
			},
			{
				fieldName: "",
				columnIndex: 4
			},
			{
				fieldName: "",
				columnIndex: 5
			},
			{
				fieldName: "Amount",
				columnIndex: 6
			}
		],
		includesHeader: true,
		negativeAmountMeans: "Credit"
	},
	{
		mappingName: "CIBC Credit Card",
		accountName: "CIBC Credit Card",
		columnFieldMapping: [
			{
				fieldName: "Date",
				columnIndex: 0
			},
			{
				fieldName: "Description",
				columnIndex: 1
			},
			{
				fieldName: "Debit",
				columnIndex: 2
			},
			{
				fieldName: "Credit",
				columnIndex: 3
			},
			{
				fieldName: "",
				columnIndex: 4
			}
		],
		includesHeader: false,
		negativeAmountMeans: ""
	},
	{
		mappingName: "CIBC Chequing",
		accountName: "CIBC Chequing",
		columnFieldMapping: [
			{
				columnIndex: 0,
				fieldName: "Date"
			},
			{
				columnIndex: 1,
				fieldName: "Description"
			},
			{
				columnIndex: 2,
				fieldName: "Debit"
			},
			{
				columnIndex: 3,
				fieldName: "Credit"
			}
		],
		includesHeader: false,
		negativeAmountMeans: ""
	},
	{
		mappingName: "CIBC Savings",
		accountName: "CIBC Savings",
		columnFieldMapping: [
			{
				columnIndex: 0,
				fieldName: "Date"
			},
			{
				columnIndex: 1,
				fieldName: "Description"
			},
			{
				columnIndex: 2,
				fieldName: "Debit"
			},
			{
				columnIndex: 3,
				fieldName: "Credit"
			}
		],
		includesHeader: false,
		negativeAmountMeans: ""
	},
	{
		mappingName: "TD Chequing",
		accountName: "TD Chequing",
		columnFieldMapping: [
			{
				columnIndex: 0,
				fieldName: "Date"
			},
			{
				columnIndex: 1,
				fieldName: "Description"
			},
			{
				columnIndex: 2,
				fieldName: "Debit"
			},
			{
				columnIndex: 3,
				fieldName: "Credit"
			},
			{
				columnIndex: 4,
				fieldName: ""
			}
		],
		includesHeader: false,
		negativeAmountMeans: ""
	},
	{
		mappingName: "Amazon Credit Card",
		accountName: "Amazon Credit Card",
		columnFieldMapping: [
			{
				columnIndex: 0,
				fieldName: "Date"
			},
			{
				columnIndex: 1,
				fieldName: "Description"
			},
			{
				columnIndex: 2,
				fieldName: ""
			},
			{
				columnIndex: 3,
				fieldName: "Amount"
			}
		],
		includesHeader: true,
		negativeAmountMeans: "Debit"
	}
];
