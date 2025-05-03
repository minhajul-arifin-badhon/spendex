import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import {
	CategoriesWithSub,
	CreateSubcategoryProps,
	DeleteSubcategoryProps,
	SuccessResponse,
	UpdateSubcategoryProps
} from "@/app/types";
import { createSubcategory, deleteSubcategory, updateSubcategory } from "../actions/subcategories.actions";

const invalidateCategoriesQueries = (queryClient: QueryClient) => {
	console.log("=------------invalidating grouped categories--------------------");
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });
};

export const useCreateSubcategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: CreateSubcategoryProps) => createSubcategory(props),
		onMutate: async (props: CreateSubcategoryProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });

			const previousCategories = queryClient.getQueryData([QUERY_KEYS.GET_CATEGORIES]);

			queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], (old: SuccessResponse<CategoriesWithSub[]>) => {
				console.log(old);
				return {
					...old,
					["data"]: old.data.map((category) => {
						if (category.id == props.categoryId) {
							category.subcategories = category.subcategories.map((subcategory) => {
								if (subcategory.id == 0) {
									console.log("found id 0: deleting .........................");
									subcategory = {
										id: Date.now(),
										name: props.name
									};
								}
								return subcategory;
							});
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

export const useUpdateSubcategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: UpdateSubcategoryProps) => updateSubcategory(props),
		onMutate: async (props: UpdateSubcategoryProps) => {
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });

			const previousCategories = queryClient.getQueryData([QUERY_KEYS.GET_CATEGORIES]);
			console.log("optimistic update");
			queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], (old: SuccessResponse<CategoriesWithSub[]>) => {
				return {
					...old,
					["data"]: old.data.map((category) => {
						category.subcategories = category.subcategories.map((subcategory) => {
							if (subcategory.id == props.id) {
								return {
									...subcategory,
									name: props.name
								};
							}
							return subcategory;
						});

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

export const useDeleteSubcategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (props: DeleteSubcategoryProps) => deleteSubcategory(props),
		onMutate: async (props: DeleteSubcategoryProps) => {
			console.log("On mutate: delete category");
			await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });

			const previousCategories = queryClient.getQueryData([QUERY_KEYS.GET_CATEGORIES]);

			queryClient.setQueryData([QUERY_KEYS.GET_CATEGORIES], (old: SuccessResponse<CategoriesWithSub[]>) => {
				return {
					...old,
					["data"]: old.data.map((category) => {
						category.subcategories = category.subcategories.filter(
							(subcategory) => subcategory.id != props.id
						);

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
