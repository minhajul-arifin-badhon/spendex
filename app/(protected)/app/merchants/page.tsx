"use client";

import { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

type Merchant = {
	id: string;
	name: string;
	category?: string;
	subcategory?: string;
};

type Category = {
	id: string;
	name: string;
	subcategories: { id: string; name: string }[];
};

const initialMerchants: Merchant[] = [
	{ id: "1", name: "Walmart" },
	{ id: "2", name: "Target" },
	{ id: "3", name: "Amazon" },
	{ id: "4", name: "Best Buy" },
	{ id: "5", name: "Costco" },
	{ id: "6", name: "Home Depot" },
	{ id: "7", name: "Lowe's" },
	{ id: "8", name: "Popeyes" },
	{ id: "9", name: "Safeway" },
	{ id: "10", name: "Goodlife Fitness" },
	{ id: "11", name: "Trader Joe's" },
	{ id: "12", name: "Aldi" },
	{ id: "13", name: "Publix" },
	{ id: "14", name: "Walgreens" },
	{ id: "15", name: "CVS" },
];

const categories: Category[] = [
	{
		id: "cat1",
		name: "Home",
		subcategories: [
			{ id: "sub1", name: "Mortgages" },
			{ id: "sub2", name: "Utilities" },
			{ id: "sub3", name: "Property Tax" },
		],
	},
	{
		id: "cat2",
		name: "Transportation",
		subcategories: [
			{ id: "sub4", name: "Gas" },
			{ id: "sub5", name: "Maintainance" },
			{ id: "sub6", name: "Insurance" },
			{ id: "sub7", name: "Other Transportation" },
		],
	},
	{
		id: "cat3",
		name: "Food",
		subcategories: [
			{ id: "sub8", name: "Groceries" },
			{ id: "sub9", name: "Restaurants" },
			{ id: "sub10", name: "Other Food" },
		],
	},
	{
		id: "cat4",
		name: "Health and Wellness",
		subcategories: [
			{ id: "sub11", name: "Medical" },
			{ id: "sub12", name: "Gym" },
			{ id: "sub13", name: "Other Health" },
		],
	},
	{
		id: "cat5",
		name: "Travel",
		subcategories: [],
	},
	{
		id: "cat6",
		name: "Vacation",
		subcategories: [],
	},
	{
		id: "cat7",
		name: "Shopping",
		subcategories: [
			{ id: "sub14", name: "Clothing" },
			{ id: "sub15", name: "Other Shopping" },
		],
	},
	{
		id: "cat8",
		name: "Entertainment",
		subcategories: [],
	},
	{
		id: "cat9",
		name: "Education",
		subcategories: [],
	},
	{
		id: "cat10",
		name: "Subscriptions",
		subcategories: [],
	},
	{
		id: "cat11",
		name: "Gifts and Donations",
		subcategories: [],
	},
	{
		id: "cat12",
		name: "Business and Work",
		subcategories: [],
	},
	{
		id: "cat13",
		name: "Investments",
		subcategories: [],
	},
	{
		id: "cat14",
		name: "Insurance",
		subcategories: [],
	},
	{
		id: "cat15",
		name: "Loans and Fees",
		subcategories: [],
	},
	{
		id: "cat16",
		name: "Other Expenses",
		subcategories: [],
	},
];

export default function Page() {
	const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);

	const handleCategoryChange = (
		merchantId: string,
		categoryId: string,
		subcategoryId?: string
	) => {
		setMerchants((prevMerchants) =>
			prevMerchants.map((merchant) => {
				if (merchant.id === merchantId) {
					const category = categories.find(
						(c) => c.id === categoryId
					);
					const subcategory = category?.subcategories.find(
						(s) => s.id === subcategoryId
					);
					return {
						...merchant,
						category: category?.name,
						subcategory: subcategory?.name,
					};
				}
				return merchant;
			})
		);
	};

	const columns = useMemo<ColumnDef<Merchant>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(
									column.getIsSorted() === "asc"
								)
							}
						>
							Merchant
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
			},
			{
				accessorKey: "category",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(
									column.getIsSorted() === "asc"
								)
							}
						>
							Category
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => (
					<div>{row.original.category || "Uncategorized"}</div>
				),
			},
			{
				accessorKey: "subcategory",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(
									column.getIsSorted() === "asc"
								)
							}
						>
							Subcategory
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => (
					<div>{row.original.subcategory || "N/A"}</div>
				),
			},
			{
				id: "actions",
				cell: ({ row }) => {
					const merchant = row.original;

					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									Set Category{" "}
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								{categories.map((category) => (
									<DropdownMenuSub key={category.id}>
										<DropdownMenuSubTrigger>
											{category.name}
										</DropdownMenuSubTrigger>
										<DropdownMenuSubContent className="w-56">
											<DropdownMenuItem
												onSelect={() =>
													handleCategoryChange(
														merchant.id,
														category.id
													)
												}
											>
												{category.name} (General)
											</DropdownMenuItem>
											{category.subcategories.map(
												(subcategory) => (
													<DropdownMenuItem
														key={subcategory.id}
														onSelect={() =>
															handleCategoryChange(
																merchant.id,
																category.id,
																subcategory.id
															)
														}
													>
														{subcategory.name}
													</DropdownMenuItem>
												)
											)}
										</DropdownMenuSubContent>
									</DropdownMenuSub>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[]
	);

	return (
		<DataTable
			columns={columns}
			data={merchants}
			searchColumn="name"
			searchPlaceholder="Search merchants..."
		/>
	);
}
