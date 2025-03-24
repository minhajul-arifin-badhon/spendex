"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Mapping } from "@prisma/client";
import { ColumnFieldMappingProps } from "@/app/types";

interface ComponentProps {
	mappings: Mapping[];
	onEdit: (mapping: Mapping) => void;
	onDelete: (mapping: Mapping) => void;
}

export default function ListMappings({ mappings, onEdit, onDelete }: ComponentProps) {
	// Format column mappings for display in the table
	const formatColumnMappings = (columnFieldMapping: ColumnFieldMappingProps[]) => {
		return columnFieldMapping
			.filter((m) => m.fieldName)
			.map((cm) => `Column ${cm.columnIndex + 1} → ${cm.fieldName}`)
			.join(", ");
	};

	// Table columns definition
	const columns = useMemo<ColumnDef<Mapping>[]>(
		() => [
			{
				accessorKey: "mappingName",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Mapping Name
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				}
			},
			{
				accessorKey: "accountName",
				header: ({ column }) => {
					return (
						<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Account
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				}
			},
			{
				accessorKey: "columnFieldMapping",
				header: "Column Mappings",
				cell: ({ row }) => (
					<div className="max-w-[150px] sm:max-w-max mx-auto truncate">
						{formatColumnMappings(row.original.columnFieldMapping as ColumnFieldMappingProps[])}
					</div>
				)
			},
			{
				accessorKey: "includesHeader",
				header: "Includes Header",
				cell: ({ row }) => <div>{row.original.includesHeader ? "Yes" : "No"}</div>
			},
			{
				id: "actions",
				cell: ({ row }) => {
					return (
						<div className="flex justify-center space-x-2">
							<Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
								<Edit className="h-4 w-4" />
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
		[onEdit, onDelete]
	);

	return (
		<DataTable
			columns={columns}
			data={mappings}
			searchColumn="mappingName"
			searchPlaceholder="Search mappings..."
		/>
	);
}
