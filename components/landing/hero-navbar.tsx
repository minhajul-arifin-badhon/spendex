"use client";

import Link from "next/link";
// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// import { ThemeToggle } from "./theme-toggle";
// import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/theme-toggle";

export default function HeroNavbar() {
	const [scrolled, setScrolled] = useState(false);
	// const pathname = usePathname();

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 0;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [scrolled]);

	return (
		<header
			className={cn(
				"fixed top-0 z-50 w-full transition-all duration-300",
				scrolled ? "bg-[#0f172a]/95 shadow-lg" : "bg-transparent"
			)}
		>
			<div className="container flex h-16 w-11/12 max-w-screen-xl mx-auto items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-xl font-bold transition-colors text-white">Spendex</span>
				</Link>
				<nav className="flex items-center space-x-6">
					<Link href="/" className="text-sm transition-colors text-blue-500 font-semibold">
						Home
					</Link>
					<ThemeToggle isLanding={true} />
					{/* {scrolled && <Button size="sm">Get Started</Button>} */}
				</nav>
			</div>
		</header>
	);
}
