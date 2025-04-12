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
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Merchant } from "@prisma/client";
import {
	CategoriesWithSub,
	CategorySelection,
	CreateTransactionProps,
	TransactionFormProps,
	TransactionWithRelations,
	UpdateTransactionProps
} from "@/app/types";
import { useGetMerchants } from "@/lib/react-query/merchant.queries";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useGetCategories } from "@/lib/react-query/categories.queries";
import ListTransactions from "./list-transactions";
import TransactionForm from "./transaction-form";
import {
	useCreateManyTransactions,
	useCreateTransaction,
	useDeleteTransaction,
	// useGetTransactionsWithRelations,
	useUpdateTransaction
} from "@/lib/react-query/transactions.queries";
import { ImportTransactionsModal } from "./import-transactions-modal";

// Default form values
const defaultFormValues: TransactionFormProps = {
	accountName: "",
	amount: 0,
	categorySelection: null,
	date: new Date(),
	description: "",
	merchant: ""
};

export default function Transactions({ transactions }: { transactions: TransactionWithRelations[] }) {
	console.log("Transactions component re-rendering", transactions);
	const { data: merchantsResponse, isLoading: isLoadingMerchants, isError: isErrorMerchants } = useGetMerchants();
	const { data: categoriesResponse, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategories();
	// const {
	// 	data: transactionsResponse,
	// 	isLoading: isLoadingTransactions,
	// 	isError: isErrorTransactions
	// } = useGetTransactionsWithRelations();

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithRelations | null>(null);
	const [formValues, setFormValues] = useState<TransactionFormProps>(defaultFormValues);
	const [isEditing, setIsEditing] = useState(false);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);

	// const createMerchantMutation = useCreateMerchant();
	// const updateMerchantMutation = useUpdateMerchant();
	// const deleteMerchantMutation = useDeleteMercant();

	const createTransactionMutation = useCreateTransaction();
	const createManyTransactionsMutation = useCreateManyTransactions();
	const updateTransactionMutation = useUpdateTransaction();
	const deleteTransactionMutation = useDeleteTransaction();

	const handleOpenCreateForm = () => {
		setFormValues(defaultFormValues);
		setIsEditing(false);
		setIsFormOpen(true);
	};

	const handleOpenEditForm = (transaction: TransactionWithRelations) => {
		setSelectedTransaction(transaction);

		console.log("editing---------");
		const formValues = transactionToFormValues(transaction);
		console.log(formValues);

		setFormValues(formValues);
		setIsEditing(true);
		setIsFormOpen(true);
	};

	// // Open delete confirmation dialog
	const handleOpenDeleteDialog = (transaction: TransactionWithRelations) => {
		setSelectedTransaction(transaction);
		setIsDeleteDialogOpen(true);
	};

	const handleCreateTransaction = async (data: TransactionFormProps) => {
		const { categoryId, subcategoryId } = extractCategoryIds(data.categorySelection);
		console.log(categoryId, subcategoryId);

		const newTransaction: CreateTransactionProps = {
			accountName: data.accountName,
			amount: data.amount,
			categoryId: categoryId,
			date: data.date,
			description: data.description,
			merchant: data.merchant,
			subcategoryId: subcategoryId
		};

		console.log(newTransaction);

		try {
			const response = await createTransactionMutation.mutateAsync(newTransaction);
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

	const handleUpdateTransaction = async (data: TransactionFormProps) => {
		if (!selectedTransaction) return;

		console.log(data);
		const { categoryId, subcategoryId } = extractCategoryIds(data.categorySelection);

		const updatedTransaction: UpdateTransactionProps = {
			accountName: data.accountName,
			amount: data.amount,
			categoryId: categoryId,
			date: data.date,
			description: data.description,
			id: selectedTransaction.id,
			merchant: data.merchant,
			subcategoryId: subcategoryId
		};

		console.log(updatedTransaction);

		try {
			const response = await updateTransactionMutation.mutateAsync(updatedTransaction);
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

	const handleDeleteTransaction = async () => {
		if (!selectedTransaction) return;

		console.log(selectedTransaction);

		try {
			const response = await deleteTransactionMutation.mutateAsync({ id: selectedTransaction.id });
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
		setSelectedTransaction(null);
	};

	// Handle form submission based on whether we're editing or creating
	const handleFormSubmit = (data: TransactionFormProps) => {
		if (isEditing) {
			handleUpdateTransaction(data);
		} else {
			handleCreateTransaction(data);
		}

		setIsFormOpen(false);
		setSelectedTransaction(null);
	};

	// Function to convert from merchant data to form values
	const transactionToFormValues = (transaction: TransactionWithRelations): TransactionFormProps => {
		let categorySelection: CategorySelection | null = null;

		if (transaction.subcategory) {
			categorySelection = {
				type: "subcategory",
				id: transaction.subcategory?.id as number,
				categoryId: transaction.category?.id as number,
				name: `${transaction.category?.name} / ${transaction.subcategory.name}`
			};
		} else if (transaction.category) {
			categorySelection = {
				type: "category",
				id: transaction.category.id,
				name: transaction.category.name
			};
		}

		return {
			date: new Date(transaction.date),
			amount: transaction.amount,
			merchant: transaction.merchant?.name || "",
			description: transaction.description || "",
			accountName: transaction.accountName || "",
			categorySelection: categorySelection
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

	// Handle import transactions
	const handleImportTransactions = async (importedTransactions: CreateTransactionProps[]) => {
		console.log(importedTransactions);

		try {
			const response = await createManyTransactionsMutation.mutateAsync(importedTransactions);
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

		setIsImportModalOpen(false);
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
	// const transactions = (transactionsResponse.data as TransactionWithRelations[]) || [];

	// console.log(transactions);

	return (
		<>
			<div className="flex justify-end space-x-3">
				<Button variant="outline" className="cursor-pointer" onClick={() => setIsImportModalOpen(true)}>
					<Upload className="mr-2 h-4 w-4" /> Import
				</Button>

				<Button variant="outline" onClick={handleOpenCreateForm}>
					<Plus className="mr-2 h-4 w-4" /> Create New
				</Button>
			</div>

			<ListTransactions
				transactions={transactions}
				onEdit={handleOpenEditForm}
				onDelete={handleOpenDeleteDialog}
			/>

			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<TransactionForm
					key={isEditing ? selectedTransaction?.id : Date.now()}
					defaultValues={formValues}
					categories={categories}
					merchants={merchants}
					onSubmit={handleFormSubmit}
					onCancel={() => setIsFormOpen(false)}
					title={isEditing ? "Update Transaction" : "Add Transaction"}
					description={
						isEditing ? "Edit the information of an existing transaction." : "Create a new transaction."
					}
					submitButtonText={isEditing ? "Save" : "Save"}
					// existingMerchants={merchantsResponse.data as Merchant[]}
					// currentTransactionId={selectedTransaction?.id}
					isFormOpen={isFormOpen}
				/>
			</Dialog>

			<ImportTransactionsModal
				open={isImportModalOpen}
				onOpenChange={setIsImportModalOpen}
				onImport={handleImportTransactions}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the transaction. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteTransaction}
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
