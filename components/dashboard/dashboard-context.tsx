"use client";

import { createContext, useContext, type ReactNode } from "react";
import { TransactionWithRelations } from "@/app/types";
import { DateRange } from "react-day-picker";

interface DashboardContextType {
	timePeriod: string;
	dateRange: DateRange;
	setDateRange: (range: DateRange) => void;
	selectedMonth: string | null;
	setSelectedMonth: (month: string | null) => void;
	selectedExpenseCategory: string | null;
	setSelectedExpenseCategory: (category: string | null) => void;
	selectedIncomeCategory: string | null;
	setSelectedIncomeCategory: (category: string | null) => void;
	selectedSubcategory: string | null;
	setSelectedSubcategory: (subcategory: string | null) => void;
	selectedMerchant: string | null;
	setSelectedMerchant: (merchant: string | null) => void;
	selectedAccount: string | null;
	setSelectedAccount: (account: string | null) => void;
	searchFilters: {
		amount: string;
		date: string;
		account: string;
		description: string;
		category: string;
		merchant: string;
	};
	setSearchFilters: (filters: any) => void;
	hoverExpenseIndex: number | undefined;
	setHoverExpenseIndex: (index: number | undefined) => void;
	hoverIncomeIndex: number | undefined;
	setHoverIncomeIndex: (index: number | undefined) => void;
	hoverMerchantIndex: number | undefined;
	setHoverMerchantIndex: (index: number | undefined) => void;
	hoverAccountIndex: number | undefined;
	setHoverAccountIndex: (index: number | undefined) => void;
	selectedExpenseIndex: number | undefined;
	setSelectedExpenseIndex: (index: number | undefined) => void;
	selectedIncomeIndex: number | undefined;
	setSelectedIncomeIndex: (index: number | undefined) => void;
	selectedMerchantIndex: number | undefined;
	setSelectedMerchantIndex: (index: number | undefined) => void;
	selectedAccountIndex: number | undefined;
	setSelectedAccountIndex: (index: number | undefined) => void;
	baseFilteredTransactions: TransactionWithRelations[];
	tableFilteredTransactions: TransactionWithRelations[];
	subcategoryData: { name: string; value: number }[];
	showSubcategories: boolean;
	subcategoryTitle: string;
	setShowSubcategories: (show: boolean) => void;
	resetAllSelections: () => void;
	resetOtherSelections: (type: "expense" | "income" | "merchant" | "account") => void;
	handleSearchFilterChange: (field: string, value: string) => void;
	handleTimePeriodChange: (value: string) => void;
	totalIncome: number;
	totalExpenses: number;
	balance: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children, value }: { children: ReactNode; value: DashboardContextType }) {
	return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
	const context = useContext(DashboardContext);
	if (context === undefined) {
		throw new Error("useDashboard must be used within a DashboardProvider");
	}
	return context;
}
