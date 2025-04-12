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
import { Plus } from "lucide-react";
import { TransactionFormProps, UpdateTransactionProps } from "@/app/types";
import { toast } from "sonner";
import ListTransactions from "./list-transactions";
import TransactionForm from "./transaction-form";
import {
	useCreateTransaction,
	useDeleteTransaction,
	useUpdateTransaction
} from "@/lib/react-query/transactions.queries";
import { Transaction } from "@prisma/client";

const defaultFormValues: TransactionFormProps = {
	date: new Date(),
	accountName: "",
	amount: 0,
	category: "",
	subcategory: "",
	merchant: "",
	description: ""
};

export default function Transactions({ transactions }: { transactions: Transaction[] }) {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
	const [formValues, setFormValues] = useState<TransactionFormProps>(defaultFormValues);
	const [isEditing, setIsEditing] = useState(false);

	const createTransactionMutation = useCreateTransaction();
	const updateTransactionMutation = useUpdateTransaction();
	const deleteTransactionMutation = useDeleteTransaction();

	const handleOpenCreateForm = () => {
		setFormValues(defaultFormValues);
		setIsEditing(false);
		setIsFormOpen(true);
	};

	const handleOpenEditForm = (transaction: Transaction) => {
		setSelectedTransaction(transaction);

		console.log("editing---------");
		const formValues = transactionToFormValues(transaction);
		console.log(formValues);

		setFormValues(formValues);
		setIsEditing(true);
		setIsFormOpen(true);
	};

	const handleOpenDeleteDialog = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setIsDeleteDialogOpen(true);
	};

	const handleCreateTransaction = async (data: TransactionFormProps) => {
		try {
			const response = await createTransactionMutation.mutateAsync(data);
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

		const updatedTransaction: UpdateTransactionProps = {
			...data,
			id: selectedTransaction.id
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

	const handleFormSubmit = (data: TransactionFormProps) => {
		if (isEditing) {
			handleUpdateTransaction(data);
		} else {
			handleCreateTransaction(data);
		}

		setIsFormOpen(false);
		setSelectedTransaction(null);
	};

	const transactionToFormValues = (transaction: Transaction): TransactionFormProps => {
		return {
			date: new Date(transaction.date),
			accountName: transaction.accountName || "",
			amount: transaction.amount,
			category: transaction.category || "",
			subcategory: transaction.subcategory || "",
			merchant: transaction.merchant || "",
			description: transaction.description || ""
		};
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-end space-x-3">
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
		</div>
	);
}
