"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "./dashboard-context";
import { capitalize, generateColorGradient, getCategoryData } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import React from "react";
import { TimePeriodDescription } from "./time-period-description";

export function MoneyinByCategoryChart() {
	const {
		baseFilteredTransactions,
		selectedIncomeCategory,
		setSelectedIncomeCategory,
		selectedIncomeIndex,
		setSelectedIncomeIndex,
		hoverIncomeIndex,
		setHoverIncomeIndex,
		resetOtherSelections
	} = useDashboard();

	const incomeCategoryData = React.useMemo(
		() => getCategoryData(baseFilteredTransactions, true),
		[baseFilteredTransactions]
	);

	const coloredIncomeData = React.useMemo(() => {
		const colors = generateColorGradient(
			incomeCategoryData.length,
			{ h: 4, s: 98, l: 77 },
			{ h: 201, s: 80, l: 45 }
		);

		return incomeCategoryData.map((item, index) => ({
			...item,
			fill: colors[index]
		}));
	}, [incomeCategoryData]);

	const chartConfig = React.useMemo(
		() => Object.fromEntries(coloredIncomeData.map(({ name }) => [name, { label: capitalize(name) }])),
		[coloredIncomeData]
	);

	const incomeAmount = React.useMemo(() => {
		return coloredIncomeData.reduce((acc, curr) => {
			if (selectedIncomeCategory) {
				return curr.name === selectedIncomeCategory ? acc + curr.value : acc;
			}
			return acc + curr.value;
		}, 0);
	}, [coloredIncomeData, selectedIncomeCategory]);

	const handleIncomeCategoryClick = React.useCallback(
		(category: string, index: number) => {
			const isSame = selectedIncomeCategory === category;
			setSelectedIncomeCategory(isSame ? null : category);
			setSelectedIncomeIndex(isSame ? undefined : index);
			resetOtherSelections("income");
		},
		[selectedIncomeCategory, setSelectedIncomeCategory, setSelectedIncomeIndex, resetOtherSelections]
	);

	return (
		<Card className="flex flex-col rounded-md py-3 lg:py-6">
			<CardHeader className="px-4 lg:px-6 gap-1">
				<CardTitle className="text-sm lg:text-base">
					Income Breakdown by Category {selectedIncomeCategory && ` - ${selectedIncomeCategory}`}
				</CardTitle>
				<CardDescription className="text-xs lg:text-sm">
					<TimePeriodDescription></TimePeriodDescription>
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 justify-center items-center px-2 lg:px-6">
				<ChartContainer
					config={chartConfig}
					className="mx-auto max-h-[180px] min-h-[180px] md:max-h-[260px] md:min-h-[260px] lg:min-h-[350px] lg:max-h-fit w-full"
				>
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
						<Pie
							data={coloredIncomeData}
							dataKey="value"
							nameKey="name"
							innerRadius="50%"
							outerRadius="75%"
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
													className="fill-foreground text-base lg:text-2xl font-semibold"
												>
													${incomeAmount.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="text lg:text-sm fill-muted-foreground"
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
			<CardFooter className="text-xs lg:text-sm flex-center">
				<div className="leading-none text-muted-foreground">Note: Click on the sectors to select/unselect.</div>
			</CardFooter>
		</Card>
	);
}
