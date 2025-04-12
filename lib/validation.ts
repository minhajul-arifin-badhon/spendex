import { z } from "zod";

const transactionBaseSchema = {
	date: z.date({
		required_error: "A date is required."
	}),
	amount: z.coerce.number({ message: "An amount is required." }),
	merchant: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	category: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	subcategory: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	description: z.string().min(3, "Please enter at least 3 characters").or(z.literal("")),
	accountName: z.string().min(3, "Please enter at least 3 characters").or(z.literal(""))
};

export const transactionFormSchema = z.object({
	...transactionBaseSchema
});

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
