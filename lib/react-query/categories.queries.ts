import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../actions/categories.actions";
import {
	CategoriesWithSub,
	CreateCategoryProps,
	DeleteCategoryProps,
	SuccessResponse,
	UpdateCategoryProps
} from "@/app/types";

const invalidateCategoriesQueries = (queryClient: QueryClient) => {
	console.log("=------------invalidating grouped categories--------------------");
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });
};

export const useGetCategories = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CATEGORIES],
		queryFn: () => {
			return getCategories();
		}
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: CreateCategoryProps) => createCategory(props),
		onMutate: async (props: CreateCategoryProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });

			const previousCategories = queryClient.getQueryData([QUERY_KEYS.GET_CATEGORIES]);

			queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], (old: SuccessResponse<CategoriesWithSub[]>) => {
				return {
					...old,
					["data"]: [
						...old.data,
						{
							id: Date.now(),
							name: props.name,
							group: props.group,
							subcategories: []
						}
					]
				};
			});

			return { previousCategories };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], context?.previousCategories);

			invalidateCategoriesQueries(queryClient);
		}
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: UpdateCategoryProps) => updateCategory(props),
		onMutate: async (props: UpdateCategoryProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });

			const previousCategories = queryClient.getQueryData([QUERY_KEYS.GET_CATEGORIES]);
			console.log("optimistic update");
			queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], (old: SuccessResponse<CategoriesWithSub[]>) => {
				return {
					...old,
					["data"]: old.data.map((category) => {
						if (category.id == props.id) {
							return {
								...category,
								name: props.name
							};
						}
						return category;
					})
				};
			});

			return { previousCategories };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], context?.previousCategories);

			invalidateCategoriesQueries(queryClient);
		}
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: DeleteCategoryProps) => deleteCategory(props),
		onMutate: async (props: DeleteCategoryProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });

			const previousCategories = queryClient.getQueryData([QUERY_KEYS.GET_CATEGORIES]);

			queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], (old: SuccessResponse<CategoriesWithSub[]>) => {
				return { ...old, ["data"]: old.data.filter((category) => category.id !== props.id) };
			});

			return { previousCategories };
		},
		onSettled: (data, error, variables, context) => {
			if (!data?.success || error)
				queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], context?.previousCategories);

			invalidateCategoriesQueries(queryClient);
		}
	});
};
