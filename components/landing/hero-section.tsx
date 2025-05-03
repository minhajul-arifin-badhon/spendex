"use client";

import { HeroGeometric } from "./elegant-shape";

export default function HeroSection() {
	return (
		<div className="relative">
			<HeroGeometric
				title1="Take Control of Your"
				title2="Finances"
				description="Spendex helps you track, analyze, and optimize your spending habits with powerful tools and intuitive visualizations."
				className="pt-16"
				buttonPosition="close"
			/>
		</div>
	);
}
