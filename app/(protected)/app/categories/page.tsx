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

// Define types for our data structure
type Subcategory = {
	id: string;
	name: string;
};

type Category = {
	id: string;
	name: string;
	subcategories: Subcategory[];
};

type CategoryGroup = {
	id: string;
	name: string;
	categories: Category[];
};

const initialCategories = [
	{
		id: "group1",
		name: "Expenses",
		categories: [
			{
				id: "cat1",
				name: "Home",
				subcategories: [
					{ id: "sub1", name: "Mortgages" },
					{ id: "sub2", name: "Utilities" },
					{ id: "sub3", name: "Property Tax" },
				],
			},
			{
				id: "cat2",
				name: "Transportation",
				subcategories: [
					{ id: "sub4", name: "Gas" },
					{ id: "sub5", name: "Maintainance" },
					{ id: "sub6", name: "Insurance" },
					{ id: "sub7", name: "Other Transportation" },
				],
			},
			{
				id: "cat3",
				name: "Food",
				subcategories: [
					{ id: "sub8", name: "Groceries" },
					{ id: "sub9", name: "Restaurants" },
					{ id: "sub10", name: "Other Food" },
				],
			},
			{
				id: "cat4",
				name: "Health and Wellness",
				subcategories: [
					{ id: "sub11", name: "Medical" },
					{ id: "sub12", name: "Gym" },
					{ id: "sub13", name: "Other Health" },
				],
			},
			{
				id: "cat5",
				name: "Travel",
				subcategories: [],
			},
			{
				id: "cat6",
				name: "Vacation",
				subcategories: [],
			},
			{
				id: "cat7",
				name: "Shopping",
				subcategories: [
					{ id: "sub14", name: "Clothing" },
					{ id: "sub15", name: "Other Shopping" },
				],
			},
			{
				id: "cat8",
				name: "Entertainment",
				subcategories: [],
			},
			{
				id: "cat9",
				name: "Education",
				subcategories: [],
			},
			{
				id: "cat10",
				name: "Subscriptions",
				subcategories: [],
			},
			{
				id: "cat11",
				name: "Gifts and Donations",
				subcategories: [],
			},
			{
				id: "cat12",
				name: "Business and Work",
				subcategories: [],
			},
			{
				id: "cat13",
				name: "Investments",
				subcategories: [],
			},
			{
				id: "cat14",
				name: "Insurance",
				subcategories: [],
			},
			{
				id: "cat15",
				name: "Loans and Fees",
				subcategories: [],
			},
			{
				id: "cat16",
				name: "Other Expenses",
				subcategories: [],
			},
		],
	},
	{
		id: "group2",
		name: "Income",
		categories: [
			{
				id: "cat17",
				name: "Primary Paycheck",
				subcategories: [],
			},
			{
				id: "cat18",
				name: "Business Income",
				subcategories: [],
			},
			{
				id: "cat19",
				name: "Repayment from Others",
				subcategories: [],
			},
			{
				id: "cat20",
				name: "Other Income",
				subcategories: [],
			},
		],
	},
	{
		id: "group3",
		name: "Transfers",
		categories: [
			{
				id: "cat21",
				name: "Transfer",
				subcategories: [],
			},
			{
				id: "cat22",
				name: "Credit Card Payment",
				subcategories: [],
			},
			{
				id: "cat23",
				name: "Buy and Trade",
				subcategories: [],
			},
			{
				id: "cat24",
				name: "Sell and Trade",
				subcategories: [],
			},
		],
	},
];

export default function Page() {
	const [mounted, setMounted] = useState(false);

	// Initial data for category groups, categories, and subcategories
	const [categoryGroups, setCategoryGroups] =
		useState<CategoryGroup[]>(initialCategories);

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
