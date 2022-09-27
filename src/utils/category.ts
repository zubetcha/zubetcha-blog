import { Post } from '@type/post';

export const getAllCategories = (posts: Array<Post>) => {
	const categories = posts.map((post) => post.frontMatter.category);
	console.log(categories);
	return ['all', ...new Set(categories)];
};
