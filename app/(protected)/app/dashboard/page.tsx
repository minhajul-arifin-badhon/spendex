"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TimePeriodSelector } from "@/components/dashboard/time-period-selection";
import { DateRange } from "react-day-picker";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { MerchantChart } from "@/components/dashboard/merchant-chart";
import { useGetTransactionsWithRelations } from "@/lib/react-query/transactions.queries";
import { Filters, TransactionWithRelations } from "@/app/types";
import { Spinner } from "@/components/ui/spinner";
import { getDateRange } from "@/lib/utils";
import Transactions from "@/components/transactions/transactions";

const initialRange: DateRange = {
	to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
	from: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1)
};

const defaultFilters: Filters = {
	moneyInCategory: "",
	moneyInSubcategory: "",
	moneyOutCategory: "",
	moneyOutSubcategory: "",
	moneyInMerchant: "",
	moneyOutMerchant: "",
	accountName: "",
	dateRange: initialRange
};

export default function Page() {
	// State for filters
	const {
		data: transactionsResponse,
		isLoading: isLoadingTransactions,
		isError: isErrorTransactions
	} = useGetTransactionsWithRelations();

	const [timePeriod, setTimePeriod] = useState("6months");
	const [customDateRange, setCustomDateRange] = useState(initialRange);

	const [filters, setFilters] = useState(defaultFilters);

	const filteredTransactions = useMemo(() => {
		if (isErrorTransactions || !transactionsResponse?.success) return [];

		const transactions = transactionsResponse.data as TransactionWithRelations[];
		// console.log(transactions);
		// console.log("Filtering transactions");
		// console.log(filters);

		// Helper to match category/subcategory/merchant logic
		// const matchesField = (fieldValue: string | undefined | null, filterValue: string | undefined) => {
		// 	if (!filterValue) return true;
		// 	if (filterValue === "Uncategorized") return !fieldValue;
		// 	return fieldValue?.toLowerCase().includes(filterValue.toLowerCase());
		// };

		const matchesExact = (fieldValue: string | undefined | null, filterValue: string) => {
			if (!filterValue) return true;
			if (filterValue === "Uncategorized") return !fieldValue;
			return fieldValue?.toLowerCase() === filterValue.toLowerCase();
		};

		return transactions.filter((tx) => {
			const isMoneyIn = tx.amount > 0;
			const isMoneyOut = tx.amount < 0;

			if (filters.dateRange.from && tx.date < filters.dateRange.from) return false;
			if (filters.dateRange.to && tx.date > filters.dateRange.to) return false;

			if (isMoneyIn && !matchesExact(tx.merchant?.name, filters.moneyInMerchant)) return false;
			if (isMoneyOut && !matchesExact(tx.merchant?.name, filters.moneyOutMerchant)) return false;

			if (!matchesExact(tx.accountName, filters.accountName)) return false;

			if (isMoneyIn && !matchesExact(tx.category?.name, filters.moneyInCategory)) return false;
			if (isMoneyIn && !matchesExact(tx.subcategory?.name, filters.moneyInSubcategory)) return false;

			if (isMoneyOut && !matchesExact(tx.category?.name, filters.moneyOutCategory)) return false;
			if (isMoneyOut && !matchesExact(tx.subcategory?.name, filters.moneyOutSubcategory)) return false;

			return true;
		});
	}, [transactionsResponse, filters, isErrorTransactions]);

	useEffect(() => {
		console.log("Changed custom range");
		handleFilterChange("dateRange", customDateRange);
	}, [customDateRange]);

	const handleTimePeriodChange = (value: string) => {
		setTimePeriod(value);

		const dateRange = getDateRange(value);

		if (dateRange) {
			console.log(dateRange.from, dateRange.to);
			handleFilterChange("dateRange", dateRange);
		}
	};

	const handleFilterChange = (key: string, value: string | DateRange) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const resetFilter = (key: string) => {
		setFilters((prev) => ({ ...prev, [key]: "" }));
	};

	const resetAllFilters = () => {
		setFilters(defaultFilters);
		setTimePeriod("6months");
	};

	const totalIncome = filteredTransactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
	const totalExpenses = filteredTransactions
		.filter((t) => t.amount < 0)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);
	const balance = totalIncome - totalExpenses;

	if (isLoadingTransactions)
		return (
			<div className="size-full -mt-20 min-h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);

	return (
		<DashboardProvider
			value={{
				timePeriod,
				filters,
				filteredTransactions,
				totalIncome,
				totalExpenses,
				balance,
				customDateRange,
				setCustomDateRange,
				handleTimePeriodChange,
				handleFilterChange,
				resetFilter,
				resetAllFilters
			}}
		>
			<>
				<div className="flex items-center lg:justify-between flex-wrap">
					<DashboardHeader />
					<TimePeriodSelector />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-6">
					<div className="col-span-1 gap-2 lg:gap-6">
						<div className="flex flex-row lg:flex-col lg:h-full gap-3 lg:gap-6">
							<SummaryCards />
						</div>
					</div>
					<div className="col-span-1 lg:col-span-4">
						<MonthlyChart />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
					<CategoryChart cashFlowType="moneyOut"></CategoryChart>
					<CategoryChart cashFlowType="moneyIn"></CategoryChart>
				</div>

				{/* <div className="flex gap-2 lg:gap-6 mb-2 lg:mb-6 ">
				<CategoryChart cashFlowType="moneyOut"></CategoryChart>
				<CategoryChart cashFlowType="moneyIn"></CategoryChart>
			</div> */}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6">
					<MerchantChart cashFlowType="moneyOut"></MerchantChart>
					<MerchantChart cashFlowType="moneyIn"></MerchantChart>
					{/* <ExpenseByCategoryChart></ExpenseByCategoryChart>
				<IncomeByCategoryChart></IncomeByCategoryChart> */}
				</div>

				{/* <CategoryCharts /> */}

				{/* <AdditionalCharts /> */}

				{/* <TransactionsTable /> */}

				<Transactions transactions={filteredTransactions}></Transactions>
			</>
		</DashboardProvider>
	);
}
