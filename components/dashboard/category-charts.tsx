"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "./dashboard-context";
import { capitalize, generateColorGradient, generateHSLColors, getCategoryData } from "@/lib/utils";
import { DonutChart } from "./donut-chart";
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from "../ui/chart";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Label,
	LabelList,
	Pie,
	PieChart,
	ResponsiveContainer,
	Sector,
	XAxis,
	YAxis
} from "recharts";
import { ArrowLeft, ArrowLeftSquare, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import React from "react";
import { TimePeriodDescription } from "./time-period-description";

export function CategoryCharts() {
	const {
		baseFilteredTransactions,
		selectedExpenseCategory,
		setSelectedExpenseCategory,
		selectedIncomeCategory,
		setSelectedIncomeCategory,
		selectedSubcategory,
		setSelectedSubcategory,
		selectedExpenseIndex,
		setSelectedExpenseIndex,
		selectedIncomeIndex,
		setSelectedIncomeIndex,
		hoverExpenseIndex,
		setHoverExpenseIndex,
		hoverIncomeIndex,
		setHoverIncomeIndex,
		subcategoryData,
		showSubcategories,
		subcategoryTitle,
		setShowSubcategories,
		resetOtherSelections,
		dateRange
	} = useDashboard();

	const expenseCategoryData = getCategoryData(baseFilteredTransactions, false);
	let incomeCategoryData = getCategoryData(baseFilteredTransactions, true);

	// const colorsNew = generateHSLColors(incomeCategoryData.length);
	const colorsNew = generateColorGradient(
		incomeCategoryData.length,
		{ h: 4, s: 98, l: 77 },
		{ h: 201, s: 80, l: 45 }
	);

	// generateColorGradient;

	incomeCategoryData = incomeCategoryData.map((item, index) => ({
		...item,
		fill: colorsNew[index]
	}));

	const chartConfig = Object.fromEntries(incomeCategoryData.map(({ name }) => [name, { label: capitalize(name) }]));

	const incomeAmount = React.useMemo(() => {
		return incomeCategoryData.reduce((acc, curr) => {
			if (selectedIncomeCategory) {
				return curr.name === selectedIncomeCategory ? acc + curr.value : acc;
			}
			return acc + curr.value;
		}, 0);
	}, [incomeCategoryData, selectedIncomeCategory]);

	const expenseCategoryDataSorted = React.useMemo(() => {
		// console.log(expenseCategoryData);
		return expenseCategoryData.sort((a, b) => b.value - a.value);
	}, [expenseCategoryData]);

	const subcategoryDataSorted = React.useMemo(() => {
		return subcategoryData.sort((a, b) => b.value - a.value);
	}, [subcategoryData]);

	// Handle expense category click in pie chart
	const handleExpenseCategoryClick = (category: string, index: number) => {
		// Reset subcategory selection when changing categories
		setSelectedSubcategory(null);

		if (selectedExpenseCategory === category) {
			setSelectedExpenseCategory(null);
			setSelectedExpenseIndex(undefined);
			resetOtherSelections("expense");
		} else {
			setSelectedExpenseCategory(category);
			setSelectedExpenseIndex(index);
			resetOtherSelections("expense");
		}
	};

	// Handle subcategory click
	const handleSubcategoryClick = (subcategory: string, index: number) => {
		if (selectedSubcategory === subcategory) {
			setSelectedSubcategory(null);
		} else {
			setSelectedSubcategory(subcategory);
		}
	};

	// Handle income category click in pie chart
	const handleIncomeCategoryClick = (category: string, index: number) => {
		console.log(selectedIncomeCategory, category, index);

		if (selectedIncomeCategory === category) {
			setSelectedIncomeCategory(null);
			setSelectedIncomeIndex(undefined);
			resetOtherSelections("income");
			console.log("clearing");
		} else {
			console.log("setting");
			setSelectedIncomeCategory(category);
			setSelectedIncomeIndex(index);
			resetOtherSelections("income");
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			<Card className="flex flex-col">
				<CardHeader className="flex justify-between items-center">
					<div className="space-y-2">
						<CardTitle>
							{showSubcategories
								? `${subcategoryTitle}${selectedSubcategory ? ` / ${selectedSubcategory}` : ""}`
								: "Expense Breakdown by Category"}
						</CardTitle>
						<CardDescription>
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
								setSelectedExpenseIndex(undefined);
							}}
						>
							<ArrowLeft></ArrowLeft>
						</Button>
					)}
				</CardHeader>
				<CardContent className="flex-1">
					<ChartContainer config={chartConfig}>
						<BarChart
							accessibilityLayer
							data={showSubcategories ? subcategoryDataSorted : expenseCategoryDataSorted}
							layout="vertical"
							margin={{
								left: 25,
								right: 36
							}}
							maxBarSize={50}
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
								radius={5}
								className="cursor-pointer"
								onClick={(data, index) => {
									if (showSubcategories) {
										handleSubcategoryClick(data.name, index);
									} else {
										handleExpenseCategoryClick(data.name, index);
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
				<CardFooter className="text-sm flex-center">
					<div className="leading-none text-muted-foreground">Note: Click on the bars to drill down.</div>
				</CardFooter>
			</Card>

			<Card className="flex flex-col gap-6">
				<CardHeader className="items-center pb-0">
					<CardTitle>
						Income Breakdown by Category {selectedIncomeCategory && ` - ${selectedIncomeCategory}`}
					</CardTitle>
					<CardDescription>
						<TimePeriodDescription></TimePeriodDescription>
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-1 justify-center">
					<ChartContainer config={chartConfig} className="mx-auto min-h-[300px]">
						<PieChart
							onMouseMove={(state) => {
								if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
									setHoverIncomeIndex(state.activeTooltipIndex);
								} else {
									setHoverIncomeIndex(undefined);
								}
							}}
							onMouseLeave={() => setHoverIncomeIndex(undefined)}
						>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<ChartLegend content={<ChartLegendContent className="text-sm" />} />
							<Pie
								data={incomeCategoryData}
								dataKey="value"
								nameKey="name"
								innerRadius="50%"
								outerRadius="80%"
								strokeWidth={2}
								activeIndex={selectedIncomeIndex != undefined ? selectedIncomeIndex : hoverIncomeIndex}
								activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
									<Sector {...props} outerRadius={outerRadius + 5} />
								)}
								onClick={(data, index) => handleIncomeCategoryClick(data.name, index)}
								label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
							>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text
													x={viewBox.cx}
													y={viewBox.cy}
													textAnchor="middle"
													dominantBaseline="middle"
												>
													<tspan
														x={viewBox.cx}
														y={viewBox.cy}
														className="fill-foreground text-2xl font-semibold"
													>
														${incomeAmount.toLocaleString()}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy || 0) + 24}
														className="text-sm fill-muted-foreground"
													>
														{selectedIncomeCategory ? selectedIncomeCategory : "Total"}
													</tspan>
												</text>
											);
										}
									}}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>
				</CardContent>
				<CardFooter className="text-sm flex-center">
					<div className="leading-none text-muted-foreground">
						Note: Click on the sectors to select/unselect.
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
