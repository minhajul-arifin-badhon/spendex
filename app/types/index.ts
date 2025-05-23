import {
	columnFieldMappingSchema,
	createCategorySchema,
	createMappingSchema,
	createMerchantSchema,
	createSubcategorySchema,
	createTransactionSchema,
	deleteCategorySchema,
	deleteMappingSchema,
	deleteMerchantSchema,
	deleteSubcategorySchema,
	deleteTransactionSchema,
	importFormSchema,
	mappingFormSchema,
	mappingFormSchemaWithFilePreview,
	merchantFormSchema,
	transactionFormSchema,
	updateCategorySchema,
	updateMappingSchema,
	updateMerchantSchema,
	updateSubcategorySchema,
	updateTransactionSchema
} from "@/lib/validation";
import { Prisma, CategoryGroup } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { z } from "zod";

// ============================================
// API Response Types
// ============================================
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

// ============================================
// Category Types
// ============================================

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
export type CategoryMinimal = TransactionWithRelations["category"];
export type SubcategoryMinimal = TransactionWithRelations["subcategory"];

export type CreateCategoryProps = z.infer<typeof createCategorySchema>;
export type UpdateCategoryProps = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryProps = z.infer<typeof deleteCategorySchema>;
export type CreateSubcategoryProps = z.infer<typeof createSubcategorySchema>;
export type UpdateSubcategoryProps = z.infer<typeof updateSubcategorySchema>;
export type DeleteSubcategoryProps = z.infer<typeof deleteSubcategorySchema>;

export type CategorySelection = {
	type: "category" | "subcategory";
	id: number;
	categoryId?: number;
	name: string;
};

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

// ============================================
// Merchant Types
// ============================================

export type MerchantFormProps = z.infer<ReturnType<typeof merchantFormSchema>>;
export type CreateMerchantProps = z.infer<typeof createMerchantSchema>;
export type UpdateMerchantProps = z.infer<typeof updateMerchantSchema>;
export type DeleteMerchantProps = z.infer<typeof deleteMerchantSchema>;
export type MerchantMinimal = TransactionWithRelations["merchant"];

// ============================================
// Transaction Types
// ============================================

export type TransactionFormProps = z.infer<typeof transactionFormSchema>;
export type CreateTransactionProps = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionProps = z.infer<typeof updateTransactionSchema>;
export type DeleteTransactionProps = z.infer<typeof deleteTransactionSchema>;

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
	select: {
		id: true;
		amount: true;
		date: true;
		accountName: true;
		description: true;
		categoryId: true;
		subcategoryId: true;
		merchantId: true;
		userId: true;
		createdAt: true;
		updatedAt: true;
		category: {
			select: {
				id: true;
				name: true;
				group: true;
			};
		};
		subcategory: {
			select: {
				id: true;
				name: true;
			};
		};
		merchant: {
			select: {
				id: true;
				name: true;
			};
		};
	};
}>;

// ============================================
// Import and Mapping Types
// ============================================

export type ImportFormProps = z.infer<typeof importFormSchema>;
export type MappingFormProps = z.infer<ReturnType<typeof mappingFormSchema>>;
export type MappingFormWithFilePreviewProps = z.infer<ReturnType<typeof mappingFormSchemaWithFilePreview>>;
export type CreateMappingProps = z.infer<typeof createMappingSchema>;
export type UpdateMappingProps = z.infer<typeof updateMappingSchema>;
export type DeleteMappingProps = z.infer<typeof deleteMappingSchema>;
export type ColumnFieldMappingProps = z.infer<typeof columnFieldMappingSchema>;
export type UnassignedDescription = {
	description: string;
	count: number;
};

// ============================================
// Chart and Filter Types
// ============================================

export type BarSizeResult<T> = {
	barSize: number;
	chartData: T[];
	isTrimmed: boolean;
	height: number;
};

export type Filters = {
	moneyInCategory: string;
	moneyInSubcategory: string;
	moneyOutCategory: string;
	moneyOutSubcategory: string;
	moneyInMerchant: string;
	moneyOutMerchant: string;
	accountName: string;
	dateRange: DateRange;
};
