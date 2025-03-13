"use client";

import type React from "react";
import { useState, useMemo, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Download, MoreHorizontal, Upload } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";

type Transaction = {
	id: string;
	date: string;
	accountName: string;
	merchant: string;
	description: string;
	category: string;
	subcategory: string;
	amount: number;
};

const initialTransactions: Transaction[] = [
	{
		id: "1",
		date: "2023-05-01",
		accountName: "Checking Account",
		merchant: "Walmart",
		description: "Groceries",
		category: "Food",
		subcategory: "Groceries",
		amount: 56.78,
	},
	{
		id: "2",
		date: "2023-05-02",
		accountName: "Credit Card",
		merchant: "Amazon",
		description: "Books",
		category: "Entertainment",
		subcategory: "Reading",
		amount: 34.99,
	},
	{
		id: "3",
		date: "2023-05-03",
		accountName: "Savings Account",
		merchant: "Transfer",
		description: "Monthly savings",
		category: "Savings",
		subcategory: "Regular savings",
		amount: 500.0,
	},
	{
		id: "4",
		date: "2023-05-04",
		accountName: "Credit Card",
		merchant: "Netflix",
		description: "Monthly subscription",
		category: "Entertainment",
		subcategory: "Streaming",
		amount: 14.99,
	},
	{
		id: "5",
		date: "2023-05-05",
		accountName: "Checking Account",
		merchant: "Shell",
		description: "Gas",
		category: "Transportation",
		subcategory: "Fuel",
		amount: 45.23,
	},
	{
		id: "6",
		date: "2023-05-06",
		accountName: "Credit Card",
		merchant: "Starbucks",
		description: "Coffee",
		category: "Food",
		subcategory: "Dining Out",
		amount: 5.65,
	},
	{
		id: "7",
		date: "2023-05-07",
		accountName: "Checking Account",
		merchant: "AT&T",
		description: "Phone bill",
		category: "Utilities",
		subcategory: "Phone",
		amount: 85.99,
	},
	{
		id: "8",
		date: "2023-05-08",
		accountName: "Credit Card",
		merchant: "Target",
		description: "Household items",
		category: "Home",
		subcategory: "Supplies",
		amount: 67.45,
	},
	{
		id: "9",
		date: "2023-05-09",
		accountName: "Checking Account",
		merchant: "Gym",
		description: "Monthly membership",
		category: "Health",
		subcategory: "Fitness",
		amount: 50.0,
	},
	{
		id: "10",
		date: "2023-05-10",
		accountName: "Credit Card",
		merchant: "Amazon",
		description: "Electronics",
		category: "Shopping",
		subcategory: "Electronics",
		amount: 129.99,
	},
	{
		id: "11",
		date: "2023-05-11",
		accountName: "Checking Account",
		merchant: "Electric Company",
		description: "Electricity bill",
		category: "Utilities",
		subcategory: "Electricity",
		amount: 110.5,
	},
	{
		id: "12",
		date: "2023-05-12",
		accountName: "Credit Card",
		merchant: "Uber",
		description: "Ride",
		category: "Transportation",
		subcategory: "Ride Share",
		amount: 24.75,
	},
];

const mappingOptions = ["Default", "Option 1", "Option 2", "Option 3"];

const columnOptions = [
	"Date",
	"Account Name",
	"Merchant",
	"Description",
	"Category",
	"Subcategory",
	"Amount",
];

// Helper function to truncate text and remove quotations
const truncateText = (text: string, maxLength = 30) => {
	if (!text) return "";

	// Remove quotation marks from the beginning and end
	let processedText = text;
	if (typeof processedText === "string") {
		if (processedText.startsWith('"') && processedText.endsWith('"')) {
			processedText = processedText.substring(
				1,
				processedText.length - 1
			);
		}
		if (processedText.startsWith("'") && processedText.endsWith("'")) {
			processedText = processedText.substring(
				1,
				processedText.length - 1
			);
		}
	}

	return processedText.length > maxLength
		? `${processedText.substring(0, maxLength)}...`
		: processedText;
};

