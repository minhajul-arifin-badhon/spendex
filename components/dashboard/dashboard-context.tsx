"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Filters, TransactionWithRelations } from "@/app/types";
import { DateRange } from "react-day-picker";

interface DashboardContextType {
	timePeriod: string;
	filters: Filters;
	filteredTransactions: TransactionWithRelations[];
	totalIncome: number;
	totalExpenses: number;
	balance: number;
	customDateRange: DateRange;
	setCustomDateRange: (range: DateRange) => void;
	resetFilter: (key: string) => void;
	resetAllFilters: () => void;
	handleFilterChange: (key: string, value: string | DateRange) => void;
	handleTimePeriodChange: (value: string) => void;
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
