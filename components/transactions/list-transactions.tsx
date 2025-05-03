"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { CategoryMinimal, MerchantMinimal, SubcategoryMinimal, TransactionWithRelations } from "@/app/types";
import { format } from "date-fns";
import { filterByAmount } from "@/lib/utils";

interface ComponentProps {
	transactions: TransactionWithRelations[];
	onEdit: (transaction: TransactionWithRelations) => void;
	onDelete: (transaction: TransactionWithRelations) => void;
}

export default function ListTransactions({ transactions, onEdit, onDelete }: ComponentProps) {
	const getFormattedCategory = (category: CategoryMinimal, subcategory: SubcategoryMinimal) => {
		const formattedCategory = category
			? subcategory
				? `${category.name} / ${subcategory.name}`
				: category.name
			: "-";
		return formattedCategory;
	};

	const columns = useMemo<ColumnDef<TransactionWithRelations>[]>(
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
					const formattedDate = format(new Date(row.original.date), "yyyy-MM-dd");
					return <div>{formattedDate}</div>;
				},

				filterFn: (row, columnId, filterValue) => {
					const formattedDate = format(new Date(row.original.date), "yyyy-MM-dd");
					return formattedDate.includes(filterValue);
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
				cell: ({ getValue }) => {
					const merchant = getValue<MerchantMinimal>();
					return <div>{merchant?.name || "-"}</div>;
				},
				filterFn: (row, columnId, filterValue) => {
					const merchant = row.getValue<MerchantMinimal>(columnId);
					return merchant?.name.toLowerCase().includes(filterValue.toLowerCase()) ?? filterValue == "-";
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
			},
			{
				accessorKey: "categoryFormatted",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Category
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					return getFormattedCategory(row.original.category, row.original.subcategory);
				},
				filterFn: (row, columnId, filterValue) => {
					const formattedCategory = getFormattedCategory(row.original.category, row.original.subcategory);
					return formattedCategory.toLowerCase().includes(filterValue.toLowerCase());
				}
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
				cell: ({ row }) => (
					<div className={row.original.amount <= 0 ? "text-chart-red" : "text-chart-green"}>
						{row.original.amount.toFixed(2)}
					</div>
				),
				filterFn: (row, columnId, filterValue) => {
					const amount = row.original.amount;
					return filterByAmount(amount, filterValue);
				},
				meta: {
					placeholder: "e.g. 100:500"
				}
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

	return <DataTable columns={columns} data={transactions} />;
}
