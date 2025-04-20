"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { UnassignedDescription } from "@/app/types";

interface ComponentProps {
	unassignedDescriptions: UnassignedDescription[];
	onCreate: (unassignedDescription: UnassignedDescription) => void;
}

export default function ListUnassignedTransactions({ unassignedDescriptions, onCreate }: ComponentProps) {
	const columns = useMemo<ColumnDef<UnassignedDescription>[]>(
		() => [
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
				accessorKey: "count",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Frequency
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				}
			},
			{
				id: "actions",
				cell: ({ row }) => {
					return (
						<div className="">
							<Button variant="outline" onClick={() => onCreate(row.original)}>
								<Plus />
								Add Rule
							</Button>
						</div>
					);
				}
			}
		],
		[onCreate]
	);

	return (
		<div>
			<h2 className="pb-2 font-semibold">Unassigned Transactions</h2>

			<DataTable columns={columns} data={unassignedDescriptions} />
		</div>
	);
}
