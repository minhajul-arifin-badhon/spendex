"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useDashboard } from "./dashboard-context";
import { timePeriods } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function TimePeriodSelector() {
	const { timePeriod, customDateRange, setCustomDateRange, handleTimePeriodChange } = useDashboard();

	return (
		<div
			className={cn(
				"mb-2 lg:mb-6 flex gap-2 flex-1 flex-row lg:flex-none justify-end",
				timePeriod === "custom" && "justify-between"
			)}
		>
			{timePeriod === "custom" && (
				<div className="">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className="w-full md:w-[240px] text-left font-normal rounded-md">
								<CalendarIcon className="mr-2 h-4 w-4" />
								{customDateRange.from ? (
									customDateRange.to ? (
										<>
											{format(customDateRange.from, "LLL dd, y")} -{" "}
											{format(customDateRange.to, "LLL dd, y")}
										</>
									) : (
										format(customDateRange.from, "LLL dd, y")
									)
								) : (
									<span>Pick a date range</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="range"
								selected={customDateRange}
								onSelect={(range) => range && setCustomDateRange(range)}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>
			)}

			<div className="lg:flex-wrap lg:gap-2 lg:flex hidden">
				{timePeriods.map((option) => (
					<Button
						key={option.value}
						onClick={() => handleTimePeriodChange(option.value)}
						// size="sm"
						variant="outline"
						className={cn(
							"border transition-colors focus-visible:outline-none duration-200 ease-in rounded-md bg-transparent hover:dark:bg-white hover:dark:text-gray-900 hover:bg-gray-900 hover:text-white",
							timePeriod === option.value && "dark:bg-white dark:text-gray-900 bg-gray-900 text-white"
						)}
					>
						{/* {option.value === "custom" && <CalendarIcon className="w-4 h-4" />} */}
						{option.label}
					</Button>
				))}
			</div>

			<div className="lg:hidden">
				<Select value={timePeriod} onValueChange={handleTimePeriodChange}>
					<SelectTrigger className="w-full lg:w-[180px] rounded-md">
						<SelectValue placeholder="Select a time" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{timePeriods.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
