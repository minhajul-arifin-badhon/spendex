import type React from "react";
import ListCategories from "@/components/list-categories";

export default async function Page() {
	console.log("------------------------------------GETCATEGORIES-----------");

	return (
		<>
			<ListCategories></ListCategories>
		</>
	);
}
