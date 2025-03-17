"use server";

import { CreateSubcategoryProps, DeleteSubcategoryProps, Response, UpdateSubcategoryProps } from "@/app/types";
import { sendErrorResponse, sendResponse } from "../response";
import { prisma } from "../prisma";
import { auth } from "@clerk/nextjs/server";
import { createSubcategorySchema, deleteSubcategorySchema, updateSubcategorySchema } from "../validation";

export const createSubcategory = async (data: CreateSubcategoryProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = createSubcategorySchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		const newItem = await prisma.subcategory.create({
			data: data
		});

		return sendResponse(200, newItem.id.toString());
	} catch (error) {
		console.error("Error creating Subcategory:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};

export const updateSubcategory = async (data: UpdateSubcategoryProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = updateSubcategorySchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.subcategory.update({
			where: { id: data.id },
			data: {
				name: data.name
			}
		});

		return sendResponse(200, "Subcategory is successfully updated.");
	} catch (error) {
		console.error("Error updating Subcategory:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};

export const deleteSubcategory = async (data: DeleteSubcategoryProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = deleteSubcategorySchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.subcategory.delete({
			where: { id: data.id }
		});

		return sendResponse(200, "Subcategory is deleted successfully");
	} catch (error) {
		console.error("Error deleting Subcategory:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};
