"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Merchant } from "@prisma/client";
import { CategoriesWithSub } from "@/app/types";
import { Badge } from "./ui/badge";

interface ComponentProps {
	merchants: Merchant[];
	categories: CategoriesWithSub[];
	onEdit: (mapping: Merchant) => void;
	onDelete: (mapping: Merchant) => void;
}

export default function ListMerchants({ merchants, categories, onEdit, onDelete }: ComponentProps) {
	const getCategoryName = (categoryId: number | null) => {
		if (!categoryId) return null;
		const category = categories.find((c) => c.id === categoryId);
		return category ? category.name : "-";
	};

	const getSubcategoryName = (categoryId: number | null, subcategoryId: number | null) => {
		if (!categoryId || !subcategoryId) return null;
		const category = categories.find((c) => c.id === categoryId);
		if (!category) return null;
		const subcategory = category.subcategories.find((s) => s.id === subcategoryId);
		return subcategory ? subcategory.name : "-";
	};

	// Table columns definition
	const columns = useMemo<ColumnDef<Merchant>[]>(
		() => [
			// {
			// 	accessorKey: "updatedAt",
			// 	header: ({ column }) => {
			// 		return (
			// 			<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
			// 				Updated
			// 				<ArrowUpDown className="ml-2 h-4 w-4" />
			// 			</Button>
			// 		);
			// 	}
			// },
			{
				accessorKey: "name",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Merchant
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				}
			},
			{
				accessorKey: "includes",
				header: "If Description Includes",
				cell: ({ row }) => {
					const includes = row.original.includes;
					if (!includes || includes.length === 0) return <div>-</div>;

					return (
						<div className="max-w-[120px] sm:max-w-[200px] break-words mx-auto">
							{includes.map((item) => (
								<Badge key={item} variant="outline" className="mr-1 mb-1">
									{item}
								</Badge>
							))}
						</div>
					);
				},
				filterFn: (row, columnId, filterValue) => {
					return row.original.includes.some((v) => v.toLowerCase().includes(filterValue.toLowerCase()));
				}
				// meta: {
				// 	className: "hidden sm:table-cell" // Hide on mobile
				// }
			},
			{
				accessorKey: "categoryId",
				header: "Category",
				cell: ({ row }) => {
					const categoryName = getCategoryName(row.original.categoryId);
					return <div>{categoryName || "-"}</div>;
				},
				filterFn: (row, columnId, filterValue) => {
					const categoryName = getCategoryName(row.original.categoryId);
					return categoryName?.toLowerCase().includes(filterValue.toLowerCase()) ?? filterValue == "-";
				}
				// meta: {
				// 	className: "hidden sm:table-cell" // Hide on mobile
				// }
			},
			{
				accessorKey: "subcategoryId",
				header: "Subcategory",
				cell: ({ row }) => {
					const subcategoryName = getSubcategoryName(row.original.categoryId, row.original.subcategoryId);
					return <div>{subcategoryName || "-"}</div>;
				},
				filterFn: (row, columnId, filterValue) => {
					const subcategoryName = getSubcategoryName(row.original.categoryId, row.original.subcategoryId);
					return subcategoryName?.toLowerCase().includes(filterValue.toLowerCase()) ?? filterValue == "-";
				}
				// meta: {
				// 	className: "hidden md:table-cell" // Hide on smaller screens
				// }
			},
			{
				id: "actions",
				// header: "Actions",
				cell: ({ row }) => {
					return (
						<div className="flex justify-center space-x-1 sm:space-x-2">
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
		[categories]
	);

	return <DataTable columns={columns} data={merchants} />;
}
