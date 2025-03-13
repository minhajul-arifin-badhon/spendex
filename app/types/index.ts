export interface Subcategory {
	id: string;
	name: string;
}

export interface Category {
	id: string;
	name: string;
	subcategories: Subcategory[];
}

export interface CategoryGroup {
	id: string;
	name: string;
	categories: Category[];
}
