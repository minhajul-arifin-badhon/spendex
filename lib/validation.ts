import { CategoryGroup, Mapping, Merchant } from "@prisma/client";
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

export const columnFieldMappingSchema = z.object({
	columnIndex: z.number(),
	fieldName: z.string()
});

export const getBaseMappingSchema = (existingMappings: Mapping[] = [], currentMappingId?: number) =>
	z.object({
		mappingName: z
			.string()
			.min(3, "Mapping name must be at least 3 characters")
			.refine((val) => val.trim().length > 0, {
				message: "Mapping name is required"
			})
			.refine(
				(name) =>
					!existingMappings.some(
						(mapping) =>
							mapping.mappingName.toLowerCase() === name.trim().toLowerCase() &&
							mapping.id !== currentMappingId
					),
				{
					message: "A mapping with this name already exists"
				}
			),
		accountName: z.string().min(3, "Account name must be at least 3 characters"),
		includesHeader: z.boolean(),
		columnCount: z.number().min(1, "At least one column is required"),
		negativeAmountMeans: z.string().or(z.literal("")),
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
					const filtered = mappings.filter((m) => m.fieldName && m.fieldName !== "None");
					return new Set(filtered.map((m) => m.fieldName)).size === filtered.length;
				},
				{
					message: "Each column should map to unique field."
				}
			)
	});

export const mappingFormSchema = (existingMappings: Mapping[] = [], currentMappingId?: number) =>
	getBaseMappingSchema(existingMappings, currentMappingId).refine(
		(data) => {
			const isAccount = data.columnFieldMapping.some((field) => field.fieldName == "Account");
			return !isAccount || (isAccount && data.negativeAmountMeans);
		},
		{
			message: "Please, select what a negative amount means.",
			path: ["negativeAmountMeans"]
		}
	);

export const createMappingSchema = getBaseMappingSchema([]).omit({
	columnCount: true
});

export const updateMappingSchema = createMappingSchema.extend({
	id: z.number().int().positive()
});

export const deleteMappingSchema = z.object({
	id: z.number().int().positive()
});

export const merchantFormSchema = (existingMerchants: Merchant[] = [], currentMerchantId?: number) => {
	return z.object({
		name: z
			.string()
			.min(3, "Merchant name must be at least 3 characters")
			.refine((val) => val.trim().length > 0, {
				message: "Merchant name is required"
			})
			.refine(
				(name) => {
					return !existingMerchants.some(
						(merchant) =>
							merchant.name.toLowerCase() === name.trim().toLowerCase() &&
							merchant.id !== currentMerchantId
					);
				},
				{
					message: "A merchant with this name already exists"
				}
			),
		includes: z.array(z.string()).refine((values) => values.length > 0, {
			message: "Please, add at least one substring that defines the merchant."
		}),
		categorySelection: z
			.object({
				type: z.enum(["category", "subcategory"]),
				id: z.number(),
				categoryId: z.number().optional(),
				name: z.string()
			})
			.nullable()
	});
};

export const createMerchantSchema = z.object({
	name: z.string().nonempty("Name cannot be empty"),
	categoryId: z.number().int().positive().nullable(),
	subcategoryId: z.number().int().positive().nullable(),
	includes: z.array(z.string()).min(1, { message: "Includes cannot be empty" })
});

export const updateMerchantSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().nonempty("Name cannot be empty"),
	categoryId: z.number().int().positive().nullable(),
	subcategoryId: z.number().int().positive().nullable(),
	includes: z.array(z.string()).min(1, { message: "Includes cannot be empty" })
});

export const deleteMerchantSchema = z.object({
	id: z.number().int().positive()
});

export const transactionFormSchema = z.object({
	date: z.date({
		required_error: "A date is required"
	}),
	amount: z.coerce.number().refine((value) => value !== undefined && value !== null, {
		message: "Amount is required"
	}),
	merchant: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	categorySelection: z
		.object({
			type: z.enum(["category", "subcategory"]),
			id: z.number(),
			categoryId: z.number().optional(),
			name: z.string()
		})
		.nullable(),
	description: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	accountName: z.string().min(3, "Please enter at least 3 characters").or(z.literal(""))
});

const transactionBaseSchema = {
	date: z.date({
		required_error: "A date is required."
	}),
	amount: z.number({ message: "An amount is required." }),
	categoryId: z.number().int().positive().nullable(),
	subcategoryId: z.number().int().positive().nullable(),
	merchant: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	description: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	accountName: z.string().min(3, "Please enter at least 3 characters").or(z.literal(""))
};

export const createTransactionSchema = z.object({
	...transactionBaseSchema
});

export const updateTransactionSchema = z.object({
	id: z.number().int().positive(),
	...transactionBaseSchema
});

export const deleteTransactionSchema = z.object({
	id: z.number().int().positive()
});

export const importFormSchema = z.object({
	file: z.instanceof(File, { message: "Please select a file to import" }),
	accountName: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	mappingId: z.string().optional(),
	includesHeader: z.boolean().default(true)
});

export const getmMppingFormSchemaWithFilePreview = (existingMappings: Mapping[] = []) => {
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
						(mapping) => mapping.mappingName.toLowerCase() === name.trim().toLowerCase()
					);
				},
				{
					message: "A mapping with this name already exists"
				}
			),
		accountName: z.string().min(3, "Please enter at least 3 characters"),
		includesHeader: z.boolean(),
		negativeAmountMeans: z.string().or(z.literal("")),
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

export const mappingFormSchemaWithFilePreview = (existingMappings: Mapping[] = []) =>
	getmMppingFormSchemaWithFilePreview(existingMappings).refine(
		(data) => {
			const isAccount = data.columnFieldMapping.some((field) => field.fieldName == "Account");
			return !isAccount || (isAccount && data.negativeAmountMeans);
		},
		{
			message: "Please, select what a negative amount means.",
			path: ["negativeAmountMeans"]
		}
	);
