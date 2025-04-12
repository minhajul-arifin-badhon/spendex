"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { filterByAmount } from "@/lib/utils";
import { Transaction } from "@prisma/client";

interface ComponentProps {
	transactions: Transaction[];
	onEdit: (transaction: Transaction) => void;
	onDelete: (transaction: Transaction) => void;
}

export default function ListTransactions({ transactions, onEdit, onDelete }: ComponentProps) {
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
				accessorKey: "category",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Category
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				}
			},
			{
				accessorKey: "subcategory",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Subcategory
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
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
				cell: ({ row }) => <div>{row.original.amount.toFixed(2)}</div>,
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
