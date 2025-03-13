"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { initialCategories } from "@/lib/predefined_data";
import { Category } from "@/app/types";

export default function Page() {
	const [mounted, setMounted] = useState(false);

	// Initial data for category groups, categories, and subcategories
	const [categoryGroups, setCategoryGroups] =
		useState<Category[]>(initialCategories);

	// State to track expanded categories
	const [expandedCategories, setExpandedCategories] = useState<
		Record<string, boolean>
	>({
		cat1: true, // Initially expand the first category
	});

	// State for delete confirmation dialog
	const [deleteDialog, setDeleteDialog] = useState<{
		isOpen: boolean;
		type: "category" | "subcategory";
		groupId?: string;
		categoryId?: string;
		subcategoryId?: string;
		name?: string;
	}>({
		isOpen: false,
		type: "category",
	});

	const [editingItem, setEditingItem] = useState<{
		type: "category" | "subcategory";
		groupId: string;
		categoryId: string;
		subcategoryId?: string;
		name: string;
	} | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Toggle category expansion
	const toggleCategory = (categoryId: string) => {
		setExpandedCategories((prev) => ({
			...prev,
			[categoryId]: !prev[categoryId],
		}));
	};

	// Open delete confirmation dialog
	const openDeleteDialog = (
		type: "category" | "subcategory",
		name: string,
		groupId: string,
		categoryId: string,
		subcategoryId?: string
	) => {
		setDeleteDialog({
			isOpen: true,
			type,
			groupId,
			categoryId,
			subcategoryId,
			name,
		});
	};

	// Close delete confirmation dialog
	const closeDeleteDialog = () => {
		setDeleteDialog({
			isOpen: false,
			type: "category",
		});
	};

	// Handle deletion of category or subcategory
	const handleDelete = () => {
		const { type, groupId, categoryId, subcategoryId } = deleteDialog;

		if (type === "category" && groupId && categoryId) {
			// Delete category
			setCategoryGroups((prevGroups) =>
				prevGroups.map((group) => {
					if (group.id === groupId) {
						return {
							...group,
							categories: group.categories.filter(
								(category) => category.id !== categoryId
							),
						};
					}
					return group;
				})
			);
		} else if (
			type === "subcategory" &&
			groupId &&
			categoryId &&
			subcategoryId
		) {
			// Delete subcategory
			setCategoryGroups((prevGroups) =>
				prevGroups.map((group) => {
					if (group.id === groupId) {
						return {
							...group,
							categories: group.categories.map((category) => {
								if (category.id === categoryId) {
									return {
										...category,
										subcategories:
											category.subcategories.filter(
												(subcategory) =>
													subcategory.id !==
													subcategoryId
											),
									};
								}
								return category;
							}),
						};
					}
					return group;
				})
			);
		}

		closeDeleteDialog();
	};

	// Start editing an item
	const startEditing = (
		type: "category" | "subcategory",
		name: string,
		groupId: string,
		categoryId: string,
		subcategoryId?: string
	) => {
		setEditingItem({
			type,
			groupId,
			categoryId,
			subcategoryId,
			name,
		});
	};

	// Handle name change in the input field
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (editingItem) {
			setEditingItem({
				...editingItem,
				name: e.target.value,
			});
		}
	};

	// Save the edited name
	const saveEdit = () => {
		if (!editingItem) return;

		const { type, groupId, categoryId, subcategoryId, name } = editingItem;

		setCategoryGroups((prevGroups) =>
			prevGroups.map((group) => {
				if (group.id === groupId) {
					if (type === "category") {
						return {
							...group,
							categories: group.categories.map((category) => {
								if (category.id === categoryId) {
									return {
										...category,
										name,
									};
								}
								return category;
							}),
						};
					} else {
						return {
							...group,
							categories: group.categories.map((category) => {
								if (category.id === categoryId) {
									return {
										...category,
										subcategories:
											category.subcategories.map(
												(subcategory) => {
													if (
														subcategory.id ===
														subcategoryId
													) {
														return {
															...subcategory,
															name,
														};
													}
													return subcategory;
												}
											),
									};
								}
								return category;
							}),
						};
					}
				}
				return group;
			})
		);

		setEditingItem(null);
	};

	// Cancel editing
	const cancelEdit = () => {
		setEditingItem(null);
	};

	// Add new category
	const addNewCategory = (groupId: string) => {
		const newCategoryId = `cat${Date.now()}`;
		setCategoryGroups((prevGroups) =>
			prevGroups.map((group) => {
				if (group.id === groupId) {
					return {
						...group,
						categories: [
							...group.categories,
							{
								id: newCategoryId,
								name: "New Category",
								subcategories: [],
							},
						],
					};
				}
				return group;
			})
		);
		setExpandedCategories((prev) => ({
			...prev,
			[newCategoryId]: true,
		}));
		startEditing("category", "New Category", groupId, newCategoryId);
	};

	// Add new subcategory
	const addNewSubcategory = (groupId: string, categoryId: string) => {
		const newSubcategoryId = `sub${Date.now()}`;
		setCategoryGroups((prevGroups) =>
			prevGroups.map((group) => {
				if (group.id === groupId) {
					return {
						...group,
						categories: group.categories.map((category) => {
							if (category.id === categoryId) {
								return {
									...category,
									subcategories: [
										...category.subcategories,
										{
											id: newSubcategoryId,
											name: "New Subcategory",
										},
									],
								};
							}
							return category;
						}),
					};
				}
				return group;
			})
		);
		startEditing(
			"subcategory",
			"New Subcategory",
			groupId,
			categoryId,
			newSubcategoryId
		);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				editingItem &&
				!(event.target as HTMLElement).closest("input")
			) {
				saveEdit();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [editingItem]); // Removed saveEdit from dependencies

	if (!mounted) return null;

	return (
		<div className="container mx-auto py-8 px-4">
			{/* <div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Categories Management</h1>
			</div> */}

			<div className="space-y-8">
				{categoryGroups.map((group) => (
					<div
						key={group.id}
						className="border rounded-lg overflow-hidden dark:border-gray-700"
					>
						<div className="bg-muted p-4 font-semibold text-lg dark:bg-gray-800">
							{group.name}
						</div>
						<div className="divide-y dark:divide-gray-700">
							{group.categories.map((category) => (
								<div key={category.id} className="p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 flex-grow">
											<button
												onClick={() =>
													toggleCategory(category.id)
												}
												className="flex-shrink-0"
											>
												{expandedCategories[
													category.id
												] ? (
													<ChevronDown className="h-5 w-5" />
												) : (
													<ChevronRight className="h-5 w-5" />
												)}
											</button>

											{editingItem?.type === "category" &&
											editingItem.categoryId ===
												category.id ? (
												<Input
													value={editingItem.name}
													onChange={handleNameChange}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															saveEdit();
														} else if (
															e.key === "Escape"
														) {
															cancelEdit();
														}
													}}
													className="h-8 py-1 px-2 text-base font-medium"
													autoFocus
												/>
											) : (
												<span
													className="font-medium text-base cursor-text"
													onDoubleClick={() =>
														startEditing(
															"category",
															category.name,
															group.id,
															category.id
														)
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
												openDeleteDialog(
													"category",
													category.name,
													group.id,
													category.id
												)
											}
											className="h-8 w-8 text-destructive hover:text-destructive/90 cursor-pointer"
										>
											<Trash2 className="h-4 w-4" />
											<span className="sr-only">
												Delete {category.name}
											</span>
										</Button>
									</div>

									{expandedCategories[category.id] && (
										<div className="mt-2 mx-6 space-y-2">
											{category.subcategories.map(
												(subcategory) => (
													<div
														key={subcategory.id}
														className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 dark:hover:bg-gray-700"
													>
														{editingItem?.type ===
															"subcategory" &&
														editingItem.subcategoryId ===
															subcategory.id ? (
															<Input
																value={
																	editingItem.name
																}
																onChange={
																	handleNameChange
																}
																onKeyDown={(
																	e
																) => {
																	if (
																		e.key ===
																		"Enter"
																	) {
																		saveEdit();
																	} else if (
																		e.key ===
																		"Escape"
																	) {
																		cancelEdit();
																	}
																}}
																className="h-7 py-1 px-2 text-sm"
																autoFocus
															/>
														) : (
															<span
																className="text-sm cursor-text"
																onDoubleClick={() =>
																	startEditing(
																		"subcategory",
																		subcategory.name,
																		group.id,
																		category.id,
																		subcategory.id
																	)
																}
															>
																{
																	subcategory.name
																}
															</span>
														)}

														<Button
															variant="ghost"
															size="icon"
															onClick={() =>
																openDeleteDialog(
																	"subcategory",
																	subcategory.name,
																	group.id,
																	category.id,
																	subcategory.id
																)
															}
															className="h-7 w-7 text-destructive hover:text-destructive/90 cursor-pointer"
														>
															<Trash2 className="h-3.5 w-3.5" />
															<span className="sr-only">
																Delete{" "}
																{
																	subcategory.name
																}
															</span>
														</Button>
													</div>
												)
											)}
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													addNewSubcategory(
														group.id,
														category.id
													)
												}
												className="w-full justify-start text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer"
											>
												<Plus className="h-4 w-4 mr-2" />
												Add Subcategory
											</Button>
										</div>
									)}
								</div>
							))}
							<div className="p-4">
								<Button
									variant="ghost"
									onClick={() => addNewCategory(group.id)}
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
			<AlertDialog
				open={deleteDialog.isOpen}
				onOpenChange={closeDeleteDialog}
			>
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
						<AlertDialogCancel className="cursor-pointer">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
