import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../actions/categories.actions";
import {
	CategoriesWithSub,
	CreateCategoryProps,
	CreateMappingProps,
	CreateMerchantProps,
	CreateSubcategoryProps,
	DeleteCategoryProps,
	DeleteMappingProps,
	DeleteMerchantProps,
	DeleteSubcategoryProps,
	SuccessResponse,
	UpdateCategoryProps,
	UpdateMappingProps,
	UpdateMerchantProps,
	UpdateSubcategoryProps
} from "@/app/types";
import { createSubcategory, deleteSubcategory, updateSubcategory } from "../actions/subcategories.actions";
import { createMapping, deleteMapping, getMappings, updateMapping } from "../actions/mappings.actions";
import { Mapping, Merchant } from "@prisma/client";
import { createMerchant, deleteMerchant, getMerchants, updateMerchant } from "../actions/merchants.actions";

// ============================================================
// CATEGORY QUERIES
// ============================================================

const invalidateCategoriesQueries = (queryClient: QueryClient) => {
	console.log("=------------invalidating grouped categories--------------------");
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CATEGORIES] });
};

export const useGetCategories = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CATEGORIES],
		queryFn: () => {
			console.log("query: calling categories................");
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

// ============================================================
// SUBCATEGORY QUERIES
// ============================================================

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

// export const useGetCategories = (userId: string) => {
// 	return useQuery({
// 		queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
// 		queryFn: () => getUserById(userId),
// 		enabled: !!userId
// 	});
// };

// export const useUpdateUser = () => {
// 	const queryClient = useQueryClient();
// 	return useMutation({
// 		mutationFn: (user: IUpdateUser) => updateUser(user),
// 		onSuccess: (data) => {
// 			queryClient.invalidateQueries({
// 				queryKey: [QUERY_KEYS.GET_CURRENT_USER]
// 			});
// 			queryClient.invalidateQueries({
// 				queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
// 			});
// 		}
// 	});
// };

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

// ============================================================
// MERCHANT QUERIES
// ============================================================

const invalidateMerchantsQueries = (queryClient: QueryClient) => {
	console.log("=------------invalidating grouped categories--------------------");
	queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MERCHANTS] });
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
