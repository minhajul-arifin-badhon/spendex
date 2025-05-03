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
	useUpdateTransaction
} from "@/lib/react-query/transactions.queries";
import { ImportTransactionsModal } from "./import-transactions-modal";
import { cn } from "@/lib/utils";

const defaultFormValues: TransactionFormProps = {
	accountName: "",
	amount: 0,
	categorySelection: null,
	date: new Date(),
	description: "",
	merchant: ""
};

const cashFlowTypes = [
	{
		label: "All",
		value: "all"
	},
	{
		label: "Money In",
		value: "moneyIn"
	},
	{
		label: "Money Out",
		value: "moneyOut"
	}
];

export default function Transactions({ transactions }: { transactions: TransactionWithRelations[] }) {
	const { data: merchantsResponse, isLoading: isLoadingMerchants, isError: isErrorMerchants } = useGetMerchants();
	const { data: categoriesResponse, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategories();

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithRelations | null>(null);
	const [formValues, setFormValues] = useState<TransactionFormProps>(defaultFormValues);
	const [isEditing, setIsEditing] = useState(false);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [cashFlowType, setCashFlowType] = useState("all");

	const createTransactionMutation = useCreateTransaction();
	const createManyTransactionsMutation = useCreateManyTransactions();
	const updateTransactionMutation = useUpdateTransaction();
	const deleteTransactionMutation = useDeleteTransaction();

	if (cashFlowType != "all") {
		transactions = transactions.filter(
			(t) => (cashFlowType == "moneyIn" && t.amount > 0) || (cashFlowType == "moneyOut" && t.amount <= 0)
		);
	}

	const handleOpenCreateForm = () => {
		setFormValues(defaultFormValues);
		setIsEditing(false);
		setIsFormOpen(true);
	};

	const handleOpenEditForm = (transaction: TransactionWithRelations) => {
		setSelectedTransaction(transaction);

		const formValues = transactionToFormValues(transaction);

		setFormValues(formValues);
		setIsEditing(true);
		setIsFormOpen(true);
	};

	const handleOpenDeleteDialog = (transaction: TransactionWithRelations) => {
		setSelectedTransaction(transaction);
		setIsDeleteDialogOpen(true);
	};

	const handleCreateTransaction = async (data: TransactionFormProps) => {
		const { categoryId, subcategoryId } = extractCategoryIds(data.categorySelection);

		const newTransaction: CreateTransactionProps = {
			accountName: data.accountName,
			amount: data.amount,
			categoryId: categoryId,
			date: data.date,
			description: data.description,
			merchant: data.merchant,
			subcategoryId: subcategoryId
		};

		try {
			const response = await createTransactionMutation.mutateAsync(newTransaction);

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

		try {
			const response = await updateTransactionMutation.mutateAsync(updatedTransaction);

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

		try {
			const response = await deleteTransactionMutation.mutateAsync({ id: selectedTransaction.id });

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

	const handleFormSubmit = (data: TransactionFormProps) => {
		if (isEditing) {
			handleUpdateTransaction(data);
		} else {
			handleCreateTransaction(data);
		}

		setIsFormOpen(false);
		setSelectedTransaction(null);
	};

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

	return (
		<>
			<div className="flex items-end sm:items-center flex-col-reverse sm:flex-row sm:justify-between space-y-reverse space-y-3 sm:space-y-0">
				<div className="space-x-3">
					{cashFlowTypes.map((option) => (
						<Button
							key={option.value}
							onClick={() => setCashFlowType(option.value)}
							variant="outline"
							className={cn(
								"border transition-colors focus-visible:outline-none duration-200 ease-in rounded-md bg-card hover:dark:bg-white hover:dark:text-gray-900 hover:bg-gray-900 hover:text-white",
								cashFlowType === option.value &&
									"dark:bg-white dark:text-gray-900 bg-gray-900 text-white"
							)}
						>
							{option.label}
						</Button>
					))}
				</div>

				<div className="space-x-3">
					<Button variant="outline" className="cursor-pointer" onClick={() => setIsImportModalOpen(true)}>
						<Upload className="mr-2 h-4 w-4" /> Import
					</Button>

					<Button variant="outline" onClick={handleOpenCreateForm}>
						<Plus className="mr-2 h-4 w-4" /> Create New
					</Button>
				</div>
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
					isFormOpen={isFormOpen}
				/>
			</Dialog>

			<ImportTransactionsModal
				open={isImportModalOpen}
				onOpenChange={setIsImportModalOpen}
				onImport={handleImportTransactions}
			/>

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
