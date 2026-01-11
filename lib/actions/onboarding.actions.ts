import { CategoryGroup } from "@prisma/client";
import { initialCategories, initialMappings, initialMerchants } from "../predefined_data";
import { prisma } from "../prisma";

interface createCategorySchema {
	name: string;
	group: CategoryGroup;
	userId: string;
}

interface createSubcategorySchema {
	name: string;
	categoryId: number;
}

type Item = { id: number; name: string };

const createNameIdMap = (items: Item[]): Record<string, number> => {
	return items.reduce((map: Record<string, number>, item) => {
		map[item.name.toLowerCase()] = item.id;
		return map;
	}, {});
};

export const createPredefinedCategories = async (userId: string) => {
	// Insert predefined categories and subcategories for the new user
	try {
		const categoriesData: createCategorySchema[] = [];
		const subcategoriesData: createSubcategorySchema[] = [];

		Object.keys(initialCategories).forEach((group) => {
			initialCategories[group as CategoryGroup].forEach((category) => {
				categoriesData.push({
					name: category.name,
					group: group as CategoryGroup,
					userId: userId
				});
			});
		});

		console.log("Trying to create categories");

		const categories = await prisma.category.createManyAndReturn({
			data: categoriesData,
			select: {
				id: true,
				name: true
			}
		});

		console.log("created categories");

		const categoriesToId: { [key: string]: number } = {};
		categories.forEach((category) => {
			categoriesToId[category.name] = category.id;
		});

		Object.keys(initialCategories).forEach((group) => {
			initialCategories[group as CategoryGroup].forEach((category) => {
				category.subcategories.forEach((subcategory) => {
					subcategoriesData.push({
						name: subcategory.name,
						categoryId: categoriesToId[category.name]
					});
				});
			});
		});

		console.log("Trying to create subcategories");

		const subcategories = await prisma.subcategory.createManyAndReturn({
			data: subcategoriesData,
			select: {
				id: true,
				name: true
			}
		});

		console.log("created subcategories");

		return {
			categories: categories,
			subcategories: subcategories
		};
	} catch (error) {
		console.log(error);
	}
};

export const createPredefinedMappings = async (userId: string) => {
	// Insert predefined mappings for the new user
	try {
		console.log("Creating mappings...");
		const mappingsWithUserId = initialMappings.map((mapping) => ({
			...mapping,
			userId: userId
		}));

		await prisma.mapping.createMany({
			data: mappingsWithUserId
		});

		console.log("created mappings");
	} catch (error) {
		console.log(error);
	}
};

export const createPredefinedMerchants = async (userId: string, categories: Item[], subcategories: Item[]) => {
	// Insert predefined merchants for the new user
	try {
		const categoriesNameIdMap = createNameIdMap(categories);
		const subcategoriesNameIdMap = createNameIdMap(subcategories);

		let categoryName, subcategoryName;

		const merchants = initialMerchants.map((merchant) => {
			categoryName = merchant.category.toLowerCase();
			subcategoryName = merchant.subcategory?.toLowerCase();

			return {
				userId: userId,
				name: merchant.name,
				categoryId: categoryName in categoriesNameIdMap ? categoriesNameIdMap[categoryName] : null,
				subcategoryId:
					subcategoryName && subcategoryName in subcategoriesNameIdMap
						? subcategoriesNameIdMap[subcategoryName]
						: null,
				includes: merchant.includes
			};
		});

		await prisma.merchant.createMany({
			data: merchants
		});

		console.log("created merchants");
	} catch (error) {
		console.log(error);
	}
};
