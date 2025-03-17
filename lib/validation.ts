import { CategoryGroup } from "@prisma/client";
import { z } from "zod";

export const createCategorySchema = z.object({
	name: z.string().nonempty(),
	group: z.nativeEnum(CategoryGroup)
});

export const updateCategorySchema = z.object({
	id: z.number().int().positive(),
	name: z.string().nonempty()
});

export const deleteCategorySchema = z.object({
	id: z.number().int().positive()
});

export const createSubcategorySchema = z.object({
	name: z.string().nonempty(),
	categoryId: z.number().int().positive()
});

export const updateSubcategorySchema = z.object({
	id: z.number().int().positive(),
	name: z.string().nonempty()
});

export const deleteSubcategorySchema = z.object({
	id: z.number().int().positive()
});
