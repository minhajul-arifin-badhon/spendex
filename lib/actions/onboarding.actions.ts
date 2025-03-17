import { CategoryGroup } from "@prisma/client";
import { initialCategories } from "../predefined_data";
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
					userId: userId,
				});
			});
		});

		console.log("Trying to create categories");

		const categories = await prisma.category.createManyAndReturn({
			data: categoriesData,
			select: {
				id: true,
				name: true,
			},
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
						categoryId: categoriesToId[category.name],
					});
				});
			});
		});

		console.log("Trying to create subcategories");

		await prisma.subcategory.createMany({
			data: subcategoriesData,
		});

		console.log("created subcategories");
	} catch (error) {
		console.log(error);
	}
};
