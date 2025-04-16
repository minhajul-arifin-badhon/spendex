"use server";

import { CreateMerchantProps, DeleteMerchantProps, Response, UpdateMerchantProps } from "@/app/types";
import { auth } from "@clerk/nextjs/server";
import { sendErrorResponse, sendResponse } from "../response";
import { createMerchantSchema, deleteMerchantSchema, updateMerchantSchema } from "../validation";
import { prisma } from "../prisma";
import { Merchant } from "@prisma/client";
import { delay } from "../utils";
import _ from "lodash";

export const getMerchants = async (): Promise<Response<Merchant[]>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		// await delay(3000);

		console.log("pulling merchants");
		const merchants = await prisma.merchant.findMany({
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

		return sendResponse(200, merchants);
	} catch (error) {
		console.error("Error fetching merchants:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};

export const createMerchant = async (data: CreateMerchantProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(5000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = createMerchantSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		const isItem = await prisma.merchant.findFirst({
			where: {
				name: data.name,
				userId
			}
		});

		if (isItem) {
			return sendErrorResponse(400, "A merchant with that name already exists.");
		}

		const newMerchant = await prisma.merchant.create({
			data: { ...data, userId }
		});

		console.log(newMerchant);

		const result1 = await prisma.transaction.updateMany({
			where: {
				userId,
				merchantId: null,
				categoryId: null,
				subcategoryId: null,
				OR: newMerchant.includes.map((substring) => ({
					description: {
						contains: substring,
						mode: "insensitive"
					}
				}))
			},
			data: {
				merchantId: newMerchant.id,
				categoryId: newMerchant.categoryId,
				subcategoryId: newMerchant.subcategoryId
			}
		});

		const result2 = await prisma.transaction.updateMany({
			where: {
				userId,
				merchantId: null,
				OR: newMerchant.includes.map((substring) => ({
					description: {
						contains: substring,
						mode: "insensitive"
					}
				}))
			},
			data: {
				merchantId: newMerchant.id
			}
		});

		return sendResponse(
			200,
			`The merchant is created successfully and affected ${result1.count + result2.count} transactions`
		);
	} catch (error) {
		console.error("Error creating merchant:", error);
		return sendErrorResponse(500, "Failed To Create. \nInternal Server Error");
	}
};

export const updateMerchant = async (data: UpdateMerchantProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(3000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = updateMerchantSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		const merchant = await prisma.merchant.findUnique({
			where: { id: data.id }
		});

		let totalUpdated = 0;
		if (merchant?.categoryId != data.categoryId || merchant?.subcategoryId != data.subcategoryId) {
			const result = await prisma.transaction.updateMany({
				where: {
					merchantId: data.id,
					categoryId: merchant?.categoryId,
					subcategoryId: merchant?.subcategoryId
				},
				data: {
					categoryId: data.categoryId,
					subcategoryId: data.subcategoryId
				}
			});

			totalUpdated += result.count;
		}

		const includesChanged =
			merchant?.includes && !_.isEqual([...merchant?.includes].sort(), [...data.includes].sort());

		console.log("Current:", merchant?.includes);
		console.log("New", data.includes);
		console.log("includes changed", includesChanged);

		if (includesChanged) {
			if (merchant.includes.length > 0) {
				// updateing the transactions that were surely influenced by the merchant attributes.
				const result1 = await prisma.transaction.updateMany({
					where: {
						merchantId: merchant.id,
						categoryId: merchant.categoryId,
						subcategoryId: merchant.subcategoryId,
						OR: merchant.includes.map((substring) => ({
							description: {
								contains: substring,
								mode: "insensitive"
							}
						}))
					},
					data: {
						merchantId: null,
						categoryId: null,
						subcategoryId: null
					}
				});

				// updateing the transactions that where only the merchant was set, (category and subcategory are not same as merchant settings).
				const result2 = await prisma.transaction.updateMany({
					where: {
						merchantId: merchant.id,
						OR: merchant.includes.map((substring) => ({
							description: {
								contains: substring,
								mode: "insensitive"
							}
						}))
					},
					data: {
						merchantId: null
					}
				});

				totalUpdated += result1.count + result2.count;
			}

			if (data.includes.length > 0) {
				const result1 = await prisma.transaction.updateMany({
					where: {
						merchantId: null,
						categoryId: null,
						subcategoryId: null,
						OR: data.includes.map((substring) => ({
							description: {
								contains: substring,
								mode: "insensitive"
							}
						}))
					},
					data: {
						merchantId: data.id,
						categoryId: data.categoryId,
						subcategoryId: data.subcategoryId
					}
				});

				totalUpdated += result1.count;

				const result2 = await prisma.transaction.updateMany({
					where: {
						merchantId: null,
						OR: data.includes.map((substring) => ({
							description: {
								contains: substring,
								mode: "insensitive"
							}
						}))
					},
					data: {
						merchantId: data.id
					}
				});

				totalUpdated += result2.count;
			}
		}

		await prisma.merchant.update({
			where: { id: data.id },
			data: data
		});

		return sendResponse(200, `Merchant is successfully updated and affected ${totalUpdated} transactions`);
	} catch (error) {
		console.error("Error updating merchant:", error);
		return sendErrorResponse(500, "Failed To Update. \n Internal Server Error");
	}
};

export const deleteMerchant = async (data: DeleteMerchantProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = deleteMerchantSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		const merchant = await prisma.merchant.findUnique({
			where: { id: data.id }
		});

		if (!merchant) {
			return sendErrorResponse(400, "Merchant not found.");
		}

		const transactionUpdated = await prisma.transaction.updateMany({
			where: {
				merchantId: merchant.id,
				categoryId: merchant.categoryId,
				subcategoryId: merchant.subcategoryId
			},
			data: {
				categoryId: null,
				subcategoryId: null
			}
		});

		await prisma.merchant.delete({
			where: { id: data.id }
		});

		return sendResponse(
			200,
			`Merchant is deleted successfully and affected ${transactionUpdated.count} transactions.`
		);
	} catch (error) {
		console.error("Error deleting merchant:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};
