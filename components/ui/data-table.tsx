"use client";

import { useState } from "react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	getFilteredRowModel,
	type ColumnFiltersState,
	type PaginationState
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchColumn?: string;
	searchPlaceholder?: string;
}

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData, TValue> {
		placeholder?: string;
		_TData?: TData;
		_TValue?: TValue;
	}
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchColumn,
	searchPlaceholder = "Search..."
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			pagination
		}
	});

	return (
		<div className="space-y-4">
			{searchColumn && (
				<div className="flex items-center justify-between">
					<Input
						placeholder={searchPlaceholder}
						value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
				</div>
			)}
			<div className="rounded-md border bg-card">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => {
									return (
										<TableHead
											key={header.id}
											className={`${index == 0 ? "border-r text-left" : "border-r text-center"}`}
										>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											// className={`${index == 0 ? "border-r text-left" : "border-r text-center"}`}
											className="border-r p-0"
										>
											{header.column.getCanFilter() ? (
												<Input
													placeholder={
														header.column.columnDef.meta?.placeholder || "Search..."
													}
													value={(header.column.getFilterValue() as string) ?? ""}
													onChange={(event) =>
														header.column.setFilterValue(event.target.value)
													}
													className={cn(
														"size-full border-0 rounded-none text-center shadow-none focus-visible:ring-0",
														index == 0 && "text-left pl-5"
													)}
												/>
											) : null}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell, index) => (
										<TableCell
											key={cell.id}
											className={`${index == 0 ? "text-left pl-5" : "text-center"}`}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center flex-col sm:flex-row justify-between sm:space-x-2 space-y-3">
				<div className="flex items-center space-x-2">
					<p className="text-sm text-muted-foreground inline-flex items-center">
						Showing
						<Select
							value={table.getState().pagination.pageSize.toString()}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger className="h-8 w-[70px] mx-2 ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
								<SelectValue placeholder={table.getState().pagination.pageSize.toString()} />
							</SelectTrigger>
							<SelectContent side="top">
								{[5, 10, 20, 50, 100].map((size) => (
									<SelectItem key={size} value={size.toString()}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						of {table.getFilteredRowModel().rows.length} entries
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<div className="flex items-center justify-center text-sm text-muted-foreground">
						Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
