"use client";
import { useDashboard } from "./dashboard-context";
import { format } from "date-fns";

export function TimePeriodDescription() {
	const { filters } = useDashboard();
	const { dateRange } = filters;
	return (
		<>
			{dateRange.from ? (
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
