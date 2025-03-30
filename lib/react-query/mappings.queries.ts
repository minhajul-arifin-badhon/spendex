import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { CreateMappingProps, DeleteMappingProps, SuccessResponse, UpdateMappingProps } from "@/app/types";
import { createMapping, deleteMapping, getMappings, updateMapping } from "../actions/mappings.actions";
import { Mapping } from "@prisma/client";

// ============================================================
// MAPPING QUERIES
// ============================================================

const invalidateMappingsQueries = (queryClient: QueryClient) => {
	console.log("=------------invalidating grouped categories--------------------");
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MAPPINGS] });
};

export const useGetMappings = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_MAPPINGS],
		queryFn: () => {
			console.log("query: calling mappings................");
			return getMappings();
		}
	});
};

export const useCreateMapping = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: CreateMappingProps) => createMapping(props),
		onMutate: async (props: CreateMappingProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_MAPPINGS] });
			const previousMappings = queryClient.getQueryData([QUERY_KEYS.GET_MAPPINGS]);

			queryClient.setQueryData([QUERY_KEYS.GET_MAPPINGS], (old: SuccessResponse<Mapping[]>) => {
				return {
					...old,
					["data"]: [
						...old.data,
						{
							...props,
							id: Date.now()
						}
					]
				};
			});

			return { previousMappings };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error) queryClient.setQueryData([QUERY_KEYS.GET_MAPPINGS], context?.previousMappings);
			invalidateMappingsQueries(queryClient);
		}
	});
};

export const useUpdateMapping = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: UpdateMappingProps) => updateMapping(props),
		onMutate: async (props: UpdateMappingProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_MAPPINGS] });

			const previousMappings = queryClient.getQueryData([QUERY_KEYS.GET_MAPPINGS]);
			console.log("optimistic update");
			queryClient.setQueryData([QUERY_KEYS.GET_MAPPINGS], (old: SuccessResponse<Mapping[]>) => {
				return {
					...old,
					["data"]: old.data.map((mapping) => {
						if (mapping.id == props.id) {
							return {
								...mapping,
								...props
							};
						}
						return mapping;
					})
				};
			});

			return { previousMappings };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error) queryClient.setQueryData([QUERY_KEYS.GET_MAPPINGS], context?.previousMappings);
			invalidateMappingsQueries(queryClient);
		}
	});
};

export const useDeleteMapping = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: DeleteMappingProps) => deleteMapping(props),
		onMutate: async (props: DeleteMappingProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_MAPPINGS] });
			const previousMappings = queryClient.getQueryData([QUERY_KEYS.GET_MAPPINGS]);

			queryClient.setQueryData([QUERY_KEYS.GET_MAPPINGS], (old: SuccessResponse<Mapping[]>) => {
				return { ...old, ["data"]: old.data.filter((mapping) => mapping.id !== props.id) };
			});

			return { previousMappings };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error) queryClient.setQueryData([QUERY_KEYS.GET_MAPPINGS], context?.previousMappings);
			invalidateMappingsQueries(queryClient);
		}
	});
};
