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
import { Merchant } from "@prisma/client";
import {
	CategoriesWithSub,
	CategorySelection,
	CreateMerchantProps,
	MerchantFormProps,
	UpdateMerchantProps
} from "@/app/types";
import {
	useCreateMerchant,
	useDeleteMercant,
	useGetMerchants,
	useUpdateMerchant
} from "@/lib/react-query/merchant.queries";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import ListMerchants from "@/components/list-merchants";
import MerchantForm from "@/components/merchant-form";
import { useGetCategories } from "@/lib/react-query/categories.queries";

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
		setSelectedMerchant(merchant);

		console.log("editing---------");
		const formValues = merchantToFormValues(merchant);
		console.log(formValues);

		setFormValues(formValues);
		setIsEditing(true);
		setIsFormOpen(true);
	};

	// Open delete confirmation dialog
	const handleOpenDeleteDialog = (merchant: Merchant) => {
		setSelectedMerchant(merchant);
		setIsDeleteDialogOpen(true);
	};

	// Create new mapping
	const handleCreateMerchant = async (data: MerchantFormProps) => {
		console.log(data);

		const { categoryId, subcategoryId } = extractCategoryIds(data.categorySelection);

		const newMerchant: CreateMerchantProps = {
			name: data.name,
			categoryId,
			subcategoryId,
			includes: data.includes
		};

		try {
			const response = await createMerchantMutation.mutateAsync(newMerchant);
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
	const handleUpdateMerchant = async (data: MerchantFormProps) => {
		if (!selectedMerchant) return;

		console.log(data);

		const { categoryId, subcategoryId } = extractCategoryIds(data.categorySelection);

		const updatedMerchant: UpdateMerchantProps = {
			id: selectedMerchant.id,
			name: data.name,
			categoryId,
			subcategoryId,
			includes: data.includes
		};

		console.log(updatedMerchant);

		try {
			const response = await updateMerchantMutation.mutateAsync(updatedMerchant);
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
		setSelectedMerchant(null);
	};

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

	// Handle form submission based on whether we're editing or creating
	const handleFormSubmit = (data: MerchantFormProps) => {
		if (isEditing) {
			handleUpdateMerchant(data);
		} else {
			handleCreateMerchant(data);
		}

		// setFormValues(defaultFormValues);
		setIsFormOpen(false);
	};

	// Function to convert from merchant data to form values
	const merchantToFormValues = (merchant: Merchant): MerchantFormProps => {
		let categorySelection: CategorySelection | null = null;

		if (merchant.subcategoryId) {
			// If there's a subcategory, find it
			const category = categories.find((c) => c.id === merchant.categoryId);
			const subcategory = category?.subcategories.find((s) => s.id === merchant.subcategoryId);

			if (category && subcategory) {
				categorySelection = {
					type: "subcategory",
					id: subcategory.id,
					categoryId: category.id,
					name: `${category.name} / ${subcategory.name}`
				};
			}
		} else if (merchant.categoryId) {
			// If there's only a category, find it
			const category = categories.find((c) => c.id === merchant.categoryId);

			if (category) {
				categorySelection = {
					type: "category",
					id: category.id,
					name: category.name
				};
			}
		}

		return {
			name: merchant.name,
			includes: merchant.includes,
			categorySelection
		};
	};

	// Function to extract category and subcategory IDs from form values
	const extractCategoryIds = (
		selection: CategorySelection | null
	): { categoryId: number | null; subcategoryId: number | null } => {
		if (!selection) {
			return { categoryId: null, subcategoryId: null };
		}

		if (selection.type === "category") {
			return { categoryId: selection.id, subcategoryId: null };
		} else {
			return { categoryId: selection.categoryId || null, subcategoryId: selection.id };
		}
	};

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
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<MerchantForm
					key={isEditing ? selectedMerchant?.id : Date.now()}
					defaultValues={formValues}
					categories={categories}
					onSubmit={handleFormSubmit}
					onCancel={() => setIsFormOpen(false)}
					title={isEditing ? "Update Merchant" : "Add Merchant"}
					description={isEditing ? "Edit the information of an existing merchant." : "Create a new merchant."}
					submitButtonText={isEditing ? "Save" : "Save"}
					existingMerchants={merchantsResponse.data as Merchant[]}
					currentMerchantId={selectedMerchant?.id}
					isFormOpen={isFormOpen}
				/>
			</Dialog>

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
