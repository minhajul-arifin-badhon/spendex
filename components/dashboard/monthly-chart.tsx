"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboard } from "./dashboard-context";
import { getMonthlyData } from "@/lib/utils";
import { Button } from "../ui/button";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from "../ui/chart";
import { format } from "date-fns";
import { TimePeriodDescription } from "./time-period-description";
// import { getMonthlyData } from "@/lib/chart-utils";

const monthlyChartConfig = {
	income: {
		label: "Income",
		color: "#22c55e"
	},
	expenses: {
		label: "Expense",
		color: "#ef4444"
	}
} satisfies ChartConfig;

export function MonthlyChart() {
	const {
		baseFilteredTransactions,
		selectedMonth,
		setSelectedMonth,
		selectedExpenseCategory,
		selectedIncomeCategory,
		selectedSubcategory,
		dateRange
	} = useDashboard();

	const monthlyData = getMonthlyData(
		baseFilteredTransactions,
		selectedExpenseCategory,
		selectedIncomeCategory,
		selectedSubcategory
	);

	// Handle month click in bar chart
	const handleMonthClick = (month: string) => {
		if (selectedMonth === month) {
			setSelectedMonth(null);
		} else {
			setSelectedMonth(month);
		}
	};

	// Calculate optimal bar size based on number of months
	// const getBarSize = () => {
	// 	const count = monthlyData.length;
	// 	if (count <= 3) return 60;
	// 	if (count <= 6) return 40;
	// 	return 20;
	// };

	return (
		<Card className="flex flex-col mb-6">
			<CardHeader className="flex justify-between items-center">
				<div className="space-y-2">
					<CardTitle>
						Monthly Income vs Expenses
						{/* {showSubcategories
								? `${subcategoryTitle}${selectedSubcategory ? ` / ${selectedSubcategory}` : ""}`
								: "Expense Breakdown by Category"} */}
					</CardTitle>
					<CardDescription>
						{/* {dateRange.from ? (
							dateRange.to ? (
								<>
									{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
								</>
							) : (
								format(dateRange.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date range</span>
						)} */}
						<TimePeriodDescription></TimePeriodDescription>

						{/* {`${format(dateRange.from!, "MMM d, yyyy")} - ${format(dateRange.to!, "MMM d, yyyy")}`} */}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="flex-1">
				<div className="h-[300px]">
					<ChartContainer config={monthlyChartConfig} className="size-full">
						<BarChart
							accessibilityLayer
							data={monthlyData}
							margin={{ right: 30, top: 20 }}
							barSize={30}
							maxBarSize={30}
						>
							<CartesianGrid vertical={false} />
							<ChartTooltip content={<ChartTooltipContent />} />
							<ChartLegend content={<ChartLegendContent className="text-sm" />} />

							<XAxis type="category" dataKey="month" axisLine={false} className="text-sm" />
							<YAxis
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `$${value.toLocaleString()}`}
							/>
							<Bar
								name="Income"
								dataKey="income"
								fill="#22c55e"
								radius={[4, 4, 0, 0]}
								className="cursor-pointer"
								onClick={(data) => handleMonthClick(data.month)}
							></Bar>
							<Bar
								name="Expenses"
								dataKey="expenses"
								fill="#ef4444"
								radius={[4, 4, 0, 0]}
								className="cursor-pointer"
								onClick={(data) => handleMonthClick(data.month)}
							></Bar>
						</BarChart>
					</ChartContainer>
				</div>
			</CardContent>
			<CardFooter className="text-sm flex-center">
				<div className="leading-none text-muted-foreground">Note: Click on the bars to drill down.</div>
			</CardFooter>
		</Card>
	);
}
