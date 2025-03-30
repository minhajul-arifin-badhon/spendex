"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
// import MappingsList from "./components/mappings-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Mapping } from "@prisma/client";
import { ColumnFieldMappingProps, CreateMappingProps, MappingFormProps, UpdateMappingProps } from "@/app/types";
import MappingForm from "@/components/mapping-form";
import {
	useCreateMapping,
	useDeleteMapping,
	useGetMappings,
	useUpdateMapping
} from "@/lib/react-query/mappings.queries";
import { Spinner } from "@/components/ui/spinner";
import ListMappings from "@/components/list-mappings";
import { toast } from "sonner";

// Default form values
const defaultFormValues: MappingFormProps = {
	mappingName: "",
	accountName: "",
	includesHeader: false,
	columnCount: 4,
	columnFieldMapping: Array.from({ length: 4 }, (_, i) => ({
		columnIndex: i,
		fieldName: ""
	}))
};

export default function Page() {
	const { data: mappingsResponse, isLoading: isLoading, isError: isError } = useGetMappings();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedMapping, setSelectedMapping] = useState<Mapping | null>(null);
	const [formValues, setFormValues] = useState<MappingFormProps>(defaultFormValues);
	const [isEditing, setIsEditing] = useState(false);

	const createMappingMutation = useCreateMapping();
	const updateMappingMutation = useUpdateMapping();
	const deleteMappingMutation = useDeleteMapping();

	// Open form for creating a new mapping
	const handleOpenCreateForm = () => {
		setFormValues(defaultFormValues);
		setIsEditing(false);
		setIsFormOpen(true);
	};

	// Open form for editing an existing mapping
	const handleOpenEditForm = (mapping: Mapping) => {
		setSelectedMapping(mapping);

		const columnFieldMapping = mapping.columnFieldMapping as ColumnFieldMappingProps[];

		console.log("editing---------");
		console.log(mapping);

		// Set form values with existing mapping data
		setFormValues({
			mappingName: mapping.mappingName,
			accountName: mapping.accountName,
			includesHeader: mapping.includesHeader,
			columnCount: columnFieldMapping.length,
			columnFieldMapping: columnFieldMapping
		});

		setIsEditing(true);
		setIsFormOpen(true);
	};

	// Open delete confirmation dialog
	const handleOpenDeleteDialog = (mapping: Mapping) => {
		setSelectedMapping(mapping);
		setIsDeleteDialogOpen(true);
	};

	// Create new mapping
	const handleCreateMapping = async (data: MappingFormProps) => {
		console.log(data.columnFieldMapping);

		const newMapping: CreateMappingProps = {
			mappingName: data.mappingName.trim(),
			accountName: data.accountName.trim(),
			includesHeader: data.includesHeader,
			columnFieldMapping: data.columnFieldMapping
		};

		console.log(newMapping);

		try {
			const response = await createMappingMutation.mutateAsync(newMapping);
			console.log(response);

			if (!response?.success) {
				toast.error(response?.data);
			} else {
				toast.success(response?.data);
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong!");
		}
	};

	// Update existing mapping
	const handleUpdateMapping = async (data: MappingFormProps) => {
		if (!selectedMapping) return;

		console.log(data);
		const updatedMapping: UpdateMappingProps = {
			id: selectedMapping.id,
			mappingName: data.mappingName.trim(),
			accountName: data.accountName.trim(),
			includesHeader: data.includesHeader,
			columnFieldMapping: data.columnFieldMapping
		};

		console.log(updatedMapping);

		try {
			const response = await updateMappingMutation.mutateAsync(updatedMapping);
			console.log(response);

			if (!response?.success) {
				toast.error(response?.data);
			} else {
				toast.success(response?.data);
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong!");
		}

		setIsFormOpen(false);
		setSelectedMapping(null);
	};

	// Delete mapping
	const handleDeleteMapping = async () => {
		if (!selectedMapping) return;

		console.log(selectedMapping);

		try {
			const response = await deleteMappingMutation.mutateAsync({ id: selectedMapping.id });
			console.log(response);

			if (!response?.success) {
				toast.error(response?.data);
			} else {
				toast.success(response?.data);
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong!");
		}

		setIsDeleteDialogOpen(false);
		setSelectedMapping(null);
	};

	// Handle form submission based on whether we're editing or creating
	const handleFormSubmit = (data: MappingFormProps) => {
		if (isEditing) {
			handleUpdateMapping(data);
		} else {
			handleCreateMapping(data);
		}

		// setFormValues(defaultFormValues);
		setIsFormOpen(false);
	};

	if (isError)
		return (
			<div>
				<p>Something bad happened</p>
			</div>
		);

	if (isLoading)
		return (
			<div className="size-full -mt-20 min-h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);

	if (!mappingsResponse?.success) {
		return (
			<div>
				<p>{`${mappingsResponse?.statusCode}: ${mappingsResponse?.data}:`}</p>
			</div>
		);
	}

	const mappings = (mappingsResponse.data as Mapping[]) || [];

	return (
		<div className="space-y-4">
			<div className="flex justify-end space-x-3">
				<Button variant="outline" onClick={handleOpenCreateForm}>
					<Plus className="mr-2 h-4 w-4" /> Create New
				</Button>
			</div>

			<ListMappings mappings={mappings} onEdit={handleOpenEditForm} onDelete={handleOpenDeleteDialog} />

			{/* Mapping Form Dialog */}
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<MappingForm
					key={isEditing ? selectedMapping?.id : Date.now()}
					defaultValues={formValues}
					onSubmit={handleFormSubmit}
					onCancel={() => setIsFormOpen(false)}
					title={isEditing ? "Edit Mapping" : "Create New Mapping"}
					description={
						isEditing
							? "Update the column mapping configuration."
							: "Create a new column mapping for your data imports."
					}
					submitButtonText={isEditing ? "Update Mapping" : "Create Mapping"}
					existingMappings={mappingsResponse.data as Mapping[]}
					currentMappingId={selectedMapping?.id}
					isFormOpen={isFormOpen}
				/>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the mapping {selectedMapping?.mappingName}. This action cannot
							be undone.
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
