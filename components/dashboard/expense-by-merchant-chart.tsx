"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "./dashboard-context";
import { getBarSize, getMerchantData } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import React from "react";
import { TimePeriodDescription } from "./time-period-description";

export function ExpenseByMerchantChart() {
	const { baseFilteredTransactions, selectedMerchant, setSelectedMerchant, resetOtherSelections } = useDashboard();

	const expenseMerchantData = React.useMemo(
		() => getMerchantData(baseFilteredTransactions).sort((a, b) => b.value - a.value),
		[baseFilteredTransactions]
	);

	const handleMerchantClick = (merchant: string) => {
		const isSame = selectedMerchant === merchant;
		setSelectedMerchant(isSame ? null : merchant);
		resetOtherSelections("merchant");
	};

	const {
		barSize,
		chartData: expenseChartData,
		isTrimmed: isTrimmedExpenseData,
		height: expenseChartHeight
	} = getBarSize(expenseMerchantData);

	return (
		<Card className="flex flex-col rounded-md py-3 lg:py-6">
			<CardHeader className="lg:px-6 px-4 gap-1">
				<CardTitle className="text-sm lg:text-base">
					{isTrimmedExpenseData
						? `Expense by Top ${expenseChartData.length} Merchants`
						: "Expense by Merchant"}
					{selectedMerchant ? ` - ${selectedMerchant}` : ""}
				</CardTitle>
				<CardDescription className="text-xs lg:text-sm">
					<TimePeriodDescription></TimePeriodDescription>
				</CardDescription>
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
								handleMerchantClick(data.name);
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
