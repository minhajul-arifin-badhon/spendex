"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useDashboard } from "./dashboard-context";
import { getDateRange, getDateRangeOfMonth } from "@/lib/utils";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from "../ui/chart";
import { TimePeriodDescription } from "./time-period-description";
import { DateRange } from "react-day-picker";
import { getMonthlyData } from "@/lib/chart_utils";
import { isEqual } from "date-fns";
import React from "react";
// import { getMonthlyData } from "@/lib/chart-utils";

const monthlyChartConfig = {
	moneyIn: {
		label: "Money In",
		color: "var(--chart-green)"
	},
	moneyOut: {
		label: "Money Out",
		color: "var(--chart-red)"
	}
} satisfies ChartConfig;

export function MonthlyChart() {
	const { filters, filteredTransactions, timePeriod, customDateRange, handleFilterChange } = useDashboard();
	const monthlyData = React.useMemo(() => getMonthlyData(filteredTransactions), [filteredTransactions]);

	const handleMonthClick = (month: string) => {
		const dateRange = getDateRangeOfMonth(month);

		if (
			isEqual(filters.dateRange.from as Date, dateRange.from as Date) &&
			isEqual(filters.dateRange.to as Date, dateRange.to as Date)
		) {
			handleFilterChange(
				"dateRange",
				timePeriod == "custom" ? customDateRange : (getDateRange(timePeriod) as DateRange)
			);
		} else {
			handleFilterChange("dateRange", dateRange);
		}
	};

	return (
		<Card className="flex flex-col mb-2 lg:mb-6 rounded-md size-full lg:py-6 lg:pb-1 pb-3 pt-3">
			<CardHeader className="lg:px-6 px-4 gap-1">
				<CardTitle className="text-sm lg:text-base">Money In vs Money Out</CardTitle>
				<CardDescription className="text-xs lg:text-sm">
					<TimePeriodDescription></TimePeriodDescription>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 px-1 lg:px-6">
				<div className="h-[240px]">
					<ChartContainer config={monthlyChartConfig} className="size-full">
						<BarChart
							accessibilityLayer
							data={monthlyData}
							margin={{ right: 24, top: 0, bottom: 0 }}
							barSize={24}
							maxBarSize={30}
						>
							<CartesianGrid vertical={false} />
							<ChartTooltip content={<ChartTooltipContent />} />
							<ChartLegend content={<ChartLegendContent className="text-xs lg:text-sm" />} />

							<XAxis type="category" dataKey="month" axisLine={false} className="text-xs lg:text-sm" />
							<YAxis
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `$${value.toLocaleString()}`}
							/>
							<Bar
								name="Money In"
								dataKey="moneyIn"
								fill={monthlyChartConfig.moneyIn.color}
								radius={[4, 4, 0, 0]}
								className="cursor-pointer"
								onClick={(data) => handleMonthClick(data.month)}
							></Bar>
							<Bar
								name="Money Out"
								dataKey="moneyOut"
								fill={monthlyChartConfig.moneyOut.color}
								radius={[4, 4, 0, 0]}
								className="cursor-pointer"
								onClick={(data) => handleMonthClick(data.month)}
							></Bar>
						</BarChart>
					</ChartContainer>
				</div>
			</CardContent>
			{/* <CardFooter className="text-sm flex-center">
				<div className="leading-none text-muted-foreground">Note: Click on the bars to drill down.</div>
			</CardFooter> */}
		</Card>
	);
}
