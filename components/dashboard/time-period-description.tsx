"use client";
import { useDashboard } from "./dashboard-context";
import { format } from "date-fns";

export function TimePeriodDescription() {
	const { selectedMonth, dateRange } = useDashboard();

	return (
		<>
			{selectedMonth ? (
				selectedMonth
			) : dateRange.from ? (
				dateRange.to ? (
					<>
						{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
					</>
				) : (
					format(dateRange.from, "LLL dd, y")
				)
			) : (
				<span>Pick a date range</span>
			)}
		</>
	);
}
