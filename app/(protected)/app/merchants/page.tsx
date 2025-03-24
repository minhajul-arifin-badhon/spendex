"use client";

import { useId, useState } from "react";
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
import { Merchant } from "@prisma/client";
import { CategoriesWithSub, MerchantFormProps } from "@/app/types";
import {
	useCreateMerchant,
	useDeleteMercant,
	useGetCategories,
	useGetMerchants,
	useUpdateMerchant
} from "@/lib/react-query/queries";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import ListMerchants from "@/components/list-merchants";

// Default form values
const defaultFormValues: MerchantFormProps = {
	name: "",
	includes: [],
	categorySelection: null
};

export default function Page() {
	const { data: merchantsResponse, isLoading: isLoadingMerchants, isError: isErrorMerchants } = useGetMerchants();
	const { data: categoriesResponse, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategories();

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
	const [formValues, setFormValues] = useState<MerchantFormProps>(defaultFormValues);
	const [isEditing, setIsEditing] = useState(false);

	const createMerchantMutation = useCreateMerchant();
	const updateMerchantMutation = useUpdateMerchant();
	const deleteMerchantMutation = useDeleteMercant();

	// Open form for creating a new mapping
	const handleOpenCreateForm = () => {
		setFormValues(defaultFormValues);
		setIsEditing(false);
		setIsFormOpen(true);
	};

	// Open form for editing an existing mapping
	const handleOpenEditForm = (merchant: Merchant) => {
		// setSelectedMapping(mapping);

		// const columnFieldMapping = mapping.columnFieldMapping as ColumnFieldMappingProps[];

		// console.log("editing---------");
		console.log(merchant);

		// // Set form values with existing mapping data
		// setFormValues({
		// 	mappingName: mapping.mappingName,
		// 	accountName: mapping.accountName,
		// 	includesHeader: mapping.includesHeader,
		// 	columnCount: columnFieldMapping.length,
		// 	columnFieldMapping: columnFieldMapping
		// });

		// setIsEditing(true);
		// setIsFormOpen(true);
	};

	// Open delete confirmation dialog
	const handleOpenDeleteDialog = (merchant: Merchant) => {
		setSelectedMerchant(merchant);
		setIsDeleteDialogOpen(true);
	};

	// // Create new mapping
	// const handleCreateMapping = async (data: MappingFormProps) => {
	// 	console.log(data.columnFieldMapping);

	// 	const newMapping: CreateMappingProps = {
	// 		mappingName: data.mappingName.trim(),
	// 		accountName: data.accountName.trim(),
	// 		includesHeader: data.includesHeader,
	// 		columnFieldMapping: data.columnFieldMapping
	// 	};

	// 	console.log(newMapping);

	// 	try {
	// 		const response = await createMappingMutation.mutateAsync(newMapping);
	// 		console.log(response);

	// 		if (!response?.success) {
	// 			toast.error(response?.data);
	// 		} else {
	// 			toast.success(response?.data);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 		toast.error("Something went wrong!");
	// 	}
	// };

	// // Update existing mapping
	// const handleUpdateMapping = async (data: MappingFormProps) => {
	// 	if (!selectedMapping) return;

	// 	console.log(data);
	// 	const updatedMapping: UpdateMappingProps = {
	// 		id: selectedMapping.id,
	// 		mappingName: data.mappingName.trim(),
	// 		accountName: data.accountName.trim(),
	// 		includesHeader: data.includesHeader,
	// 		columnFieldMapping: data.columnFieldMapping
	// 	};

	// 	console.log(updatedMapping);

	// 	try {
	// 		const response = await updateMappingMutation.mutateAsync(updatedMapping);
	// 		console.log(response);

	// 		if (!response?.success) {
	// 			toast.error(response?.data);
	// 		} else {
	// 			toast.success(response?.data);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 		toast.error("Something went wrong!");
	// 	}

	// 	setIsFormOpen(false);
	// 	setSelectedMapping(null);
	// };

	// Delete mapping
	const handleDeleteMerchant = async () => {
		if (!selectedMerchant) return;

		console.log(selectedMerchant);

		try {
			const response = await deleteMerchantMutation.mutateAsync({ id: selectedMerchant.id });
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
		setSelectedMerchant(null);
	};

	// // Handle form submission based on whether we're editing or creating
	// const handleFormSubmit = (data: MappingFormProps) => {
	// 	if (isEditing) {
	// 		handleUpdateMapping(data);
	// 	} else {
	// 		handleCreateMapping(data);
	// 	}

	// 	// setFormValues(defaultFormValues);
	// 	setIsFormOpen(false);
	// };

	if (isErrorCategories || isErrorMerchants)
		return (
			<div>
				<p>Something bad happened</p>
			</div>
		);

	if (isLoadingMerchants || isLoadingCategories)
		return (
			<div className="size-full -mt-20 min-h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);

	if (!merchantsResponse?.success) {
		return (
			<div>
				<p>{`${merchantsResponse?.statusCode}: ${merchantsResponse?.data}:`}</p>
			</div>
		);
	}

	if (!categoriesResponse?.success) {
		return (
			<div>
				<p>{`${categoriesResponse?.statusCode}: ${categoriesResponse?.data}:`}</p>
			</div>
		);
	}

	const merchants = (merchantsResponse.data as Merchant[]) || [];
	const categories = (categoriesResponse.data as CategoriesWithSub[]) || [];

	return (
		<div className="space-y-4">
			<div className="flex justify-end space-x-3">
				<Button variant="outline" onClick={handleOpenCreateForm}>
					<Plus className="mr-2 h-4 w-4" /> Create New
				</Button>
			</div>

			<ListMerchants
				merchants={merchants}
				categories={categories}
				onEdit={handleOpenEditForm}
				onDelete={handleOpenDeleteDialog}
			/>

			{/* Mapping Form Dialog */}
			{/* <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
			</Dialog> */}

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the mapping {selectedMerchant?.name}. This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteMerchant}
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
