"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronRight, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "./theme/theme-toggle";

const navItems = [
	{ name: "Dashboard", href: "/app/dashboard", icon: null },
	{ name: "Transactions", href: "/app/transactions", icon: null },
	{ name: "Merchants", href: "/app/merchants", icon: null },
	{ name: "Categories", href: "/app/categories", icon: null },
	{ name: "Mappings", href: "/app/mappings", icon: null }
];

export const Navbar = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const { id, fullName: name, emailAddresses, imageUrl } = useUser().user || {};

	const user = {
		id,
		name,
		email: emailAddresses?.[0]?.emailAddress,
		imageUrl
	};

	const handleSignOut = () => {
		// Handle sign out logic here
		console.log("Signing out...");
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<div className="sticky top-0 z-50">
			{/* Main Navbar */}
			<nav className="bg-gray-900">
				<div className="flex h-18 items-center px-4 container mx-auto">
					<Link className="flex items-center md:w-[200px]" href="/">
						<span className="text-xl text-white">Spendex</span>
					</Link>

					<div className="hidden md:flex items-center justify-center flex-1">
						<div className="flex items-center space-x-8">
							{navItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={`text-sm font-medium transition-colors duration-300 hover:text-blue-500 ${
										pathname == item.href ? "md:text-blue-500" : "md:text-white"
									}`}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>

					<div className="ml-auto flex items-center md:w-[200px] md:justify-end gap-2 md:gap-3">
						<div className="">
							<ThemeToggle isLanding={false} />
						</div>

						{/* Profile Dropdown - Only visible on desktop */}
						<div className="hidden md:inline-flex">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="cursor-pointer relative h-8 w-8 rounded-full">
										<Avatar className="h-8 w-8">
											<AvatarImage src={user.imageUrl} alt={user?.name ?? "Name"} />
											<AvatarFallback>{user.name}</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">{user.name}</p>
											<p className="text-xs leading-none text-muted-foreground">{user.email}</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<SignOutButton>
										<DropdownMenuItem className="cursor-pointer">
											<LogOut className="mr-2 h-4 w-4" />
											<span>Log out</span>
										</DropdownMenuItem>
									</SignOutButton>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Mobile Menu Toggle - Only visible on mobile */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden text-white transition-all duration-300 cursor-pointer"
							onClick={toggleMobileMenu}
							aria-expanded={mobileMenuOpen}
						>
							{mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
							<span className="sr-only">Toggle menu</span>
						</Button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu - Expandable List */}
			<div
				className={cn(
					"md:hidden bg-background border-b overflow-hidden transition-all duration-300 ease-in-out",
					mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
				)}
			>
				<div className="px-4 py-3 space-y-1">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={`flex items-center py-3 text-sm font-medium transition-colors hover:text-blue-500 border-b border-muted last:border-0 ${
								item.href == pathname ? "text-blue-500" : ""
							}`}
							onClick={() => setMobileMenuOpen(false)}
						>
							{item.icon}
							{item.name}
							<ChevronRight className="ml-auto h-4 w-4 opacity-50" />
						</Link>
					))}

					<div className="py-4 mt-2 flex items-center">
						<Avatar className="h-10 w-10 mr-3">
							<AvatarImage src={user.imageUrl} alt={user?.name ?? "Name"} />
							<AvatarFallback>{user.name}</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<p className="text-sm font-medium">{user.name}</p>
							<p className="text-xs text-muted-foreground">{user.email}</p>
						</div>
						<SignOutButton>
							<Button
								variant="outline"
								size="sm"
								className="ml-auto cursor-pointer"
								onClick={handleSignOut}
							>
								<LogOut className="h-4 w-4" />
								<span className="sr-only">Log out</span>
							</Button>
						</SignOutButton>
					</div>
				</div>
			</div>
		</div>
	);
};
