"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ThemeToggle({ isLanding }: { isLanding: boolean }) {
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Only show the theme toggle after mounting on client
	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	// Render a placeholder with the same dimensions until mounted
	if (!mounted) {
		return (
			<Button
				variant="ghost"
				size="icon"
				className={cn(
					"h-9 w-9 transition-colors text-white hover:text-blue-500 hover:bg-transparent",
					isLanding && ""
				)}
				disabled
			>
				<Sun className="h-[1.2rem] w-[1.2rem] opacity-0" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className={cn(
				"h-9 w-9 transition-colors text-white hover:text-blue-500 hover:bg-transparent",
				isLanding && ""
			)}
		>
			{resolvedTheme === "dark" ? (
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem]" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
