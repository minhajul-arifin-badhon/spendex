"use server";

import {
	CategoriesWithSub,
	CreateCategoryProps,
	DeleteCategoryProps,
	Response,
	UpdateCategoryProps
} from "@/app/types";
import { sendErrorResponse, sendResponse } from "../response";
import { prisma } from "../prisma";
import { auth } from "@clerk/nextjs/server";
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from "../validation";

export const getCategories = async (): Promise<Response<CategoriesWithSub[]>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		// await delay(5000);

		console.log("pulling categories");
		const categories = await prisma.category.findMany({
			where: { userId },
			select: {
				id: true,
				name: true,
				group: true,
				subcategories: {
					select: {
						id: true,
						name: true
					},
					orderBy: {
						id: "asc"
					}
				}
			},
			orderBy: {
				id: "asc"
			}
		});

		return sendResponse(200, categories);
	} catch (error) {
		console.error("Error fetching transactions:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};

export const createCategory = async (data: CreateCategoryProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(5000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = createCategorySchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		const isItem = await prisma.category.findFirst({
			where: {
				name: data.name,
				userId
			}
		});

		if (isItem) {
			return sendErrorResponse(400, "A category with that name already exists.");
		}

		const newItem = await prisma.category.create({
			data: { ...data, userId }
		});

		return sendResponse(200, newItem.id.toString());
	} catch (error) {
		console.error("Error creating category:", error);
		return sendErrorResponse(500, "Failed To Create. \nInternal Server Error");
	}
};

export const updateCategory = async (data: UpdateCategoryProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(3000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = updateCategorySchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.category.update({
			where: { id: data.id },
			data: {
				name: data.name
			}
		});

		return sendResponse(200, "Category is successfully updated.");
	} catch (error) {
		console.error("Error updating category:", error);
		return sendErrorResponse(500, "Failed To Update. \n Internal Server Error");
	}
};

export const deleteCategory = async (data: DeleteCategoryProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = deleteCategorySchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.category.delete({
			where: { id: data.id }
		});

		console.log("Server: deleted");
		return sendResponse(200, "Category is deleted successfully");
	} catch (error) {
		console.error("Error deleting Category:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};
