import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
	createPredefinedCategories,
	createPredefinedMappings,
	createPredefinedMerchants
} from "@/lib/actions/onboarding.actions";

export async function POST(req: Request) {
	const SIGNING_SECRET = process.env.SIGNING_SECRET;

	if (!SIGNING_SECRET) {
		throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env");
	}

	// Create new Svix instance with secret
	const wh = new Webhook(SIGNING_SECRET);

	// Get headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error: Missing Svix headers", {
			status: 400
		});
	}

	// Get body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	let evt: WebhookEvent;

	// Verify payload with headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error: Could not verify webhook:", err);
		return new Response("Error: Verification error", {
			status: 400
		});
	}

	const { id } = evt.data;
	const eventType = evt.type;
	console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
	console.log("Webhook payload:", body);

	if (eventType === "user.created" || eventType === "user.updated") {
		const { id, email_addresses, first_name, last_name } = evt.data;

		const data = {
			id: id,
			email: email_addresses[0].email_address,
			fullName: first_name + " " + last_name
		};

		try {
			const user = await prisma.user.upsert({
				where: { id },
				create: data,
				update: data
			});

			const response = await createPredefinedCategories(id);
			await createPredefinedMerchants(id, response!.categories, response!.subcategories);
			await createPredefinedMappings(id);

			return new Response(JSON.stringify(user), {
				status: 201
			});
		} catch (error) {
			console.error("Error: Failed to store event in the database:", error);
			return new Response("Error: Failed to store event in the database", {
				status: 500
			});
		}
	}

	if (eventType == "user.deleted") {
		try {
			const userExists = await prisma.user.findUnique({
				where: { id: id }
			});

			if (!userExists) {
				return new Response("User is not found", {
					status: 500
				});
			}

			// If the user exists, delete the user
			await prisma.user.delete({
				where: { id: id }
			});

			console.log("User is deleted");

			return new Response("Webhook User deleted successfully", {
				status: 200
			});
		} catch (error) {
			console.error(error);
			return new Response("Failed to delete user.", {
				status: 500
			});
		}
	}

	return new Response("Webhook received", { status: 200 });
}
