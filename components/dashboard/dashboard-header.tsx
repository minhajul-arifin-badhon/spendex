"use client";

import { useDashboard } from "./dashboard-context";

export function DashboardHeader() {
	const {
		selectedMonth,
		setSelectedMonth,
		selectedExpenseCategory,
		selectedIncomeCategory,
		selectedMerchant,
		selectedAccount,
		selectedSubcategory,
		resetAllSelections
	} = useDashboard();

	return (
		<div className="hidden lg:block">
			{/* {selectedMonth && (
				<div className="flex items-center gap-2 mb-4">
					<span className="text-sm font-medium">Selected Month: {selectedMonth}</span>
					<button className="text-sm text-blue-600 hover:underline" onClick={() => setSelectedMonth(null)}>
						Clear
					</button>
				</div>
			)} */}

			{(selectedExpenseCategory || selectedIncomeCategory || selectedMerchant || selectedAccount) && (
				<div className="flex items-center gap-2 mb-4">
					<span className="text-sm font-medium">
						Selected Filter:{" "}
						{selectedExpenseCategory || selectedIncomeCategory || selectedMerchant || selectedAccount}
						{selectedSubcategory && ` / ${selectedSubcategory}`}
					</span>
					<button className="text-sm text-blue-600 hover:underline" onClick={resetAllSelections}>
						Clear All Filters
					</button>
				</div>
			)}
		</div>
	);
}
