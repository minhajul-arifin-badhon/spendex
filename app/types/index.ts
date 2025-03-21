import {
	createCategorySchema,
	createSubcategorySchema,
	deleteCategorySchema,
	deleteSubcategorySchema,
	updateCategorySchema,
	updateSubcategorySchema
} from "@/lib/validation";
import { Prisma, CategoryGroup } from "@prisma/client";
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
