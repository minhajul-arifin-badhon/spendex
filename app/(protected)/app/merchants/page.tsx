"use client";

import { useCallback, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Merchant } from "@prisma/client";
import {
	CategoriesWithSub,
	CategorySelection,
	CreateMerchantProps,
	MerchantFormProps,
	TransactionWithRelations,
	UnassignedDescription,
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
import ListMerchants from "@/components/merchants/list-merchants";
import MerchantForm from "@/components/merchants/merchant-form";
import { useGetCategories } from "@/lib/react-query/categories.queries";
import { useGetTransactionsWithRelations } from "@/lib/react-query/transactions.queries";
import ListUnassignedTransactions from "@/components/list-unassigned-transactions";
import MerchantRuleForm from "@/components/merchants/merchant-rule-form";

const defaultFormValues: MerchantFormProps = {
	name: "",
	includes: [],
	categorySelection: null
};

function getUnassignedDescriptions(
	transactions: TransactionWithRelations[],
	merchants: Merchant[]
): UnassignedDescription[] {
	const frequencies: Record<string, number> = {};
	const descriptionSet = new Set<string>();

	transactions.forEach((item) => {
		const desc = item.description?.trim().toLowerCase();
		if (desc) {
			frequencies[desc] = (frequencies[desc] || 0) + 1;
			descriptionSet.add(desc);
		}
	});

	console.log("Unique descriptions:", descriptionSet.size);

	const uniqueUnassignedDescriptions: UnassignedDescription[] = [...descriptionSet]
		.filter((desc) => !merchants.some((m) => m.includes.some((substr) => desc.includes(substr.toLowerCase()))))
		.map((desc) => ({
			description: desc,
			count: frequencies[desc]
		}))
		.sort((a, b) => b.count - a.count);

	return uniqueUnassignedDescriptions;
}

export default function Page() {
	const { data: merchantsResponse, isLoading: isLoadingMerchants, isError: isErrorMerchants } = useGetMerchants();
	const { data: categoriesResponse, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategories();
	const {
		data: transactionsResponse,
		isLoading: isLoadingTransactions,
		isError: isErrorTransactions
	} = useGetTransactionsWithRelations();

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
	const [selectedDescription, setSelectedDescription] = useState<UnassignedDescription>({
		description: "",
		count: 0
	});

	const [formValues, setFormValues] = useState<MerchantFormProps>(defaultFormValues);
	const [isEditing, setIsEditing] = useState(false);

	const merchants = (merchantsResponse?.data as Merchant[]) || [];
	const transactions = (transactionsResponse?.data as TransactionWithRelations[]) || [];
	const uniqueUnassignedDescriptions = getUnassignedDescriptions(transactions, merchants);

	const categories = useMemo(() => {
		return (categoriesResponse?.data as CategoriesWithSub[]) || [];
	}, [categoriesResponse]);

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

		const formValues = merchantToFormValues(merchant);

		setFormValues(formValues);
		setIsEditing(true);
		setIsFormOpen(true);
	};

	const handleOpenRuleForm = (description: UnassignedDescription) => {
		setSelectedDescription(description);
		setIsRuleFormOpen(true);
	};

	const handleOpenDeleteDialog = (merchant: Merchant) => {
		setSelectedMerchant(merchant);
		setIsDeleteDialogOpen(true);
	};

	const handleCreateMerchant = async (data: MerchantFormProps) => {
		const { categoryId, subcategoryId } = extractCategoryIds(data.categorySelection);

		const newMerchant: CreateMerchantProps = {
			name: data.name,
			categoryId,
			subcategoryId,
			includes: data.includes
		};

		try {
			const response = await createMerchantMutation.mutateAsync(newMerchant);

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

	const handleUpdateMerchant = async (data: MerchantFormProps, merchantId: number) => {
		const { categoryId, subcategoryId } = extractCategoryIds(data.categorySelection);

		const updatedMerchant: UpdateMerchantProps = {
			id: merchantId,
			name: data.name,
			categoryId,
			subcategoryId,
			includes: data.includes
		};

		try {
			const response = await updateMerchantMutation.mutateAsync(updatedMerchant);

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

	const handleDeleteMerchant = async () => {
		if (!selectedMerchant) return;

		try {
			const response = await deleteMerchantMutation.mutateAsync({ id: selectedMerchant.id });

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

	const handleFormSubmit = (data: MerchantFormProps) => {
		if (isEditing) {
			if (!selectedMerchant) toast.error("Something went wrong. No merchant is selected to update.");
			else handleUpdateMerchant(data, selectedMerchant.id);
		} else {
			handleCreateMerchant(data);
		}

		setIsFormOpen(false);
		setSelectedMerchant(null);
	};

	const handleRuleFormSubmit = (data: MerchantFormProps) => {
		const merchant = merchants.find((m) => m.name == data.name);

		if (merchant) {
			handleUpdateMerchant(data, merchant.id);
		} else {
			handleCreateMerchant(data);
		}

		setIsRuleFormOpen(false);
	};

	const merchantToFormValues = useCallback(
		(merchant: Merchant): MerchantFormProps => {
			let categorySelection: CategorySelection | null = null;

			if (merchant.subcategoryId) {
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
		},
		[categories]
	);

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

	if (isErrorCategories || isErrorMerchants || isErrorTransactions)
		return (
			<div>
				<p>Something bad happened</p>
			</div>
		);

	if (isLoadingMerchants || isLoadingCategories || isLoadingTransactions)
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

	if (!transactionsResponse?.success) {
		return (
			<div>
				<p>{`${transactionsResponse?.statusCode}: ${transactionsResponse?.data}:`}</p>
			</div>
		);
	}

	return (
		<>
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

			<ListUnassignedTransactions
				unassignedDescriptions={uniqueUnassignedDescriptions}
				onCreate={handleOpenRuleForm}
			></ListUnassignedTransactions>

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

			<Dialog open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
				<MerchantRuleForm
					key={Date.now()}
					unassignedDescription={selectedDescription}
					merchants={merchants}
					categories={categories}
					onSubmit={handleRuleFormSubmit}
					onCancel={() => setIsRuleFormOpen(false)}
					isFormOpen={isFormOpen}
					merchantToFormValues={merchantToFormValues}
				/>
			</Dialog>

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
		</>
	);
}
