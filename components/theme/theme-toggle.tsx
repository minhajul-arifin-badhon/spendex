"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ isLanding }: { isLanding: boolean }) {
	const { setTheme, resolvedTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

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
