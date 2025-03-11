"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, LogOut, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";

// Navigation items
const navItems = [
	// { name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
	{ name: "Transactions", href: "/app/dashboard", icon: null },
	{ name: "Merchants", href: "/app/merchants", icon: null },
	{ name: "Categories", href: "/app/categories", icon: null },
	{ name: "Mappings", href: "/app/mappings", icon: null },
];

export const Navbar = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	// In a real app, this would come from your auth provider
	const user = {
		name: "John Doe",
		email: "john.doe@example.com",
		imageUrl: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
	};

	const handleSignOut = () => {
		// Handle sign out logic here
		console.log("Signing out...");
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<div className="">
			{/* Main Navbar */}
			<nav className="bg-gray-900">
				<div className="flex h-18 items-center px-4 container mx-auto">
					{/* Logo and App Name */}
					<Link className="flex items-center md:w-[200px]" href="/">
						<div className="relative h-8 w-8 mr-4">
							<Image
								src="https://cdn-icons-png.flaticon.com/512/7892/7892621.png"
								className="h-8"
								alt="Spendex Logo"
								width={36}
								height={40}
							/>
						</div>
						<span className="text-xl text-white">Spendex</span>
					</Link>

					{/* Desktop Navigation - Centered */}
					<div className="hidden md:flex items-center justify-center flex-1">
						<div className="flex items-center space-x-8">
							{navItems.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={`text-sm font-medium transition-colors duration-300 hover:text-blue-500 ${
										pathname == item.href
											? "md:text-blue-500"
											: "md:text-white"
									}`}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>

					{/* Right side with profile */}
					<div className="ml-auto flex items-center md:w-[200px] md:justify-end">
						{/* Profile Dropdown - Only visible on desktop */}
						<div className="hidden md:inline-flex">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="cursor-pointer relative h-8 w-8 rounded-full"
									>
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={user.imageUrl}
												alt={user.name}
											/>
											<AvatarFallback>
												{user.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-56"
									align="end"
									forceMount
								>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{user.name}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												{user.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem className="cursor-pointer">
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={handleSignOut}
									>
										<LogOut className="mr-2 h-4 w-4" />
										<span>Log out</span>
									</DropdownMenuItem>
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
							{mobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
							<span className="sr-only">Toggle menu</span>
						</Button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu - Expandable List */}
			<div
				className={cn(
					"md:hidden bg-background border-b overflow-hidden transition-all duration-300 ease-in-out",
					mobileMenuOpen
						? "max-h-[400px] opacity-100"
						: "max-h-0 opacity-0"
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
							<AvatarImage src={user.imageUrl} alt={user.name} />
							<AvatarFallback>
								{user.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<p className="text-sm font-medium">{user.name}</p>
							<p className="text-xs text-muted-foreground">
								{user.email}
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="ml-auto cursor-pointer"
							onClick={handleSignOut}
						>
							<LogOut className="h-4 w-4" />
							<span className="sr-only">Log out</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
