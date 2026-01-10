"use server";

import {
	CreateTransactionProps,
	DeleteAllTransactionsProps,
	DeleteTransactionProps,
	Response,
	TransactionWithRelations,
	UpdateTransactionProps
} from "@/app/types";
import { auth } from "@clerk/nextjs/server";
import { sendErrorResponse, sendResponse } from "../response";
import {
	createTransactionSchema,
	deleteAllTransactionsSchema,
	deleteTransactionSchema,
	updateTransactionSchema
} from "../validation";
import { prisma } from "../prisma";
import { Merchant, Transaction } from "@prisma/client";
import { delay } from "../utils";
import { z } from "zod";
import { mockTransactions } from "../constants";

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

export const getTransactionsWithRelations = async (): Promise<Response<TransactionWithRelations[]>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		// await delay(3000);

		console.log("pulling transactions");

		// const transactions = mockTransactions;

		const transactions = await prisma.transaction.findMany({
			where: { userId },
			select: {
				id: true,
				amount: true,
				date: true,
				accountName: true,
				description: true,
				categoryId: true,
				subcategoryId: true,
				merchantId: true,
				userId: true,
				createdAt: true,
				updatedAt: true,
				category: {
					select: {
						id: true,
						name: true,
						group: true
					}
				},
				subcategory: {
					select: {
						id: true,
						name: true
					}
				},
				merchant: {
					select: {
						id: true,
						name: true
					}
				}
			},
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

async function getMerchant(merchantName: string, userId: string): Promise<Merchant | null> {
	if (merchantName) {
		// Try to find the merchant by name
		const merchant = await prisma.merchant.findFirst({
			where: {
				name: merchantName,
				userId
			}
		});

		if (merchant) {
			// If the merchant exists, return its id
			return merchant;
		} else {
			// If the merchant does not exist, create a new one
			const newMerchant = await prisma.merchant.create({
				data: {
					name: merchantName,
					includes: [merchantName],
					userId: userId
				}
			});

			// Return the id of the newly created merchant
			if (newMerchant) return merchant;
		}
	}

	return null;
}

export const createTransaction = async (data: CreateTransactionProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(5000);

		if (!userId) return sendErrorResponse(401, "No user is signed in.");

		const result = createTransactionSchema.safeParse(data);

		if (!result.success) return sendErrorResponse(400, JSON.stringify(result.error.errors));
		// Before creating, check for duplicates
		const existingTransactions = await prisma.transaction.findMany({
			where: {
				userId: userId
			},
			select: {
				date: true,
				amount: true,
				accountName: true,
				description: true
			}
		});

		const isDuplicate = existingTransactions.some((tx) => {
			return (
				tx.date.getTime() === new Date(data.date).getTime() &&
				tx.amount === data.amount &&
				tx.accountName === data.accountName &&
				tx.description === data.description
			);
		});

		if (isDuplicate) {
			console.log("Duplicate transaction detected:", {
				date: data.date,
				amount: data.amount,
				accountName: data.accountName,
				description: data.description
			});

			return sendErrorResponse(409, "Duplicate transaction detected.");
		}

		let merchant = await getMerchant(data.merchant, userId);

		if (!merchant && data.description) {
			const merchants = await prisma.merchant.findMany({
				where: { userId }
			});

			const normalizedDescription = data.description.toLowerCase();

			merchant =
				merchants.find((m) =>
					m.includes.some((substr) => normalizedDescription.includes(substr.toLowerCase()))
				) ?? null;
		}

		const { merchant: merchantName, ...newTransaction } = data;
		console.log(merchantName);

		const newItem = await prisma.transaction.create({
			data: {
				...newTransaction,
				merchantId: merchant?.id ?? null,
				categoryId: newTransaction.categoryId ?? merchant?.categoryId,
				subcategoryId: newTransaction.subcategoryId ?? merchant?.subcategoryId,
				userId: userId
			}
		});

		console.log(newItem);

		return sendResponse(200, "The transaction is created successfully.");
	} catch (error) {
		console.error("Error creating transaction:", error);
		return sendErrorResponse(500, "Failed To Create. \nInternal Server Error");
	}
};

export const createManyTransactions = async (data: CreateTransactionProps[]): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) return sendErrorResponse(401, "No user is signed in.");

		const result = z.array(createTransactionSchema).safeParse(data);

		if (!result.success) return sendErrorResponse(400, JSON.stringify(result.error.errors));

		const merchants = await prisma.merchant.findMany({
			where: { userId }
		});

		// Pull all existing transactions for this user
		const existingTransactions = await prisma.transaction.findMany({
			where: { userId },
			select: {
				date: true,
				accountName: true,
				description: true,
				amount: true
			}
		});

		// Create a Set of serialized transaction keys for fast lookup
		const existingTransactionKeys = new Set(
			existingTransactions.map(
				(t) =>
					`${new Date(t.date).toISOString().split("T")[0]}|${(t.accountName ?? "").toLowerCase()}|${(
						t.description ?? ""
					).toLowerCase()}|${Number(t.amount)}`
			)
		);

		// Filter data to remove duplicates
		const filteredData = data.filter((tx) => {
			const key = `${new Date(tx.date).toISOString().split("T")[0]}|${(tx.accountName ?? "").toLowerCase()}|${(
				tx.description ?? ""
			).toLowerCase()}|${Number(tx.amount)}`;
			return !existingTransactionKeys.has(key);
		});

		const duplicatesCount = data.length - filteredData.length;
		console.log(`Duplicates found: ${duplicatesCount}`);

		let transactionsInserted = 0;
		if (filteredData.length === 0) {
			return sendResponse(
				200,
				duplicatesCount > 0
					? `All provided transactions are duplicates. (${duplicatesCount} duplicates found, 0 inserted.)`
					: "No new transactions to import."
			);
		}

		const transactionsToInsert = filteredData.map(({ merchant, ...transaction }) => {
			const matchedMerchant = merchants.find((m) =>
				m.includes.some((substr) => transaction.description.toLowerCase().includes(substr.toLowerCase()))
			);

			return {
				...transaction,
				merchantId: matchedMerchant?.id ?? null,
				categoryId: matchedMerchant?.categoryId,
				subcategoryId: matchedMerchant?.subcategoryId,
				userId: userId
			};
		});

		await prisma.transaction.createMany({
			data: transactionsToInsert
		});
		transactionsInserted = transactionsToInsert.length;

		let msg = `Imported ${transactionsInserted} transaction${transactionsInserted !== 1 ? "s" : ""} successfully.`;
		if (duplicatesCount > 0) {
			msg += ` ${duplicatesCount} duplicate transaction${duplicatesCount !== 1 ? "s were" : " was"} skipped.`;
		}

		return sendResponse(200, msg);
	} catch (error) {
		console.error("Error creating transaction:", error);
		return sendErrorResponse(500, "Failed To Create. \nInternal Server Error");
	}
};

export const updateTransaction = async (data: UpdateTransactionProps): Promise<Response<string>> => {
	try {
		console.log("updating transactions in server");
		const { userId } = await auth();
		// await delay(3000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = updateTransactionSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		console.log(data);
		const merchant = await getMerchant(data.merchant, userId);
		const { merchant: merchantName, ...transactionData } = data;
		console.log(merchant);

		await prisma.transaction.update({
			where: { id: data.id },
			data: {
				...transactionData,
				merchantId: merchant?.id ?? null,
				categoryId: transactionData.categoryId ?? merchant?.categoryId,
				subcategoryId: transactionData.subcategoryId ?? merchant?.subcategoryId
			}
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

export const deleteAllTransactions = async (data: DeleteAllTransactionsProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = deleteAllTransactionsSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.transaction.deleteMany({
			where: { userId: userId }
		});

		console.log("Server: deleted");
		return sendResponse(200, "All Transactions are deleted successfully");
	} catch (error) {
		console.error("Error deleting all transactions:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};
