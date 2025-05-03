import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { CreateMerchantProps, DeleteMerchantProps, SuccessResponse, UpdateMerchantProps } from "@/app/types";
import { Merchant } from "@prisma/client";
import { createMerchant, deleteMerchant, getMerchants, updateMerchant } from "../actions/merchants.actions";

const invalidateMerchantsQueries = (queryClient: QueryClient) => {
	console.log("=------------invalidating grouped categories--------------------");
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MERCHANTS] });
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_TRANSACTIONS_WITH_RELATIONS] });
};

export const useGetMerchants = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_MERCHANTS],
		queryFn: () => {
			console.log("query: calling merchants................");
			return getMerchants();
		}
	});
};

export const useCreateMerchant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: CreateMerchantProps) => createMerchant(props),
		onMutate: async (props: CreateMerchantProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_MERCHANTS] });
			const previousMerchants = queryClient.getQueryData([QUERY_KEYS.GET_MERCHANTS]);

			queryClient.setQueryData([QUERY_KEYS.GET_MERCHANTS], (old: SuccessResponse<Merchant[]>) => {
				// const latestMerchants = [
				// 	{
				// 		...props,
				// 		id: Date.now(),
				// 		updatedAt: new Date().toISOString()
				// 	},
				// 	...old.data
				// ];
				return {
					...old,
					["data"]: [
						{
							...props,
							id: Date.now()
						},
						...old.data
					]
				};
			});

			return { previousMerchants };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_MERCHANTS], context?.previousMerchants);
			invalidateMerchantsQueries(queryClient);
		}
	});
};

export const useUpdateMerchant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: UpdateMerchantProps) => updateMerchant(props),
		onMutate: async (props: UpdateMerchantProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_MERCHANTS] });

			const previousMerchants = queryClient.getQueryData([QUERY_KEYS.GET_MERCHANTS]);
			console.log("optimistic update");
			queryClient.setQueryData([QUERY_KEYS.GET_MERCHANTS], (old: SuccessResponse<Merchant[]>) => {
				const filtered = old.data.filter((merchant) => merchant.id != props.id);

				return {
					...old,
					["data"]: [props, ...filtered]
				};
			});

			return { previousMerchants };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_MERCHANTS], context?.previousMerchants);
			invalidateMerchantsQueries(queryClient);
		}
	});
};

export const useDeleteMercant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: DeleteMerchantProps) => deleteMerchant(props),
		onMutate: async (props: DeleteMerchantProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_MERCHANTS] });
			const previousMerchants = queryClient.getQueryData([QUERY_KEYS.GET_MERCHANTS]);

			queryClient.setQueryData([QUERY_KEYS.GET_MERCHANTS], (old: SuccessResponse<Merchant[]>) => {
				return { ...old, ["data"]: old.data.filter((merchant) => merchant.id !== props.id) };
			});

			return { previousMerchants };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_MERCHANTS], context?.previousMerchants);
			invalidateMerchantsQueries(queryClient);
		}
	});
};
