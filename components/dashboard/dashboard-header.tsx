"use client";

import { useDashboard } from "./dashboard-context";

export function DashboardHeader() {
	const {} = useDashboard();

	return <div className="hidden lg:block"></div>;
}
