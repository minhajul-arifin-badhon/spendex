import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { CreateTransactionProps, DeleteTransactionProps, UpdateTransactionProps } from "@/app/types";
import {
	createTransaction,
	deleteTransaction,
	getTransactions,
	updateTransaction
} from "../actions/transactions.actions";

// ============================================================
// TRANSACTION QUERIES
// ============================================================

const invalidateTransactionsQueries = (queryClient: QueryClient) => {
	console.log("=------------invalidating transactions--------------------");
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS] });
};

export const useGetTransactions = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_TRANSACTIONS],
		queryFn: () => {
			console.log("query: calling transactions................");
			return getTransactions();
		}
	});
};

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: CreateTransactionProps) => createTransaction(props),
		onSettled: () => {
			invalidateTransactionsQueries(queryClient);
		}
	});
};

export const useUpdateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: UpdateTransactionProps) => updateTransaction(props),
		onSettled: () => {
			invalidateTransactionsQueries(queryClient);
		}
	});
};

export const useDeleteTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: DeleteTransactionProps) => deleteTransaction(props),
		onSettled: () => {
			invalidateTransactionsQueries(queryClient);
		}
	});
};
