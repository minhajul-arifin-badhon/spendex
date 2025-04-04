import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDashboard } from "./dashboard-context";
import { Badge } from "../ui/badge";
import { TrendingUpIcon } from "lucide-react";

export function SummaryCards() {
	const { totalIncome, totalExpenses, balance } = useDashboard();

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total Balance</CardDescription>
					<CardTitle
						className={cn(
							"@[250px]/card:text-3xl text-2xl font-semibold tabular-nums",
							balance >= 0 ? "text-green-600" : "text-red-600"
						)}
					>
						${balance.toLocaleString()}
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total Income</CardDescription>
					<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-green-600">
						${totalIncome.toLocaleString()}
					</CardTitle>
				</CardHeader>
			</Card>

			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total Expenses</CardDescription>
					<CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-red-600">
						${totalExpenses.toLocaleString()}
					</CardTitle>
				</CardHeader>
			</Card>
		</div>
	);
}
