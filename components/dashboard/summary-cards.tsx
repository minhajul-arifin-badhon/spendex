import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDashboard } from "./dashboard-context";

export function SummaryCards() {
	const { totalIncome, totalExpenses, balance } = useDashboard();

	return (
		<>
			<Card className="flex-center flex-1 rounded-md py-4 lg:p-0">
				<CardHeader className="w-full">
					<CardDescription className="text-xs lg:text-sm">Balance</CardDescription>
					<CardTitle
						className={cn(
							"text lg:text-2xl sm:text-xl font-semibold tabular-nums",
							balance >= 0 ? "text-green-600" : "text-red-600"
						)}
					>
						${balance.toLocaleString()}
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="flex-center flex-1 rounded-md py-4 lg:p-0">
				<CardHeader className="w-full">
					<CardDescription className="text-xs lg:text-sm">Money In</CardDescription>
					<CardTitle className="text lg:text-2xl sm:text-xl font-semibold tabular-nums text-green-600">
						${totalIncome.toLocaleString()}
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="flex-center flex-1 rounded-md py-4 lg:p-0">
				<CardHeader className="w-full">
					<CardDescription className="text-xs lg:text-sm">Money Out</CardDescription>
					<CardTitle className="text lg:text-2xl sm:text-xl font-semibold tabular-nums text-red-600">
						${totalExpenses.toLocaleString()}
					</CardTitle>
				</CardHeader>
			</Card>
		</>
	);
}
