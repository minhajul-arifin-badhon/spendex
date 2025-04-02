"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Merchant, Transaction } from "@prisma/client";
import { CategoriesWithSub } from "@/app/types";
// import { Badge } from "./ui/badge";

interface ComponentProps {
	transactions: Transaction[];
	merchants: Merchant[];
	categories: CategoriesWithSub[];
	onEdit: (transaction: Transaction) => void;
	onDelete: (transaction: Transaction) => void;
}

export default function ListTransactions({ transactions, merchants, categories, onEdit, onDelete }: ComponentProps) {
	const getMerchantName = (merchantId: number | null) => {
		if (!merchantId) return null;
		const merchant = merchants.find((c) => c.id === merchantId);
		return merchant ? merchant.name : "-";
	};

	const getCategoryName = (categoryId: number | null, subcategoryId: number | null) => {
		if (!categoryId) return null;
		const category = categories.find((c) => c.id === categoryId);
		if (!category) return null;

		if (!subcategoryId) return category.name;
		const subcategory = category.subcategories.find((s) => s.id === subcategoryId);
		if (!subcategory) return category.name;
		return `${category.name} / ${subcategory.name}`;
	};

	// const getSubcategoryName = (categoryId: number | null, subcategoryId: number | null) => {
	// 	if (!categoryId || !subcategoryId) return null;
	// 	const category = categories.find((c) => c.id === categoryId);
	// 	if (!category) return null;
	// 	const subcategory = category.subcategories.find((s) => s.id === subcategoryId);
	// 	return subcategory ? subcategory.name : "-";
	// };

	const columns = useMemo<ColumnDef<Transaction>[]>(
		() => [
			{
				accessorKey: "date",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Date
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					const date = row.original.date;

					// Extract the year, month, and day
					const year = date.getFullYear();
					const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
					const day = String(date.getDate()).padStart(2, "0"); // Pad day with zero if necessary

					// Combine to form the YYYY-MM-DD format
					const formattedDate = `${year}-${month}-${day}`;

					return <div>{formattedDate}</div>;
				}
			},
			{
				accessorKey: "accountName",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Account Name
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				meta: {
					className: "hidden md:table-cell" // Hide on mobile and small tablets
				}
			},
			{
				accessorKey: "merchant",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Merchant
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					const merchantName = getMerchantName(row.original.merchantId);
					return <div>{merchantName || "-"}</div>;
				}
			},
			{
				accessorKey: "description",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Description
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				}
				// meta: {
				// 	className: "hidden md:table-cell" // Hide on mobile and small tablets
				// }
			},
			{
				accessorKey: "categoryId",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Category
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					const categoryName = getCategoryName(row.original.categoryId, row.original.subcategoryId);
					return <div>{categoryName || "-"}</div>;
				}
				// meta: {
				// 	className: "hidden sm:table-cell" // Hide on mobile
				// }
			},
			{
				accessorKey: "amount",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Amount
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => <div>{row.original.amount.toFixed(2)}</div>
			},
			{
				id: "actions",
				cell: ({ row }) => {
					return (
						<div className="flex space-x-1 sm:space-x-2">
							<Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
								<Pencil className="h-4 w-4" />
								<span className="sr-only">Edit</span>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="text-destructive hover:text-destructive/90"
								onClick={() => onDelete(row.original)}
							>
								<Trash2 className="h-4 w-4" />
								<span className="sr-only">Delete</span>
							</Button>
						</div>
					);
				}
			}
		],
		[]
	);

	// Table columns definition
	// const columns = useMemo<ColumnDef<Transaction>[]>(
	// 	() => [
	// 		// {
	// 		// 	accessorKey: "updatedAt",
	// 		// 	header: ({ column }) => {
	// 		// 		return (
	// 		// 			<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
	// 		// 				Updated
	// 		// 				<ArrowUpDown className="ml-2 h-4 w-4" />
	// 		// 			</Button>
	// 		// 		);
	// 		// 	}
	// 		// },
	// 		{
	// 			accessorKey: "name",
	// 			header: ({ column }) => {
	// 				return (
	// 					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
	// 						Merchant
	// 						<ArrowUpDown className="ml-2 h-4 w-4" />
	// 					</Button>
	// 				);
	// 			}
	// 		},
	// 		{
	// 			accessorKey: "includes",
	// 			header: "If Description Includes",
	// 			cell: ({ row }) => {
	// 				const includes = row.original.includes;
	// 				if (!includes || includes.length === 0) return <div>-</div>;

	// 				return (
	// 					<div className="max-w-[120px] sm:max-w-[200px] break-words mx-auto">
	// 						{includes.map((item) => (
	// 							<Badge key={item} variant="outline" className="mr-1 mb-1">
	// 								{item}
	// 							</Badge>
	// 						))}
	// 					</div>
	// 				);
	// 			}
	// 			// meta: {
	// 			// 	className: "hidden sm:table-cell" // Hide on mobile
	// 			// }
	// 		},
	// 		{
	// 			accessorKey: "categoryId",
	// 			header: "Category",
	// 			cell: ({ row }) => {
	// 				const categoryName = getCategoryName(row.original.categoryId);
	// 				return <div>{categoryName || "-"}</div>;
	// 			}
	// 			// meta: {
	// 			// 	className: "hidden sm:table-cell" // Hide on mobile
	// 			// }
	// 		},
	// 		{
	// 			accessorKey: "subcategoryId",
	// 			header: "Subcategory",
	// 			cell: ({ row }) => {
	// 				const subcategoryName = getSubcategoryName(row.original.categoryId, row.original.subcategoryId);
	// 				return <div>{subcategoryName || "-"}</div>;
	// 			}
	// 			// meta: {
	// 			// 	className: "hidden md:table-cell" // Hide on smaller screens
	// 			// }
	// 		},
	// 		{
	// 			id: "actions",
	// 			// header: "Actions",
	// 			cell: ({ row }) => {
	// 				return (
	// 					<div className="flex justify-center space-x-1 sm:space-x-2">
	// 						<Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
	// 							<Pencil className="h-4 w-4" />
	// 							<span className="sr-only">Edit</span>
	// 						</Button>
	// 						<Button
	// 							variant="ghost"
	// 							size="icon"
	// 							className="text-destructive hover:text-destructive/90"
	// 							onClick={() => onDelete(row.original)}
	// 						>
	// 							<Trash2 className="h-4 w-4" />
	// 							<span className="sr-only">Delete</span>
	// 						</Button>
	// 					</div>
	// 				);
	// 			}
	// 		}
	// 	],
	// 	[categories]
	// );

	return (
		<DataTable
			columns={columns}
			data={transactions}
			searchColumn="description"
			searchPlaceholder="Search transactions..."
		/>
	);
}
