"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { CategoriesWithSub, CategoryDialogProps, CategoryMutationProps, GroupedCategories } from "@/app/types";
import { CategoryGroup } from "@prisma/client";
import {
	useCreateCategory,
	useCreateSubcategory,
	useDeleteCategory,
	useDeleteSubcategory,
	useGetCategories,
	useUpdateCategory,
	useUpdateSubcategory
} from "@/lib/react-query/queries";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

const initDialogProps: CategoryDialogProps = {
	isOpen: false,
	type: "category",
	group: "expense",
	categoryId: 1,
	name: "Delete",
	operation: "delete"
};

export default function ListCategories() {
	console.log("--------rendering category list");
	const { data: categoriesResponse, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategories();
	const createCategoryMutation = useCreateCategory();
	const updateCategoryMutation = useUpdateCategory();
	const deleteCategoryMutation = useDeleteCategory();

	const createSubategoryMutation = useCreateSubcategory();
	const updateSubcategoryMutation = useUpdateSubcategory();
	const deleteSubcategoryMutation = useDeleteSubcategory();

	const [groupedCategories, setGroupedCategories] = useState<GroupedCategories>({});
	const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
	const [deleteDialog, setDeleteDialog] = useState<CategoryDialogProps>(initDialogProps);
	const [editingItem, setEditingItem] = useState<CategoryMutationProps | null>(null);

	const toggleCategory = (categoryId: number) => {
		setExpandedCategories((prev) => ({
			...prev,
			[categoryId]: !prev[categoryId]
		}));
	};

	const openDeleteDialog = (data: CategoryDialogProps) => {
		setDeleteDialog(data);
	};

	const closeDeleteDialog = () => {
		setDeleteDialog(initDialogProps);
	};

	const startEditing = (data: CategoryMutationProps) => {
		setEditingItem(data);
	};

	const cancelEdit = () => {
		setEditingItem(null);
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (editingItem) {
			setEditingItem({
				...editingItem,
				name: e.target.value
			});
		}
	};

	// const removeFromGroupCategories = (data: CategoryMutationProps) => {
	// 	const { type, operation, group, categoryId, subcategoryId, name } = data;
	// 	console.log(type, operation, group, categoryId, subcategoryId, name);

	// 	if (type == "category") {
	// 		setGroupedCategories((prev) => {
	// 			return {
	// 				...prev,
	// 				[group]: prev[group]?.filter((category) => (category.id != categoryId)
	// 			};
	// 		});
	// 	} else {
	// 		setGroupedCategories((prev) => {
	// 			return {
	// 				...prev,
	// 				[group]: prev[group]?.map((category) => {
	// 					if (category.id == categoryId) {
	// 						category.subcategories = category.subcategories.filter(
	// 							(subcategory) => subcategory.id != subcategoryId
	// 						);
	// 					}
	// 					return category;
	// 				})
	// 			};
	// 		});
	// 	}
	// };

	// const isDuplicate = (data: CategoryMutationProps): boolean => {
	// 	const { type, operation, group, categoryId, subcategoryId, name } = data;
	// 	console.log(type, operation, group, categoryId, subcategoryId, name);

	// 	if (operation === "delete") return false;

	// 	// Check for duplicate category
	// 	if (type === "category") {
	// 		return Object.values(groupedCategories).some((categories) =>
	// 			categories.some((category) => category.name === name)
	// 		);
	// 	}

	// 	// Check for duplicate subcategory
	// 	return Object.values(groupedCategories).some((categories) =>
	// 		categories.some((category) => category.subcategories?.some((subcategory) => subcategory.name === name))
	// 	);
	// };

	const handleMutation = async (data: CategoryMutationProps) => {
		const { type, operation, group, categoryId, subcategoryId, name } = data;
		console.log(type, operation, group, categoryId, subcategoryId, name);

		try {
			let response;
			if (operation === "new") {
				response =
					type === "category"
						? await createCategoryMutation.mutateAsync({ name, group })
						: await createSubategoryMutation.mutateAsync({ categoryId, name });
			} else if (operation == "edit") {
				response =
					type === "category"
						? await updateCategoryMutation.mutateAsync({ id: categoryId, name })
						: await updateSubcategoryMutation.mutateAsync({ id: subcategoryId!, name });
			} else {
				if (type === "category" && categoryId) {
					response = await deleteCategoryMutation.mutateAsync({ id: categoryId });
				} else if (type === "subcategory" && subcategoryId) {
					console.log("Deleting subcategory");
					response = await deleteSubcategoryMutation.mutateAsync({ id: subcategoryId });
				} else {
					console.log("delete did not match");
				}
			}

			console.log(response);

			if (!response?.success) {
				toast.error(response?.data);
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong!");
		}
	};

	const saveEdit = async () => {
		if (!editingItem) return;

		// if (isDuplicate(editingItem)) {
		// 	toast.error(`A ${editingItem.type} with that name already exists.`);
		// 	return;
		// }

		const data = JSON.parse(JSON.stringify(editingItem));

		setTimeout(() => {
			setEditingItem(null);
		}, 50);

		handleMutation(data);
	};

	const handleDelete = async () => {
		handleMutation(deleteDialog);
		closeDeleteDialog();
	};

	const addNewCategory = (group: CategoryGroup) => {
		const newCategoryId = 0;
		setGroupedCategories({
			...groupedCategories,
			[group]: [
				...(groupedCategories[group] as CategoriesWithSub[]),
				{
					id: newCategoryId,
					name: "New Category",
					subcategories: []
				}
			]
		});

		// setExpandedCategories((prev) => ({
		// 	...prev,
		// 	[newCategoryId]: true
		// }));

		startEditing({
			type: "category",
			operation: "new",
			name: "New Category",
			group: group,
			categoryId: newCategoryId
		});
	};

	const addNewSubcategory = (group: CategoryGroup, categoryId: number) => {
		const newSubcategoryId = 0;

		setGroupedCategories({
			...groupedCategories,
			[group]: groupedCategories[group]!.map((category) => {
				if (category.id == categoryId) {
					category.subcategories = [
						...category.subcategories,
						{
							id: newSubcategoryId,
							name: "New Subcategory"
						}
					];
				}
				return category;
			})
		});

		startEditing({
			type: "subcategory",
			operation: "new",
			name: "New Subcategory",
			group: group,
			categoryId: categoryId,
			subcategoryId: newSubcategoryId
		});
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (editingItem && !(event.target as HTMLElement).closest("input")) {
				saveEdit();
				// if (!isDuplicate(editingItem)) saveEdit();
				// else {
				// 	removeFromGroupCategories(editingItem);
				// 	setEditingItem(null);
				// }
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [editingItem]);

	useEffect(() => {
		console.log("------categories changed-------------");
		if (categoriesResponse?.success) {
			const categories = categoriesResponse.data as CategoriesWithSub[];

			const groupedCategories = categories.reduce((acc: GroupedCategories, category) => {
				const group = category.group;
				if (!acc[group]) {
					acc[group] = [];
				}

				acc[group].push(category);
				return acc;
			}, {});

			setGroupedCategories(groupedCategories); // Store the fetched data in the local state
		}
	}, [categoriesResponse]);

	if (isErrorCategories)
		return (
			<div>
				<p>Something bad happened</p>
			</div>
		);

	if (isLoadingCategories)
		return (
			<div className="size-full -mt-20 min-h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);

	if (!categoriesResponse?.success) {
		return (
			<div>
				<p>{`${categoriesResponse?.statusCode}: ${categoriesResponse?.data}:`}</p>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-8">
				{Object.keys(groupedCategories).map((group) => (
					<div key={group} className="border rounded-lg overflow-hidden dark:border-gray-700">
						<div className="bg-muted p-3 sm:p-4 font-semibold text-base sm:text-lg dark:bg-gray-800 capitalize">
							{group}
						</div>
						<div className="divide-y dark:divide-gray-700">
							{groupedCategories[group as CategoryGroup]!.map((category) => (
								<div key={category.id} className="p-2 sm:p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 flex-grow">
											<button
												onClick={() => toggleCategory(category.id)}
												className="flex-shrink-0"
											>
												{expandedCategories[category.id.toString()] ? (
													<ChevronDown className="h-5 w-5" />
												) : (
													<ChevronRight className="h-5 w-5" />
												)}
											</button>

											{editingItem?.type === "category" &&
											editingItem.categoryId === category.id ? (
												<Input
													value={editingItem.name}
													onChange={handleNameChange}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															saveEdit();
														} else if (e.key === "Escape") {
															cancelEdit();
														}
													}}
													className="h-8 py-1 px-2 text-base font-medium"
													autoFocus
												/>
											) : (
												<span
													className="font-medium text-sm sm:text-base cursor-text"
													onClick={() =>
														startEditing({
															type: "category",
															operation: "edit",
															name: category.name,
															group: group as CategoryGroup,
															categoryId: category.id
														})
													}
												>
													{category.name}
												</span>
											)}
										</div>
										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												openDeleteDialog({
													isOpen: true,
													type: "category",
													operation: "delete",
													name: category.name,
													group: group as CategoryGroup,
													categoryId: category.id
												})
											}
											className="h-8 w-8 text-destructive hover:text-destructive/90 cursor-pointer"
										>
											<Trash2 className="h-4 w-4" />
											<span className="sr-only">Delete {category.name}</span>
										</Button>
									</div>

									{expandedCategories[category.id.toString()] && (
										<div className="mt-2 mx-6">
											{category.subcategories.map((subcategory) => (
												<div
													key={subcategory.id}
													className="flex items-center justify-between p-1 sm:p-2 rounded-md hover:bg-muted/50 dark:hover:bg-gray-700"
												>
													{editingItem?.type === "subcategory" &&
													editingItem.subcategoryId === subcategory.id ? (
														<Input
															value={editingItem.name}
															onChange={handleNameChange}
															onKeyDown={(e) => {
																if (e.key === "Enter") {
																	saveEdit();
																} else if (e.key === "Escape") {
																	cancelEdit();
																}
															}}
															className="h-7 py-1 px-2 text-sm"
															autoFocus
														/>
													) : (
														<span
															className="text-sm cursor-text"
															onClick={() =>
																startEditing({
																	type: "subcategory",
																	operation: "edit",
																	name: subcategory.name,
																	group: group as CategoryGroup,
																	categoryId: category.id,
																	subcategoryId: subcategory.id
																})
															}
														>
															{subcategory.name}
														</span>
													)}

													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															openDeleteDialog({
																isOpen: true,
																type: "subcategory",
																operation: "delete",
																name: subcategory.name,
																group: group as CategoryGroup,
																categoryId: category.id,
																subcategoryId: subcategory.id
															})
														}
														className="h-7 w-7 text-destructive hover:text-destructive/90 cursor-pointer"
													>
														<Trash2 className="h-3.5 w-3.5" />
														<span className="sr-only">Delete {subcategory.name}</span>
													</Button>
												</div>
											))}
											<Button
												variant="ghost"
												// size="default"
												onClick={() => addNewSubcategory(group as CategoryGroup, category.id)}
												className="w-full justify-start text-muted-foreground p-1 sm:p-5 hover:text-primary transition-all duration-300 cursor-pointer"
											>
												<Plus className="h-4 w-4 mr-2" />
												Add Subcategory
											</Button>
										</div>
									)}
								</div>
							))}
							<div className="p-2 sm:p-4">
								<Button
									variant="ghost"
									onClick={() => addNewCategory(group as CategoryGroup)}
									className="w-full justify-start text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Category
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialog.isOpen} onOpenChange={closeDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							{deleteDialog.type === "category"
								? `This will delete the category "${deleteDialog.name}" and all its subcategories.`
								: `This will delete the subcategory "${deleteDialog.name}".`}
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

// const firstCategoryId = useMemo(() => {
// 	let firstId: number | null = null;
// 	console.log("calculating first category id");
// 	for (const groupKey of Object.keys(categories)) {
// 		const group = categories[groupKey as CategoryGroup];

// 		if (group && group.length > 0) {
// 			firstId = group[0].id;
// 			break;
// 		}
// 	}

// 	console.log(firstId);
// 	return firstId;
// }, [categories]);

// Set expanded categories state when firstCategoryId is determined
// useEffect(() => {
// 	console.log("firstCategory id has changed");
// 	if (firstCategoryId !== null) {
// 		console.log("firstCategory id has changed, setting");

// 		setExpandedCategories((prev) => ({
// 			...prev,
// 			[firstCategoryId.toString()]: true
// 		}));
// 	}
// }, [firstCategoryId]); // This will run when `firstCategoryId` is updated
