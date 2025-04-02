import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { CreateTransactionProps, DeleteTransactionProps, SuccessResponse, UpdateTransactionProps } from "@/app/types";
import { Merchant, Transaction } from "@prisma/client";
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
	console.log("=------------invalidating grouped categories--------------------");
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
		onMutate: async (props: CreateTransactionProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS] });
			const previousTransactions = queryClient.getQueryData([QUERY_KEYS.GET_TRANSACTIONS]);

			queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS], (old: SuccessResponse<Transaction[]>) => {
				return {
					...old,
					["data"]: [
						{
							...props,
							id: Date.now()
							// merchantId: 0
						},
						...old.data
					]
				};
			});

			// queryClient.setQueryData([QUERY_KEYS.GET_MERCHANTS], (old: SuccessResponse<Merchant[]>) => {
			// 	return {
			// 		...old,
			// 		["data"]: [
			// 			{
			// 				id: 0,
			//                 name: props.merchant
			// 				merchantId: 0
			// 			},
			// 			...old.data
			// 		]
			// 	};
			// });

			return { previousTransactions };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS], context?.previousTransactions);
			invalidateTransactionsQueries(queryClient);
		}
	});
};

export const useUpdateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: UpdateTransactionProps) => updateTransaction(props),
		onMutate: async (props: UpdateTransactionProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS] });

			const previousTransactions = queryClient.getQueryData([QUERY_KEYS.GET_TRANSACTIONS]);
			console.log("optimistic update");
			queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS], (old: SuccessResponse<Transaction[]>) => {
				const filtered = old.data.filter((transaction) => transaction.id != props.id);

				return {
					...old,
					["data"]: [props, ...filtered]
				};
			});

			return { previousTransactions };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS], context?.previousTransactions);
			invalidateTransactionsQueries(queryClient);
		}
	});
};

export const useDeleteTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: DeleteTransactionProps) => deleteTransaction(props),
		onMutate: async (props: DeleteTransactionProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS] });
			const previousTransactions = queryClient.getQueryData([QUERY_KEYS.GET_TRANSACTIONS]);

			queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS], (old: SuccessResponse<Transaction[]>) => {
				return { ...old, ["data"]: old.data.filter((transaction) => transaction.id !== props.id) };
			});

			return { previousTransactions };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS], context?.previousTransactions);
			invalidateTransactionsQueries(queryClient);
		}
	});
};
