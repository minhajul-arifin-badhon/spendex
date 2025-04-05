"use client";

import { useState, useEffect } from "react";
import { format, subMonths } from "date-fns";

// import { DashboardProvider } from "@/components/dashboard/dashboard-context";
// import { DashboardHeader } from "@/components/dashboard/dashboard-header";
// import { TimePeriodSelector } from "@/components/dashboard/time-period-selector";
import { mockTransactions } from "@/lib/constants";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TimePeriodSelector } from "@/components/dashboard/time-period-selection";
import { DateRange } from "react-day-picker";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseByCategoryChart } from "@/components/dashboard/expense-by-category-chart";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { IncomeByCategoryChart } from "@/components/dashboard/income-by-category-chart";
import { ExpenseByMerchantChart } from "@/components/dashboard/expense-by-merchant-chart";
// import { SummaryCards } from "@/components/dashboard/summary-cards";
// import { MonthlyChart } from "@/components/dashboard/monthly-chart";
// import { CategoryCharts } from "@/components/dashboard/category-charts";
// import { AdditionalCharts } from "@/components/dashboard/additional-charts";
// import { TransactionsTable } from "@/components/dashboard/transactions-table";
// import { mockTransactions } from "@/lib/mock-data";

// // Define subcategories for each category
// const categorySubcategories = {
// 	Food: ["Groceries", "Restaurants", "Fast Food", "Coffee"],
// 	Transport: ["Fuel", "Public Transport", "Taxi", "Car Maintenance"],
// 	Entertainment: ["Movies", "Games", "Concerts", "Subscriptions"],
// 	Utilities: ["Electricity", "Water", "Internet", "Phone"],
// 	Salary: ["Regular", "Bonus", "Overtime"],
// 	Freelance: ["Design Work", "Development", "Consulting", "Writing"],
// 	Gifts: ["Received", "Given"]
// };

// // Time period options
// const timePeriods = [
// 	{ value: "today", label: "Today" },
// 	{ value: "week", label: "This Week" },
// 	{ value: "month", label: "This Month" },
// 	{ value: "3months", label: "Last 3 Months" },
// 	{ value: "6months", label: "Last 6 Months" },
// 	{ value: "year", label: "This Year" },
// 	{ value: "custom", label: "Custom" }
// ];

// // Colors for charts
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658"];

const initialRange: DateRange = {
	to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
	from: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1)
};

