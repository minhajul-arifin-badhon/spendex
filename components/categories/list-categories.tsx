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
	useDeleteCategory,
	useGetCategories,
	useUpdateCategory
} from "@/lib/react-query/categories.queries";
import {
	useCreateSubcategory,
	useDeleteSubcategory,
	useUpdateSubcategory
} from "@/lib/react-query/subcategories.queries";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

const initDialogProps: CategoryDialogProps = {
	isOpen: false,
	type: "category",
	group: "expense",
	categoryId: 1,
	name: "Delete",
	operation: "delete"
};

export default function ListCategories() {
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

	const handleMutation = async (data: CategoryMutationProps) => {
		const { type, operation, group, categoryId, subcategoryId, name } = data;

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
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [editingItem]);

	useEffect(() => {
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

			setGroupedCategories(groupedCategories);
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
			{Object.keys(groupedCategories).map((group) => (
				<div key={group} className="border rounded-md overflow-hidden dark:border-gray-700">
					<div className="bg-muted px-3 py-2 sm:px-4 sm:py-2 font-semibold text-base dark:bg-gray-800 capitalize">
						{group}
					</div>
					<div className="divide-y dark:divide-gray-700">
						{groupedCategories[group as CategoryGroup]!.map((category) => (
							<div key={category.id} className="px-2 py-2 sm:px-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 flex-grow">
										<button onClick={() => toggleCategory(category.id)} className="flex-shrink-0">
											{expandedCategories[category.id.toString()] ? (
												<ChevronDown className="h-4 w-4" />
											) : (
												<ChevronRight className="h-4 w-4" />
											)}
										</button>

										{editingItem?.type === "category" && editingItem.categoryId === category.id ? (
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
												className="h-6 py-1 px-2 text-sm font-medium rounded"
												autoFocus
											/>
										) : (
											<span
												className="font-medium text-sm cursor-text"
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
										size="sm"
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
										className="text-destructive hover:text-destructive/90 cursor-pointer"
									>
										<Trash2 />
										<span className="sr-only">Delete {category.name}</span>
									</Button>
								</div>

								{expandedCategories[category.id.toString()] && (
									<div className="mt-1 mx-6">
										{category.subcategories.map((subcategory) => (
											<div
												key={subcategory.id}
												className="flex items-center justify-between p-1 sm:px-2 sm:py-1 rounded hover:bg-muted/50 dark:hover:bg-gray-700"
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
														className="h-6 py-1 px-2 text-sm rounded"
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
													size="sm"
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
													className="text-destructive hover:text-destructive/90 cursor-pointer"
												>
													<Trash2 />
													<span className="sr-only">Delete {subcategory.name}</span>
												</Button>
											</div>
										))}
										<Button
											variant="ghost"
											// size="default"
											onClick={() => addNewSubcategory(group as CategoryGroup, category.id)}
											className="w-full justify-start text-muted-foreground p-1 sm:px-5 sm:py-2 hover:text-primary transition-all duration-300 cursor-pointer"
										>
											<Plus className="h-3 w-3 mr-2" />
											Add Subcategory
										</Button>
									</div>
								)}
							</div>
						))}
						<div className="p-2">
							<Button
								variant="ghost"
								size="sm"
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
