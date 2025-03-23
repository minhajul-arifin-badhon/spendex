import { CategoryGroup, Mapping } from "@prisma/client";
import { z } from "zod";

// server actions

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

// Define the Zod schema for validation
export const columnFieldMappingSchema = z.object({
	columnIndex: z.number(),
	fieldName: z.string()
});

// Create a schema factory function to include existing mappings in validation
export const mappingFormSchema = (existingMappings: Mapping[] = [], currentMappingId?: number) => {
	return z.object({
		mappingName: z
			.string()
			.min(3, "Mapping name must be at least 3 characters")
			.refine((val) => val.trim().length > 0, {
				message: "Mapping name is required"
			})
			.refine(
				(name) => {
					return !existingMappings.some(
						(mapping) =>
							mapping.mappingName.toLowerCase() === name.trim().toLowerCase() &&
							mapping.id !== currentMappingId
					);
				},
				{
					message: "A mapping with this name already exists"
				}
			),
		accountName: z.string().min(3, "Account name must be at least 3 characters"),
		includesHeader: z.boolean(),
		columnCount: z.number().min(1, "At least one column is required"),
		columnFieldMapping: z
			.array(columnFieldMappingSchema)
			.min(3, "At least 3 column mappings are required")
			.refine((mappings) => mappings.some((m) => m.fieldName === "Date"), {
				message: "A 'Date' field mapping is required"
			})
			.refine((mappings) => mappings.some((m) => m.fieldName === "Description"), {
				message: "A 'Description' field mapping is required"
			})
			.refine(
				(mappings) =>
					mappings.some((m) => m.fieldName === "Amount") ||
					(mappings.some((m) => m.fieldName === "Credit") && mappings.some((m) => m.fieldName === "Debit")),
				{
					message: "Either an 'Amount' field or both 'Credit' and 'Debit' fields are required"
				}
			)
			.refine(
				(mappings) => {
					return (
						new Set(mappings.filter((m) => m.fieldName && m.fieldName !== "None").map((m) => m.fieldName))
							.size === mappings.filter((m) => m.fieldName && m.fieldName !== "None").length
					);
				},
				{
					message: "Each column should map to unique field."
				}
			)
	});
};

export const createMappingSchema = mappingFormSchema([]).omit({
	columnCount: true
});

export const updateMappingSchema = createMappingSchema.extend({
	id: z.number().int().positive()
});

export const deleteMappingSchema = z.object({
	id: z.number().int().positive()
});
