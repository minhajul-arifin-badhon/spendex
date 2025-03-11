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
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { ArrowUpDown, Edit, Plus, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";

// Define types for our data
type ColumnMapping = {
	columnIndex: number;
	fieldName: string;
};

type Mapping = {
	id: string;
	name: string;
	includesHeader: boolean;
	columnMappings: ColumnMapping[];
};

// Available field options
const fieldOptions = [
	"Date",
	"Account Name",
	"Merchant",
	"Description",
	"Category",
	"Subcategory",
	"Amount",
];

// Sample initial data
const initialMappings: Mapping[] = [
	{
		id: "1",
		name: "Scotiabank",
		includesHeader: true,
		columnMappings: [
			{ columnIndex: 0, fieldName: "Date" },
			{ columnIndex: 1, fieldName: "Description" },
			{ columnIndex: 2, fieldName: "Merchant" },
			{ columnIndex: 3, fieldName: "Amount" },
		],
	},
	{
		id: "2",
		name: "TD bank",
		includesHeader: true,
		columnMappings: [
			{ columnIndex: 0, fieldName: "Date" },
			{ columnIndex: 1, fieldName: "Merchant" },
			{ columnIndex: 2, fieldName: "Amount" },
			{ columnIndex: 3, fieldName: "Category" },
		],
	},
	{
		id: "3",
		name: "CIBC",
		includesHeader: false,
		columnMappings: [
			{ columnIndex: 0, fieldName: "Date" },
			{ columnIndex: 1, fieldName: "Account Name" },
			{ columnIndex: 2, fieldName: "Merchant" },
			{ columnIndex: 3, fieldName: "Amount" },
			{ columnIndex: 4, fieldName: "Category" },
			{ columnIndex: 5, fieldName: "Subcategory" },
		],
	},

	{
		id: "4",
		name: "BMO",
		includesHeader: false,
		columnMappings: [
			{ columnIndex: 0, fieldName: "Date" },
			{ columnIndex: 1, fieldName: "Account Name" },
			{ columnIndex: 2, fieldName: "none" },
			{ columnIndex: 3, fieldName: "Merchant" },
			{ columnIndex: 4, fieldName: "Description" },
		],
	},
	{
		id: "5",
		name: "RBC",
		includesHeader: true,
		columnMappings: [
			{ columnIndex: 0, fieldName: "Date" },
			{ columnIndex: 1, fieldName: "Merchant" },
			{ columnIndex: 2, fieldName: "Amount" },
			{ columnIndex: 3, fieldName: "Category" },
		],
	},
];

export default function Page() {
	const [mappings, setMappings] = useState<Mapping[]>(initialMappings);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedMapping, setSelectedMapping] = useState<Mapping | null>(
		null
	);

	// Form states
	const [mappingName, setMappingName] = useState("");
	const [includesHeader, setIncludesHeader] = useState(false);
	const [columnCount, setColumnCount] = useState(4);
	const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
	const [mappingNameError, setMappingNameError] = useState<string | null>(
		null
	);

	// Reset form state
	const resetFormState = () => {
		setMappingName("");
		setIncludesHeader(false);
		setColumnCount(4);
		setColumnMappings([]);
		setMappingNameError(null);
	};

	// Open create modal
	const handleOpenCreateModal = () => {
		resetFormState();
		// Initialize column mappings based on default column count
		setColumnMappings(
			Array.from({ length: columnCount }, (_, i) => ({
				columnIndex: i,
				fieldName: "",
			}))
		);
		setIsCreateModalOpen(true);
	};

	// Open edit modal
	const handleOpenEditModal = (mapping: Mapping) => {
		setSelectedMapping(mapping);
		setMappingName(mapping.name);
		setIncludesHeader(mapping.includesHeader);

		// Find the highest column index to determine column count
		const maxColumnIndex = Math.max(
			...mapping.columnMappings.map((cm) => cm.columnIndex)
		);
		setColumnCount(maxColumnIndex + 1);

		// Initialize column mappings from the selected mapping
		const initializedMappings = Array.from(
			{ length: maxColumnIndex + 1 },
			(_, i) => {
				const existingMapping = mapping.columnMappings.find(
					(cm) => cm.columnIndex === i
				);
				return {
					columnIndex: i,
					fieldName: existingMapping ? existingMapping.fieldName : "",
				};
			}
		);

		setColumnMappings(initializedMappings);
		setIsEditModalOpen(true);
	};

	// Open delete confirmation dialog
	const handleOpenDeleteDialog = (mapping: Mapping) => {
		setSelectedMapping(mapping);
		setIsDeleteDialogOpen(true);
	};

	// Handle column count change
	const handleColumnCountChange = (value: string) => {
		const count = Number.parseInt(value, 10);
		setColumnCount(count);

		// Resize column mappings array
		if (count > columnMappings.length) {
			// Add new empty mappings
			setColumnMappings([
				...columnMappings,
				...Array.from(
					{ length: count - columnMappings.length },
					(_, i) => ({
						columnIndex: columnMappings.length + i,
						fieldName: "",
					})
				),
			]);
		} else if (count < columnMappings.length) {
			// Remove excess mappings
			setColumnMappings(columnMappings.slice(0, count));
		}
	};

	// Validate mapping name
	const validateMappingName = (name: string, currentId?: string) => {
		if (!name.trim()) {
			setMappingNameError("Mapping name is required");
			return false;
		}

		const isDuplicate = mappings.some(
			(mapping) =>
				mapping.name.toLowerCase() === name.trim().toLowerCase() &&
				mapping.id !== currentId
		);

		if (isDuplicate) {
			setMappingNameError("A mapping with this name already exists");
			return false;
		}

		setMappingNameError(null);
		return true;
	};

	// Handle mapping name change
	const handleMappingNameChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const newName = e.target.value;
		setMappingName(newName);
		validateMappingName(newName, selectedMapping?.id);
	};

	// Get available field options (excluding already used fields)
	const getAvailableFieldOptions = useCallback(
		(columnIndex: number) => {
			const usedFields = columnMappings
				.filter(
					(mapping) =>
						mapping.columnIndex !== columnIndex && mapping.fieldName
				)
				.map((mapping) => mapping.fieldName);

			return [
				"",
				...fieldOptions.filter((field) => !usedFields.includes(field)),
			];
		},
		[columnMappings]
	);

	// Handle field selection for a column
	const handleFieldChange = (columnIndex: number, fieldName: string) => {
		setColumnMappings((prev) =>
			prev.map((mapping) => {
				if (mapping.columnIndex === columnIndex) {
					return { ...mapping, fieldName };
				}
				return mapping;
			})
		);
	};

	// Create new mapping
	const handleCreateMapping = () => {
		if (!validateMappingName(mappingName)) {
			return;
		}

		const newMapping: Mapping = {
			id: Date.now().toString(),
			name: mappingName.trim(),
			includesHeader,
			columnMappings: columnMappings.filter((cm) => cm.fieldName !== ""),
		};

		setMappings([...mappings, newMapping]);
		setIsCreateModalOpen(false);
		resetFormState();
	};

	// Update existing mapping
	const handleUpdateMapping = () => {
		if (
			!selectedMapping ||
			!validateMappingName(mappingName, selectedMapping.id)
		) {
			return;
		}

		const updatedMapping: Mapping = {
			...selectedMapping,
			name: mappingName.trim(),
			includesHeader,
			columnMappings: columnMappings.filter((cm) => cm.fieldName !== ""),
		};

		setMappings(
			mappings.map((mapping) =>
				mapping.id === selectedMapping.id ? updatedMapping : mapping
			)
		);

		setIsEditModalOpen(false);
		resetFormState();
	};

	// Delete mapping
	const handleDeleteMapping = () => {
		if (!selectedMapping) return;

		setMappings(
			mappings.filter((mapping) => mapping.id !== selectedMapping.id)
		);
		setIsDeleteDialogOpen(false);
		setSelectedMapping(null);
	};

	// Format column mappings for display in the table
	const formatColumnMappings = (columnMappings: ColumnMapping[]) => {
		return columnMappings
			.sort((a, b) => a.columnIndex - b.columnIndex)
			.map((cm) => `Column ${cm.columnIndex + 1} → ${cm.fieldName}`)
			.join(", ");
	};

	// Table columns definition
	const columns = useMemo<ColumnDef<Mapping>[]>(
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
							Mapping Name
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					);
				},
			},
			{
				accessorKey: "columnMappings",
				header: "Column Mappings",
				cell: ({ row }) => (
					<div className="max-w-4xl truncate m-auto">
						{formatColumnMappings(row.original.columnMappings)}
					</div>
				),
			},
			{
				accessorKey: "includesHeader",
				header: "Includes Header",
				cell: ({ row }) => (
					<div>{row.original.includesHeader ? "Yes" : "No"}</div>
				),
			},
			{
				id: "actions",
				cell: ({ row }) => {
					return (
						<div className="flex space-x-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() =>
									handleOpenEditModal(row.original)
								}
							>
								<Edit className="h-4 w-4" />
								<span className="sr-only">Edit</span>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="text-destructive hover:text-destructive/90"
								onClick={() =>
									handleOpenDeleteDialog(row.original)
								}
							>
								<Trash2 className="h-4 w-4" />
								<span className="sr-only">Delete</span>
							</Button>
						</div>
					);
				},
			},
		],
		[]
	);

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<Button variant="outline" onClick={handleOpenCreateModal}>
					<Plus className="mr-2 h-4 w-4" /> Create New
				</Button>
			</div>

			<DataTable
				columns={columns}
				data={mappings}
				searchColumn="name"
				searchPlaceholder="Search mappings..."
			/>

			{/* Create Mapping Modal */}
			<Dialog
				open={isCreateModalOpen}
				onOpenChange={setIsCreateModalOpen}
			>
				<DialogContent className="w-11/12 max-w-7xl md:min-w-3xl max-h-11/12 overflow-auto">
					<DialogHeader>
						<DialogTitle>Create New Mapping</DialogTitle>
						<DialogDescription>
							Create a new column mapping for your data imports.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label
								htmlFor="mapping-name"
								className="text-right"
							>
								Mapping Name
							</Label>
							<div className="col-span-1 sm:col-span-3 space-y-1">
								<Input
									id="mapping-name"
									value={mappingName}
									onChange={handleMappingNameChange}
									placeholder="Enter a name for this mapping"
									className={cn(
										mappingNameError
											? "border-destructive"
											: "focus-visible:ring-0"
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
							<div className="col-span-1 sm:col-span-3 flex items-center">
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
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label
								htmlFor="column-count"
								className="text-right"
							>
								Number of Columns
							</Label>
							<Select
								value={columnCount.toString()}
								onValueChange={handleColumnCountChange}
							>
								<SelectTrigger className="w-full col-span-1 sm:col-span-3 ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
									<SelectValue placeholder="Select number of columns" />
								</SelectTrigger>
								<SelectContent>
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
										(num) => (
											<SelectItem
												key={num}
												value={num.toString()}
											>
												{num}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div>
						<div className="pt-0 sm:pt-4">
							<h3 className="font-medium mb-2">
								Column Mappings
							</h3>
							<div className="space-y-3">
								{columnMappings.map((mapping) => (
									<div
										key={mapping.columnIndex}
										className="grid grid-cols-4 items-center gap-4"
									>
										<Label className="sm:justify-end sm:pr-6">
											Column {mapping.columnIndex + 1}
										</Label>
										<Select
											value={mapping.fieldName}
											onValueChange={(value) =>
												handleFieldChange(
													mapping.columnIndex,
													value
												)
											}
										>
											<SelectTrigger className="w-full col-span-3 ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
												<SelectValue placeholder="Select field" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">
													None
												</SelectItem>
												{getAvailableFieldOptions(
													mapping.columnIndex
												)
													.filter(
														(option) =>
															option !== ""
													)
													.map((option) => (
														<SelectItem
															key={option}
															value={option}
														>
															{option}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
									</div>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCreateModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreateMapping}
							disabled={!!mappingNameError || !mappingName.trim()}
						>
							Create Mapping
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Mapping Modal */}
			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent className="w-11/12 max-w-7xl md:min-w-3xl max-h-11/12 overflow-auto">
					<DialogHeader>
						<DialogTitle>Edit Mapping</DialogTitle>
						<DialogDescription>
							Update the column mapping configuration.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label
								htmlFor="edit-mapping-name"
								className="text-right"
							>
								Mapping Name
							</Label>
							<div className="col-span-3 space-y-1">
								<Input
									id="edit-mapping-name"
									value={mappingName}
									onChange={handleMappingNameChange}
									placeholder="Enter a name for this mapping"
									className={cn(
										mappingNameError
											? "border-destructive"
											: "focus-visible:ring-0"
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
								htmlFor="edit-includes-header"
								className="text-right"
							>
								Includes Header
							</Label>
							<div className="col-span-3 flex items-center">
								<Checkbox
									id="edit-includes-header"
									checked={includesHeader}
									onCheckedChange={(checked) =>
										setIncludesHeader(checked as boolean)
									}
								/>
								<Label
									htmlFor="edit-includes-header"
									className="ml-2"
								>
									First row contains column headers
								</Label>
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
							<Label
								htmlFor="edit-column-count"
								className="text-right"
							>
								Number of Columns
							</Label>
							<Select
								value={columnCount.toString()}
								onValueChange={handleColumnCountChange}
							>
								<SelectTrigger className="w-full col-span-3 ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
									<SelectValue placeholder="Select number of columns" />
								</SelectTrigger>
								<SelectContent>
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
										(num) => (
											<SelectItem
												key={num}
												value={num.toString()}
											>
												{num}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div>
						<div className="pt-0 sm:pt-4">
							<h3 className="font-medium mb-2">
								Column Mappings
							</h3>
							<div className="space-y-3">
								{columnMappings.map((mapping) => (
									<div
										key={mapping.columnIndex}
										className="grid grid-cols-4 items-center gap-4"
									>
										<Label className="sm:justify-end sm:pr-6">
											Column {mapping.columnIndex + 1}
										</Label>
										<Select
											value={mapping.fieldName}
											onValueChange={(value) =>
												handleFieldChange(
													mapping.columnIndex,
													value
												)
											}
										>
											<SelectTrigger className="w-full col-span-3 ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
												<SelectValue placeholder="Select field" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">
													None
												</SelectItem>
												{getAvailableFieldOptions(
													mapping.columnIndex
												)
													.filter(
														(option) =>
															option !== ""
													)
													.map((option) => (
														<SelectItem
															key={option}
															value={option}
														>
															{option}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
									</div>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleUpdateMapping}
							disabled={!!mappingNameError || !mappingName.trim()}
						>
							Update Mapping
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							{`This will permanently delete the mapping - ${selectedMapping?.name}. This action cannot be
							undone.`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteMapping}
							className="bg-destructive text-white hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
