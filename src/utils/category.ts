import { Post } from '@type/post';

export const getAllCategories = (posts: Array<Post>) => {
	const categories = posts.map((post) => post.frontMatter.category);
	console.log(categories);
	return ['all', ...new Set(categories)];
};

export const getUpperCategory = (category: string) => {
	const firstChar = category.substring(0, 1);

	return category.replace(firstChar, firstChar.toUpperCase());
};
