import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import {
	CreateTransactionProps,
	DeleteAllTransactionsProps,
	DeleteTransactionProps,
	SuccessResponse,
	TransactionWithRelations,
	UpdateTransactionProps
} from "@/app/types";
import {
	createManyTransactions,
	createTransaction,
	deleteAllTransactions,
	deleteTransaction,
	getTransactionsWithRelations,
	updateTransaction
} from "../actions/transactions.actions";

const invalidateTransactionsQueries = (queryClient: QueryClient) => {
	console.log("=------------invalidating transactions--------------------");
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS] });
};

export const useGetTransactionsWithRelations = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS],
		queryFn: () => {
			console.log("query: calling transactions................");
			return getTransactionsWithRelations();
		}
	});
};

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: CreateTransactionProps) => createTransaction(props),
		onMutate: async (props: CreateTransactionProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS] });
			const previousTransactions = queryClient.getQueryData([QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS]);

			queryClient.setQueryData(
				[QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS],
				(old: SuccessResponse<TransactionWithRelations[]>) => {
					return {
						...old,
						["data"]: [
							{
								...props,
								id: Date.now()
								// merchantId: props.merchant ? 0 : null,
								// merchant: props.merchant
								// 	? {
								// 			id: 0,
								// 			name: props.merchant
								// 	  }
								// 	: null,
								// category: props.categoryId
								// 	? {
								// 			id: 0,
								// 			name: "Category",
								// 			group: "expense"
								// 	  }
								// 	: null,
								// subcategory: props.subcategoryId
								// 	? {
								// 			id: 0,
								// 			name: "Subcategory"
								// 	  }
								// 	: null,
								// createdAt: new Date(),
								// updatedAt: new Date(),
								// userId: "user0"
							},
							...old.data
						]
					};
				}
			);

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
				queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS], context?.previousTransactions);
			invalidateTransactionsQueries(queryClient);
		}
	});
};

export const useCreateManyTransactions = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: CreateTransactionProps[]) => createManyTransactions(props),
		// onMutate: async (props: CreateTransactionProps[]) => {
		// 	await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS] });
		// 	const previousTransactions = queryClient.getQueryData([QUERY_KEYS.GET_TRANSACTIONS]);

		// 	queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS], (old: SuccessResponse<Transaction[]>) => {
		// 		return {
		// 			...old,
		// 			["data"]: [
		// 				{
		// 					...props,
		// 					id: Date.now()
		// 					// merchantId: 0
		// 				},
		// 				...old.data
		// 			]
		// 		};
		// 	});

		// 	// queryClient.setQueryData([QUERY_KEYS.GET_MERCHANTS], (old: SuccessResponse<Merchant[]>) => {
		// 	// 	return {
		// 	// 		...old,
		// 	// 		["data"]: [
		// 	// 			{
		// 	// 				id: 0,
		// 	//                 name: props.merchant
		// 	// 				merchantId: 0
		// 	// 			},
		// 	// 			...old.data
		// 	// 		]
		// 	// 	};
		// 	// });

		// 	return { previousTransactions };
		// },
		onSettled: (data, error, variables, context) => {
			// if (!data?.success || error)
			// 	queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS], context?.previousTransactions);
			invalidateTransactionsQueries(queryClient);
		}
	});
};

export const useUpdateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: UpdateTransactionProps) => updateTransaction(props),
		onMutate: async (props: UpdateTransactionProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS] });

			const previousTransactions = queryClient.getQueryData([QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS]);
			console.log("optimistic update");
			queryClient.setQueryData(
				[QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS],
				(old: SuccessResponse<TransactionWithRelations[]>) => {
					const filtered = old.data.filter((transaction) => transaction.id != props.id);

					return {
						...old,
						["data"]: [props, ...filtered]
					};
				}
			);

			return { previousTransactions };
		},
		onSettled: (data, error, variables, context) => {
			console.log("Trying to settle.....");
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS], context?.previousTransactions);
			invalidateTransactionsQueries(queryClient);
		}
	});
};

export const useDeleteTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: DeleteTransactionProps) => deleteTransaction(props),
		onMutate: async (props: DeleteTransactionProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS] });
			const previousTransactions = queryClient.getQueryData([QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS]);

			queryClient.setQueryData(
				[QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS],
				(old: SuccessResponse<TransactionWithRelations[]>) => {
					return { ...old, ["data"]: old.data.filter((transaction) => transaction.id !== props.id) };
				}
			);

			return { previousTransactions };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS], context?.previousTransactions);
			invalidateTransactionsQueries(queryClient);
		}
	});
};

export const useDeleteAllTransactions = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: DeleteAllTransactionsProps) => deleteAllTransactions(props),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS] });
			const previousTransactions = queryClient.getQueryData([QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS]);

			queryClient.setQueryData(
				[QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS],
				(old: SuccessResponse<TransactionWithRelations[]>) => {
					return { ...old, ["data"]: [] as TransactionWithRelations[] };
				}
			);

			return { previousTransactions };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS], context?.previousTransactions);
			invalidateTransactionsQueries(queryClient);
		}
	});
};
