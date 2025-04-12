"use client";

import { HeroGeometric } from "./elegant-shape";

export default function HeroSection() {
	return (
		<div className="relative">
			<HeroGeometric
				title1="Track and manage"
				title2="your finances"
				description="Spendex helps you track, analyze, and optimize your spending habits with powerful tools."
				className="pt-16" // Add padding for the navbar
				buttonPosition="close" // Position buttons closer to text
			/>
		</div>
	);
}
