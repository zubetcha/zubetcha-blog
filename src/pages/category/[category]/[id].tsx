import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getAllPosts, getAllCategories } from '../../../utils/post';

import { NUMBER_OF_POSTS } from '../../../constants/post';
import { Post } from '../../../types/post';
import { ParsedUrlQuery } from 'querystring';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	categories: string;
}

export default function CategoryPage(props: Props) {
	console.log(props);
	return <div> CategoryPage</div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();

	const paths = getAllCategories(posts)
		.map((category, i) => {
			const filteredPosts = posts.filter(
				(post) => post.frontMatter.category === category,
			);

			return [
				...new Array(Math.round(filteredPosts.length / NUMBER_OF_POSTS)).keys(),
			].map((i) => ({ params: { category, id: `${i + 1}` } }));
		})
		.reduce((acc, val) => acc.concat(val), []);

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { category, id } = params as ParsedUrlQuery;

	const posts = await getAllPosts();
	const pageNo = parseInt(id as string);
	const filteredPosts = posts.filter(
		(post) => post.frontMatter.category === category,
	);
	const maximumPageNo = Math.ceil(filteredPosts.length / NUMBER_OF_POSTS);

	let slicedPosts;
	let hasMore;

	if (!params || !pageNo || isNaN(pageNo) || pageNo > maximumPageNo) {
		return { notFound: true };
	}

	if (params && typeof params.id === 'string') {
		const startIndex = (pageNo - 1) * NUMBER_OF_POSTS;
		const endIndex = startIndex + NUMBER_OF_POSTS;
		slicedPosts = filteredPosts.slice(startIndex, endIndex);
		hasMore = filteredPosts[endIndex] !== undefined ? true : false;
	}

	return {
		props: {
			posts: posts,
			category,
			hasMore,
			pageNo,
			params,
		},
	};
};
