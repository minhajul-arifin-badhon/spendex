"use server";

import { CreateMappingProps, DeleteMappingProps, Response, UpdateMappingProps } from "@/app/types";
import { auth } from "@clerk/nextjs/server";
import { sendErrorResponse, sendResponse } from "../response";
import { createMappingSchema, deleteMappingSchema, updateMappingSchema } from "../validation";
import { prisma } from "../prisma";
import { Mapping } from "@prisma/client";
import { delay } from "../utils";

export const getMappings = async (): Promise<Response<Mapping[]>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		// await delay(5000);

		console.log("pulling mappings");
		const mappings = await prisma.mapping.findMany({
			where: { userId },
			orderBy: {
				id: "asc"
			}
		});

		return sendResponse(200, mappings);
	} catch (error) {
		console.error("Error fetching transactions:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};

export const createMapping = async (data: CreateMappingProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(5000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = createMappingSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		const isItem = await prisma.mapping.findFirst({
			where: {
				mappingName: data.mappingName
			}
		});

		if (isItem) {
			return sendErrorResponse(400, "A mapping with that name already exists.");
		}

		const newItem = await prisma.mapping.create({
			data: { ...data, userId }
		});

		return sendResponse(200, "The mapping is created successfully.");
	} catch (error) {
		console.error("Error creating mapping:", error);
		return sendErrorResponse(500, "Failed To Create. \nInternal Server Error");
	}
};

export const updateMapping = async (data: UpdateMappingProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();
		// await delay(3000);

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = updateMappingSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.mapping.update({
			where: { id: data.id },
			data: data
		});

		return sendResponse(200, "Mapping is successfully updated.");
	} catch (error) {
		console.error("Error updating mapping:", error);
		return sendErrorResponse(500, "Failed To Update. \n Internal Server Error");
	}
};

export const deleteMapping = async (data: DeleteMappingProps): Promise<Response<string>> => {
	try {
		const { userId } = await auth();

		if (!userId) {
			return sendErrorResponse(401, "No user is signed in.");
		}

		const result = deleteMappingSchema.safeParse(data);

		if (!result.success) {
			return sendErrorResponse(400, JSON.stringify(result.error.errors));
		}

		await prisma.mapping.delete({
			where: { id: data.id }
		});

		console.log("Server: deleted");
		return sendResponse(200, "Mapping is deleted successfully");
	} catch (error) {
		console.error("Error deleting mapping:", error);
		return sendErrorResponse(500, "Internal Server Error");
	}
};