export default function Page() {
	// State for filters
	const [timePeriod, setTimePeriod] = useState("6months");
	const [dateRange, setDateRange] = useState(initialRange);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<string | null>(null);
	const [selectedIncomeCategory, setSelectedIncomeCategory] = useState<string | null>(null);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
	const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);
	const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
	const [searchFilters, setSearchFilters] = useState({
		amount: "",
		date: "",
		account: "",
		description: "",
		category: "",
		merchant: ""
	});

	// Chart interaction states
	const [hoverExpenseIndex, setHoverExpenseIndex] = useState<number | undefined>(undefined);
	const [hoverIncomeIndex, setHoverIncomeIndex] = useState<number | undefined>(undefined);
	const [hoverMerchantIndex, setHoverMerchantIndex] = useState<number | undefined>(undefined);
	const [hoverAccountIndex, setHoverAccountIndex] = useState<number | undefined>(undefined);
	// const [selectedExpenseIndex, setSelectedExpenseIndex] = useState<number | undefined>(undefined);
	const [selectedIncomeIndex, setSelectedIncomeIndex] = useState<number | undefined>(undefined);
	const [selectedMerchantIndex, setSelectedMerchantIndex] = useState<number | undefined>(undefined);
	const [selectedAccountIndex, setSelectedAccountIndex] = useState<number | undefined>(undefined);

	// Separate filtered transactions for different components
	const [baseFilteredTransactions, setBaseFilteredTransactions] = useState(mockTransactions);
	const [tableFilteredTransactions, setTableFilteredTransactions] = useState(mockTransactions);
	const [subcategoryData, setSubcategoryData] = useState<{ name: string; value: number }[]>([]);
	const [showSubcategories, setShowSubcategories] = useState(false);
	const [subcategoryTitle, setSubcategoryTitle] = useState("");

	// Update base filtered transactions based on time period and month selection
	useEffect(() => {
		let filtered = mockTransactions;

		// Filter by date range
		filtered = filtered.filter((transaction) => {
			const transactionDate = new Date(transaction.date);
			return transactionDate >= dateRange.from! && transactionDate <= dateRange.to!;
		});

		// Filter by selected month if any
		if (selectedMonth) {
			filtered = filtered.filter((transaction) => {
				return format(new Date(transaction.date), "MMM yyyy") === selectedMonth;
			});
		}

		// Apply search filters
		if (searchFilters.amount) {
			filtered = filtered.filter((t) => t.amount.toString().includes(searchFilters.amount));
		}
		if (searchFilters.date) {
			filtered = filtered.filter((t) => format(new Date(t.date), "yyyy-MM-dd").includes(searchFilters.date));
		}
		if (searchFilters.account) {
			filtered = filtered.filter((t) =>
				t.accountName?.toLowerCase().includes(searchFilters.account.toLowerCase())
			);
		}
		if (searchFilters.description) {
			filtered = filtered.filter((t) =>
				t.description?.toLowerCase().includes(searchFilters.description.toLowerCase())
			);
		}
		if (searchFilters.category) {
			filtered = filtered.filter(
				(t) =>
					t.category?.name.toLowerCase().includes(searchFilters.category.toLowerCase()) ||
					t.subcategory?.name.toLowerCase().includes(searchFilters.category.toLowerCase())
			);
		}
		if (searchFilters.merchant) {
			filtered = filtered.filter((t) =>
				t.merchant?.name.toLowerCase().includes(searchFilters.merchant.toLowerCase())
			);
		}

		setBaseFilteredTransactions(filtered);
	}, [timePeriod, dateRange, selectedMonth, searchFilters]);

	// Update table filtered transactions when category selections change
	useEffect(() => {
		let filtered = baseFilteredTransactions;

		// Apply filters based on selections
		if (selectedExpenseCategory) {
			filtered = filtered.filter((transaction) => {
				return transaction.amount < 0 && transaction.category?.name === selectedExpenseCategory;
			});

			// Further filter by subcategory if selected
			if (selectedSubcategory) {
				filtered = filtered.filter((transaction) => {
					return transaction.subcategory?.name === selectedSubcategory;
				});
			}

			// Generate subcategory data
			const subcategories: Record<string, number> = {};
			filtered.forEach((transaction) => {
				const subcategoryName = transaction.subcategory?.name;
				if (subcategoryName) {
					if (!subcategories[subcategoryName]) {
						subcategories[subcategoryName] = 0;
					}
					subcategories[subcategoryName] += Math.abs(transaction.amount);
				}
			});

			setSubcategoryData(Object.entries(subcategories).map(([name, value]) => ({ name, value })));
			setShowSubcategories(true);
			setSubcategoryTitle(`Expenses by Category - ${selectedExpenseCategory}`);
		} else if (selectedIncomeCategory) {
			filtered = filtered.filter((transaction) => {
				return transaction.amount > 0 && transaction.category?.name === selectedIncomeCategory;
			});
			setShowSubcategories(false);
		} else if (selectedMerchant) {
			filtered = filtered.filter((transaction) => {
				return transaction.amount < 0 && transaction.merchant?.name === selectedMerchant;
			});
			setShowSubcategories(false);
		} else if (selectedAccount) {
			filtered = filtered.filter((transaction) => {
				return transaction.amount < 0 && transaction.accountName === selectedAccount;
			});
			setShowSubcategories(false);
		} else {
			setShowSubcategories(false);
		}

		setTableFilteredTransactions(filtered);
	}, [
		baseFilteredTransactions,
		selectedExpenseCategory,
		selectedIncomeCategory,
		selectedSubcategory,
		selectedMerchant,
		selectedAccount
	]);

	// Handle time period change
	const handleTimePeriodChange = (value: string) => {
		console.log("Here to handle time period change----------------------");
		setTimePeriod(value);
		setSelectedMonth(null);

		const now = new Date();
		let from = now;
		let to = now;

		switch (value) {
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
				to = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
				from = new Date(to.getFullYear(), to.getMonth() - 2, 1); // First day of 3 months ago
				break;

			case "6months":
				to = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
				from = new Date(to.getFullYear(), to.getMonth() - 5, 1); // First day of 6 months ago
				break;

			case "year":
				from = new Date(now.getFullYear(), 0, 1); // Jan 1st this year
				to = now;
				break;

			case "custom":
				return;
		}

		console.log(from, to);
		setDateRange({ from, to });
	};

	// Reset all selections
	const resetAllSelections = () => {
		setSelectedExpenseCategory(null);
		setSelectedIncomeCategory(null);
		setSelectedSubcategory(null);
		setSelectedMerchant(null);
		setSelectedAccount(null);
		// setSelectedExpenseIndex(undefined);
		setSelectedIncomeIndex(undefined);
		setSelectedMerchantIndex(undefined);
		setSelectedAccountIndex(undefined);
		setShowSubcategories(false);
	};

	// Reset other selections when one type is selected
	const resetOtherSelections = (type: "expense" | "income" | "merchant" | "account") => {
		if (type !== "expense") {
			setSelectedExpenseCategory(null);
			// setSelectedExpenseIndex(undefined);
			setSelectedSubcategory(null);
			setShowSubcategories(false);
		}
		if (type !== "income") {
			setSelectedIncomeCategory(null);
			setSelectedIncomeIndex(undefined);
		}
		if (type !== "merchant") {
			setSelectedMerchant(null);
			setSelectedMerchantIndex(undefined);
		}
		if (type !== "account") {
			setSelectedAccount(null);
			setSelectedAccountIndex(undefined);
		}
	};

	// Handle search filter change
	const handleSearchFilterChange = (field: string, value: string) => {
		setSearchFilters((prev) => ({ ...prev, [field]: value }));
	};

	// Calculate summary data
	const totalIncome = baseFilteredTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
	const totalExpenses = baseFilteredTransactions
		.filter((t) => t.amount < 0)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);
	const balance = totalIncome - totalExpenses;

	return (
		<DashboardProvider
			value={{
				timePeriod,
				dateRange,
				setDateRange,
				selectedMonth,
				setSelectedMonth,
				selectedExpenseCategory,
				setSelectedExpenseCategory,
				selectedIncomeCategory,
				setSelectedIncomeCategory,
				selectedSubcategory,
				setSelectedSubcategory,
				selectedMerchant,
				setSelectedMerchant,
				selectedAccount,
				setSelectedAccount,
				searchFilters,
				setSearchFilters,
				hoverExpenseIndex,
				setHoverExpenseIndex,
				hoverIncomeIndex,
				setHoverIncomeIndex,
				hoverMerchantIndex,
				setHoverMerchantIndex,
				hoverAccountIndex,
				setHoverAccountIndex,
				// selectedExpenseIndex,
				// setSelectedExpenseIndex,
				selectedIncomeIndex,
				setSelectedIncomeIndex,
				selectedMerchantIndex,
				setSelectedMerchantIndex,
				selectedAccountIndex,
				setSelectedAccountIndex,
				baseFilteredTransactions,
				tableFilteredTransactions,
				subcategoryData,
				showSubcategories,
				subcategoryTitle,
				setShowSubcategories,
				resetAllSelections,
				resetOtherSelections,
				handleSearchFilterChange,
				handleTimePeriodChange,
				totalIncome,
				totalExpenses,
				balance
			}}
		>
			<div className="flex items-center lg:justify-between flex-wrap">
				<DashboardHeader />
				<TimePeriodSelector />
			</div>

			{/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"> */}
			{/* </div> */}

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-2 mb-2 lg:gap-6 lg:mb-6">
				<div className="col-span-1 gap-2 lg:gap-6">
					<div className="flex flex-row lg:flex-col lg:h-full gap-2 lg:gap-6">
						<SummaryCards />
					</div>
				</div>
				<div className="col-span-1 lg:col-span-4">
					<MonthlyChart />
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6 mb-2 lg:mb-6 ">
				<ExpenseByCategoryChart></ExpenseByCategoryChart>
				<ExpenseByMerchantChart></ExpenseByMerchantChart>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-6 mb-2 lg:mb-6 ">
				<ExpenseByCategoryChart></ExpenseByCategoryChart>
				<IncomeByCategoryChart></IncomeByCategoryChart>
			</div>

			{/* <CategoryCharts /> */}

			{/* <AdditionalCharts /> */}

			{/* <TransactionsTable /> */}
		</DashboardProvider>
	);
}