export default function Page() {
	const [transactions] = useState<Transaction[]>(initialTransactions);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [accountName, setAccountName] = useState("");
	const [mappingOption, setMappingOption] = useState("");
	const [includesHeader, setIncludesHeader] = useState(false);
	const [csvPreview, setCsvPreview] = useState<string[][]>([]);
	const [columnMapping, setColumnMapping] = useState<string[]>([]);
	// Add a new state for mapping name
	const [mappingName, setMappingName] = useState("");

	// Add a type for saved mappings
	type SavedMapping = {
		name: string;
		includesHeader: boolean;
		columnMapping: string[];
	};

	// Add a state for saved mappings after the other state declarations
	const [savedMappings, setSavedMappings] = useState<SavedMapping[]>([]);
	const [mappingNameError, setMappingNameError] = useState<string | null>(
		null
	);

	// Get available options for a specific column (excluding already assigned fields)
	const getAvailableOptions = useCallback(
		(columnIndex: number) => {
			const assignedFields = columnMapping.filter(
				(field, index) => field && index !== columnIndex
			);
			return columnOptions.filter(
				(option) => !assignedFields.includes(option)
			);
		},
		[columnMapping]
	);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const parseFile = useCallback((file: File) => {
		return new Promise<string[][]>((resolve) => {
			const reader = new FileReader();

			if (file.name.endsWith(".csv")) {
				// Handle CSV
				reader.onload = (e) => {
					const content = e.target?.result as string;
					const rows = content
						.split("\n")
						.map((row) =>
							row.split(",").map((cell) => cell.trim())
						);
					resolve(rows);
				};
				reader.readAsText(file);
			} else if (
				file.name.endsWith(".xlsx") ||
				file.name.endsWith(".xls")
			) {
				// Handle Excel
				reader.onload = (e) => {
					const data = new Uint8Array(
						e.target?.result as ArrayBuffer
					);
					const workbook = XLSX.read(data, { type: "array" });

					// Get the first worksheet
					const worksheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[worksheetName];

					// Convert to array of arrays and handle empty cells
					const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
						header: 1,
					});

					// Ensure all rows have the same number of columns
					const maxCols = Math.max(...rows.map((row) => row.length));
					const normalizedRows = rows.map((row) => {
						const normalizedRow = [...row];
						while (normalizedRow.length < maxCols) {
							normalizedRow.push("");
						}
						return normalizedRow;
					});

					resolve(normalizedRows);
				};
				reader.readAsArrayBuffer(file);
			} else {
				resolve([]);
			}
		});
	}, []);

	const handleImport = async () => {
		if (selectedFile && accountName) {
			if (mappingOption) {
				// Process import with selected mapping
				console.log("Importing with mapping:", mappingOption);
				setIsImportModalOpen(false);
			} else {
				// Show mapping modal
				try {
					const rows = await parseFile(selectedFile);
					setCsvPreview(rows.slice(0, 5)); // Preview first 5 rows
					setColumnMapping(Array(rows[0]?.length || 0).fill(""));
					setIsMappingModalOpen(true);
				} catch (error) {
					console.error("Error parsing file:", error);
				}
			}
		}
	};

	// Update the handleMappingSubmit function to validate mapping names
	const handleMappingSubmit = () => {
		// Validate mapping name
		if (!mappingName.trim()) {
			setMappingNameError("Mapping name is required");
			return;
		}

		// Check for duplicate mapping name
		const isDuplicate = savedMappings.some(
			(mapping) =>
				mapping.name.toLowerCase() === mappingName.trim().toLowerCase()
		);

		if (isDuplicate) {
			setMappingNameError("A mapping with this name already exists");
			return;
		}

		// Clear any previous errors
		setMappingNameError(null);

		// Save the new mapping
		const newMapping: SavedMapping = {
			name: mappingName.trim(),
			includesHeader,
			columnMapping,
		};

		setSavedMappings((prev) => [...prev, newMapping]);

		// Process import with custom mapping
		console.log("Importing with custom mapping:", newMapping);
		setIsMappingModalOpen(false);
		setIsImportModalOpen(false);
	};

	// Add a function to validate mapping name as user types
	const validateMappingName = (name: string) => {
		if (!name.trim()) {
			setMappingNameError("Mapping name is required");
			return;
		}

		const isDuplicate = savedMappings.some(
			(mapping) =>
				mapping.name.toLowerCase() === name.trim().toLowerCase()
		);

		if (isDuplicate) {
			setMappingNameError("A mapping with this name already exists");
		} else {
			setMappingNameError(null);
		}
	};

	// Update the setMappingName function to validate as user types
	const handleMappingNameChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const newName = e.target.value;
		setMappingName(newName);
		validateMappingName(newName);
	};

	const handleColumnMappingChange = (columnIndex: number, value: string) => {
		setColumnMapping((prev) => {
			const newMapping = [...prev];

			// If this field was already assigned to another column, clear that assignment
			if (value && value !== "none") {
				const existingIndex = newMapping.findIndex(
					(field) => field === value
				);
				if (existingIndex !== -1 && existingIndex !== columnIndex) {
					newMapping[existingIndex] = "";
				}
			}

			// Set the new value (or empty string if "none" was selected)
			newMapping[columnIndex] = value === "none" ? "" : value;
			return newMapping;
		});
	};

	const columns = useMemo<ColumnDef<Transaction>[]>(
		() => [
			{
				accessorKey: "date",
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
							Date
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
			},
			{
				accessorKey: "accountName",
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
							Account Name
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
			},
			{
				accessorKey: "merchant",
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
				accessorKey: "description",
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
							Description
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
							Category / Subcategory
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => (
					<div>{`${row.original.category} / ${row.original.subcategory}`}</div>
				),
			},
			{
				accessorKey: "amount",
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
							Amount
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
				cell: ({ row }) => <div>{row.original.amount.toFixed(2)}</div>,
			},
			{
				id: "actions",
				cell: () => {
					return (
						<Button variant="ghost" size="sm">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					);
				},
			},
		],
		[]
	);

	return (
		<div className="space-y-4">
			<div className="flex justify-end space-x-3">
				<Button
					variant="outline"
					className="cursor-pointer"
					onClick={() => setIsImportModalOpen(true)}
				>
					<Upload className="mr-2 h-4 w-4" /> Import
				</Button>

				<Button
					variant="outline"
					className="cursor-pointer"
					onClick={() => setIsImportModalOpen(true)}
				>
					<Download className="mr-2 h-4 w-4" /> Export
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={transactions}
				searchColumn="description"
				searchPlaceholder="Search transactions..."
			/>

			<Dialog
				open={isImportModalOpen}
				onOpenChange={setIsImportModalOpen}
			>
				<DialogContent className="w-11/12 sm:max-w-3xl max-h-11/12 sm:max-h-11/12 overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Import Transactions</DialogTitle>
						<DialogDescription>
							Upload a CSV or Excel file to import transactions.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="file" className="text-right">
								File
							</Label>
							<Input
								id="file"
								type="file"
								className="col-span-3"
								onChange={handleFileChange}
								accept=".csv,.xlsx,.xls"
							/>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="account" className="text-right">
								Account Name
							</Label>
							<Input
								id="account"
								value={accountName}
								onChange={(e) => setAccountName(e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="mapping" className="text-right">
								Mapping Name
							</Label>
							<Select onValueChange={setMappingOption}>
								<SelectTrigger className="w-full col-span-3 ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
									<SelectValue placeholder="Select a mapping option" />
								</SelectTrigger>
								<SelectContent>
									{mappingOptions.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label htmlFor="header" className="text-right">
								Includes Header
							</Label>
							<div className="col-span-3 flex items-center">
								<Checkbox
									id="header"
									checked={includesHeader}
									onCheckedChange={(checked) =>
										setIncludesHeader(checked as boolean)
									}
								/>
								<Label htmlFor="header" className="ml-2">
									First row contains column headers
								</Label>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={handleImport}>Upload</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isMappingModalOpen}
				onOpenChange={setIsMappingModalOpen}
			>
				<DialogContent className="w-11/12 max-w-11/12 lg:max-w-7xl max-h-11/12 sm:max-h-11/12 overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Map Columns</DialogTitle>
						<DialogDescription>
							Assign each column to the corresponding transaction
							field.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-2">
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label
								htmlFor="mapping-name"
								className="text-right"
							>
								Mapping Name
							</Label>
							<div className="col-span-3 space-y-1">
								<Input
									id="mapping-name"
									value={mappingName}
									onChange={handleMappingNameChange}
									placeholder="Enter a name for this mapping"
									className={cn(
										mappingNameError
											? "border-destructive"
											: ""
									)}
								/>
								{mappingNameError && (
									<p className="text-sm text-destructive">
										{mappingNameError}
									</p>
								)}
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label
								htmlFor="includes-header"
								className="text-right"
							>
								Includes Header
							</Label>
							<div className="col-span-3 flex items-center">
								<Checkbox
									id="includes-header"
									checked={includesHeader}
									onCheckedChange={(checked) =>
										setIncludesHeader(checked as boolean)
									}
								/>
								<Label
									htmlFor="includes-header"
									className="ml-2"
								>
									First row contains column headers
								</Label>
							</div>
						</div>
					</div>
					<div className="py-1 overflow-x-auto">
						{csvPreview.length > 0 && (
							<Table>
								<TableHeader>
									<TableRow>
										{csvPreview[0]?.map((_, index) => (
											<TableHead
												key={index}
												className="text-center min-w-[120px]"
											>
												Column {index + 1}
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{csvPreview
										.slice(0, includesHeader ? 1 : 0)
										.map((row, rowIndex) => (
											<TableRow
												key={rowIndex}
												className="bg-muted/50 font-medium"
											>
												{row.map((cell, cellIndex) => (
													<TableCell
														key={cellIndex}
														className="text-center min-w-[120px]"
													>
														{truncateText(cell)}
													</TableCell>
												))}
											</TableRow>
										))}
									{csvPreview
										.slice(includesHeader ? 1 : 0, 4)
										.map((row, rowIndex) => (
											<TableRow key={rowIndex}>
												{row.map((cell, cellIndex) => (
													<TableCell
														key={cellIndex}
														className="text-center min-w-[120px]"
													>
														{truncateText(cell)}
													</TableCell>
												))}
											</TableRow>
										))}
									<TableRow>
										{columnMapping.map(
											(currentValue, index) => (
												<TableCell
													key={index}
													className="p-2 min-w-[120px]"
												>
													<Select
														value={
															currentValue ||
															"none"
														}
														onValueChange={(
															value
														) =>
															handleColumnMappingChange(
																index,
																value
															)
														}
													>
														<SelectTrigger className="w-full ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
															<SelectValue placeholder="Select field" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="none">
																None
															</SelectItem>
															{getAvailableOptions(
																index
															).map((option) => (
																<SelectItem
																	key={option}
																	value={
																		option
																	}
																>
																	{option}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</TableCell>
											)
										)}
									</TableRow>
								</TableBody>
							</Table>
						)}
					</div>
					<DialogFooter>
						<Button
							onClick={handleMappingSubmit}
							disabled={!!mappingNameError || !mappingName.trim()}
						>
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
