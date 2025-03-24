"use server";

import { CreateMerchantProps, DeleteMerchantProps, Response, UpdateMerchantProps } from "@/app/types";
import { auth } from "@clerk/nextjs/server";
import { sendErrorResponse, sendResponse } from "../response";
import { createMerchantSchema, deleteMerchantSchema, updateMerchantSchema } from "../validation";
import { prisma } from "../prisma";
import { Merchant } from "@prisma/client";

export const getMerchants = async (): Promise<Response<Merchant[]>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		// await delay(5000);

		console.log("pulling merchants");
		const merchants = await prisma.merchant.findMany({
			where: { userId },
			orderBy: {
				id: "asc"
			}
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
				name: data.name
			}
		});

		if (isItem) {
			return sendErrorResponse(400, "A merchant with that name already exists.");
		}

		const newItem = await prisma.merchant.create({
			data: { ...data, userId }
		});

		console.log(newItem);

		return sendResponse(200, "The merchant is created successfully.");
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

		await prisma.merchant.update({
			where: { id: data.id },
			data: data
		});

		return sendResponse(200, "Merchant is successfully updated.");
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

		await prisma.merchant.delete({
			where: { id: data.id }
		});

		console.log("Server: deleted");
		return sendResponse(200, "Merchant is deleted successfully");
	} catch (error) {
		console.error("Error deleting merchant:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};
