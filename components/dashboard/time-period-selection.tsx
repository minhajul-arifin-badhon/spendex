"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useDashboard } from "./dashboard-context";
import { timePeriods } from "@/lib/constants";
import { TabsContent } from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export function TimePeriodSelector() {
	const { timePeriod, dateRange, setDateRange, handleTimePeriodChange } = useDashboard();

	return (
		<div className="mb-6 flex gap-2 justify-end">
			{timePeriod === "custom" && (
				// <div className="bg-white p-4 rounded-lg border shadow-sm">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" className="w-[240px] justify-start text-left font-normal rounded">
							<CalendarIcon className="mr-2 h-4 w-4" />
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
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="range"
							selected={dateRange}
							onSelect={(range) => range && setDateRange(range)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
				// </div>
			)}

			<div className="flex flex-wrap bg-muted rounded p-1">
				{/* {timePeriods.map((option) => (
					<button
						key={option.value}
						onClick={() => handleTimePeriodChange(option.value)}
						className={cn(
							"inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out",
							timePeriod === option.value
								? "bg-blue-500 text-white shadow-md"
								: "bg-white text-gray-700 hover:bg-gray-50 border"
						)}
					>
						{option.value === "custom" && <CalendarIcon className="w-4 h-4" />}
						{option.label}
					</button>
				))} */}

				{timePeriods.map((option) => (
					<Button
						key={option.value}
						onClick={() => handleTimePeriodChange(option.value)}
						size="sm"
						variant="ghost"
						className={cn(
							"transition-all bg-muted focus-visible:outline-none duration-200 ease-in rounded text-muted-foreground h-7.25",
							timePeriod === option.value
								? "bg-background text-foreground shadow-sm hover:bg-background"
								: ""
						)}
					>
						{/* {option.value === "custom" && <CalendarIcon className="w-4 h-4" />} */}
						{option.label}
					</Button>
				))}
			</div>
		</div>
	);
}
