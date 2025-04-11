"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "./dashboard-context";
import { getBarSize } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import React, { useState } from "react";
import { TimePeriodDescription } from "./time-period-description";
import { getMerchantData } from "@/lib/chart_utils";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Switch } from "../ui/switch";

export function MerchantChart({ cashFlowType }: { cashFlowType: string }) {
	const { filters, filteredTransactions, handleFilterChange } = useDashboard();
	const [showChart, setShowChart] = useState(true);

	const barColor = cashFlowType == "moneyIn" ? "var(--chart-green)" : "var(--chart-red)";
	const cashFlowTitle = cashFlowType == "moneyIn" ? "Money In" : "Money Out";
	const merchantKey = cashFlowType == "moneyIn" ? "moneyInMerchant" : "moneyOutMerchant";

	const chartData = React.useMemo(
		() => getMerchantData(filteredTransactions, cashFlowType == "moneyIn"),
		[filteredTransactions, cashFlowType]
	);

	const handleMerchantClick = (merchant: string) => {
		const isSame = filters[merchantKey] === merchant;
		handleFilterChange(merchantKey, isSame ? "" : merchant);
		// resetOtherSelections("merchant");
	};

	const {
		barSize,
		chartData: processedChartData,
		isTrimmed: isTrimmedData,
		height: chartHeight
	} = getBarSize(chartData);

	return (
		<Card className="flex flex-col rounded-md py-3 lg:py-6">
			<CardHeader className="flex justify-between items-center lg:px-6 px-4">
				<div className="space-y-1">
					<CardTitle className="text-sm lg:text-base">
						{isTrimmedData
							? `${cashFlowTitle} by Top ${processedChartData.length} Merchants`
							: `${cashFlowTitle} by Merchant`}
						{filters[merchantKey] ? ` - ${filters[merchantKey]}` : ""}
					</CardTitle>
					<CardDescription className="text-xs lg:text-sm">
						<TimePeriodDescription></TimePeriodDescription>
					</CardDescription>
				</div>
				<div className="space-x-3 flex-center">
					{filters[merchantKey] && (
						<Button
							variant="outline"
							size="icon"
							onClick={() => {
								handleFilterChange(merchantKey, "");
							}}
						>
							<ArrowLeft></ArrowLeft>
						</Button>
					)}
					<Switch onCheckedChange={setShowChart} checked={showChart} />
				</div>
			</CardHeader>
			{showChart && (
				<>
					<CardContent className="flex flex-1 px-2 lg:px-6">
						<ChartContainer config={{}} className="w-full" style={{ minHeight: `${chartHeight}px` }}>
							<BarChart
								accessibilityLayer
								data={processedChartData}
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
									fill={barColor}
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
				</>
			)}
		</Card>
	);
}
