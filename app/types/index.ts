import {
	createCategorySchema,
	createSubcategorySchema,
	deleteCategorySchema,
	deleteSubcategorySchema,
	updateCategorySchema,
	updateSubcategorySchema
} from "@/lib/validation";
import { CategoryGroup, Prisma } from "@prisma/client";
import { z } from "zod";

export type BaseResponse = {
	success: boolean;
	statusCode: number;
};

export type SuccessResponse<T> = BaseResponse & {
	data: T;
};

export type ErrorResponse = BaseResponse & {
	data: string;
};

export type Response<T> = SuccessResponse<T> | ErrorResponse;

// export type CreateTransactionRequest = {
// 	userId: number;
// 	amount: number;
// 	date: string;
// 	description?: string;
// 	categoryId: number;
// 	subcategoryId: number;
// 	merchantId: number;
// };

// export type UpdateTransactionRequest = {
// 	transactionId: number;
// 	amount: number;
// 	date: string;
// 	description?: string;
// 	categoryId: number;
// 	subcategoryId: number;
// 	merchantId: number;
// };

// export type DeleteTransactionRequest = {
// 	transactionId: number;
// };

// export type ListTransactionsRequest = {
// 	userId: number;
// 	page: number;
// 	limit: number;
// };

export type CategoriesWithSub = Prisma.CategoryGetPayload<{
	select: {
		id: true;
		name: true;
		group: true;
		subcategories: {
			select: {
				id: true;
				name: true;
			};
		};
	};
}>;

// export interface CategoryGroup {
// 	id: number;
// 	name: string;
// 	categories: CategoriesWithSub[];
// }

// export interface GroupedCategories {
// 	[group: CategoryGroup]: CategoriesWithSub[]; // Group name is the key, and categories are the values
// }
// export interface GroupedCategories {
// 	[group in CategoryGroup]: CategoriesWithSub[]; // The key is now a Group enum value, and the value is an array of categories
// }

// Record allow for enum to category mapping, partial allows for enum records to be optional
export type GroupedCategories = Partial<Record<CategoryGroup, CategoriesWithSub[]>>;

export type CreateCategoryProps = z.infer<typeof createCategorySchema>;
export type UpdateCategoryProps = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryProps = z.infer<typeof deleteCategorySchema>;

export type CreateSubcategoryProps = z.infer<typeof createSubcategorySchema>;
export type UpdateSubcategoryProps = z.infer<typeof updateSubcategorySchema>;
export type DeleteSubcategoryProps = z.infer<typeof deleteSubcategorySchema>;

export type CategoryMutationProps = {
	type: "category" | "subcategory";
	operation: "new" | "edit" | "delete";
	name: string;
	group: CategoryGroup;
	categoryId: number;
	subcategoryId?: number;
};

export type CategoryDialogProps = CategoryMutationProps & {
	isOpen: boolean;
};
