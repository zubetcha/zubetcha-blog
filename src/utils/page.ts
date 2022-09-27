import { getAllCategories } from './category';
import { NUMBER_OF_POSTS } from '@constants/post';
import { Post } from '@type/post';

export const getPageInfo = ({
	id,
	posts,
}: {
	id: string | string[] | undefined;
	posts: Array<Post>;
}) => {
	const pageNo = parseInt(id as string);
	const maximumPageNo = Math.ceil(posts.length / NUMBER_OF_POSTS);

	const startIndex = (pageNo - 1) * NUMBER_OF_POSTS;
	const endIndex = startIndex + NUMBER_OF_POSTS;
	const slicedPosts = posts.slice(startIndex, endIndex);
	const hasMore = posts[endIndex] !== undefined ? true : false;

	const categories = getAllCategories(posts);

	return {
		pageNo,
		maximumPageNo,
		slicedPosts,
		hasMore,
		categories,
	};
};
