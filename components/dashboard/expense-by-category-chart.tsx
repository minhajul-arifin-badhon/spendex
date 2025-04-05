"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "./dashboard-context";
import { getBarSize, getCategoryData } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { TimePeriodDescription } from "./time-period-description";

export function ExpenseByCategoryChart() {
	const {
		baseFilteredTransactions,
		selectedExpenseCategory,
		setSelectedExpenseCategory,
		selectedSubcategory,
		setSelectedSubcategory,
		// setSelectedExpenseIndex,
		subcategoryData,
		showSubcategories,
		subcategoryTitle,
		setShowSubcategories,
		resetOtherSelections
	} = useDashboard();

	const expenseCategoryData = React.useMemo(
		() => getCategoryData(baseFilteredTransactions, false),
		[baseFilteredTransactions]
	);

	const expenseCategoryDataSorted = React.useMemo(() => {
		return expenseCategoryData.sort((a, b) => b.value - a.value);
	}, [expenseCategoryData]);

	const subcategoryDataSorted = React.useMemo(() => {
		return subcategoryData.sort((a, b) => b.value - a.value);
	}, [subcategoryData]);

	const handleExpenseCategoryClick = (category: string) => {
		setSelectedSubcategory(null);

		if (selectedExpenseCategory === category) {
			setSelectedExpenseCategory(null);
			// setSelectedExpenseIndex(undefined);
			resetOtherSelections("expense");
		} else {
			setSelectedExpenseCategory(category);
			// setSelectedExpenseIndex(index);
			resetOtherSelections("expense");
		}
	};

	const handleSubcategoryClick = (subcategory: string) => {
		if (selectedSubcategory === subcategory) {
			setSelectedSubcategory(null);
		} else {
			setSelectedSubcategory(subcategory);
		}
	};

	const {
		barSize,
		chartData: expenseChartData,
		isTrimmed: isTrimmedExpenseData,
		height: expenseChartHeight
	} = getBarSize(showSubcategories ? subcategoryDataSorted : expenseCategoryDataSorted);

	return (
		<Card className="flex flex-col rounded-md py-3 lg:py-6">
			<CardHeader className="flex justify-between items-center lg:px-6 px-4">
				<div className="space-y-1">
					<CardTitle className="text-sm lg:text-base">
						{showSubcategories
							? `${subcategoryTitle}${selectedSubcategory ? ` / ${selectedSubcategory}` : ""}`
							: "Expense Breakdown by Category"}
						{isTrimmedExpenseData ? ` (Top ${expenseChartData.length})` : ""}
					</CardTitle>
					<CardDescription className="text-xs lg:text-sm">
						<TimePeriodDescription></TimePeriodDescription>
					</CardDescription>
				</div>
				{showSubcategories && (
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							setShowSubcategories(false);
							setSelectedExpenseCategory(null);
							setSelectedSubcategory(null);
							// setSelectedExpenseIndex(undefined);
						}}
					>
						<ArrowLeft></ArrowLeft>
					</Button>
				)}
			</CardHeader>
			<CardContent className="flex flex-1 px-2 lg:px-6">
				<ChartContainer config={{}} className="w-full" style={{ minHeight: `${expenseChartHeight}px` }}>
					<BarChart
						accessibilityLayer
						data={expenseChartData}
						layout="vertical"
						margin={{
							left: 25,
							right: 36
						}}
					>
						<CartesianGrid horizontal={false} />
						<XAxis type="number" dataKey="value" hide />
						<YAxis
							dataKey="name"
							className=""
							type="category"
							tickLine={false}
							tickMargin={5}
							axisLine={false}
							interval={0}
							tickFormatter={(value) => `${value.slice(0, 16)}${value.length > 16 ? ".." : ""}`}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" className="hidden sm:block" />}
						/>
						<Bar
							dataKey="value"
							layout="vertical"
							fill="var(--chart-1)"
							barSize={barSize}
							radius={[1, 4, 4, 1]}
							className="cursor-pointer"
							onClick={(data) => {
								if (showSubcategories) {
									handleSubcategoryClick(data.name);
								} else {
									handleExpenseCategoryClick(data.name);
								}
							}}
						>
							<LabelList
								dataKey="value"
								position="right"
								offset={8}
								className="fill-foreground"
								fontSize={12}
								formatter={(data: number) => data.toLocaleString("en")}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="text-xs lg:text-sm flex-center">
				<div className="leading-none text-muted-foreground">Note: Click on the bars to drill down.</div>
			</CardFooter>
		</Card>
	);
}
