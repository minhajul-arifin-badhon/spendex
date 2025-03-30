"use server";

import { CreateTransactionProps, DeleteTransactionProps, Response, UpdateTransactionProps } from "@/app/types";
import { auth } from "@clerk/nextjs/server";
import { sendErrorResponse, sendResponse } from "../response";
import { createTransactionSchema, deleteTransactionSchema, updateTransactionSchema } from "../validation";
import { prisma } from "../prisma";
import { Transaction } from "@prisma/client";
import { delay } from "../utils";

export const getTransactions = async (): Promise<Response<Transaction[]>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		// await delay(3000);

		console.log("pulling transactions");
		const transactions = await prisma.transaction.findMany({
			where: { userId },
			orderBy: [
				{
					updatedAt: "desc"
				},
				{
					id: "asc"
				}
			]
		});

		return sendResponse(200, transactions);
	} catch (error) {
		console.error("Error fetching transactions:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};

export const createTransaction = async (data: CreateTransactionProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(5000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = createTransactionSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		// const isItem = await prisma.transaction.findFirst({
		// where: {
		// name: data.name
		// }
		// });

		// if (isItem) {
		// return sendErrorResponse(400, "A transaction with that name already exists.");
		// }

		const newItem = await prisma.transaction.create({
			data: { ...data, userId }
		});

		console.log(newItem);

		return sendResponse(200, "The transaction is created successfully.");
	} catch (error) {
		console.error("Error creating transaction:", error);
		return sendErrorResponse(500, "Failed To Create. \nInternal Server Error");
	}
};

export const updateTransaction = async (data: UpdateTransactionProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(3000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = updateTransactionSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.transaction.update({
			where: { id: data.id },
			data: data
		});

		return sendResponse(200, "Transaction is successfully updated.");
	} catch (error) {
		console.error("Error updating transaction:", error);
		return sendErrorResponse(500, "Failed To Update. \n Internal Server Error");
	}
};

export const deleteTransaction = async (data: DeleteTransactionProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = deleteTransactionSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.transaction.delete({
			where: { id: data.id }
		});

		console.log("Server: deleted");
		return sendResponse(200, "Transaction is deleted successfully");
	} catch (error) {
		console.error("Error deleting transaction:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};
