import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
	getAllPosts,
	getAllCategories,
	getPageInfo,
	getUpperCategory,
} from '@utils/index';
import { PostListPageContainer } from '@container/index';

import { NUMBER_OF_POSTS } from '@constants/post';
import { Post } from '@type/post';
import { ParsedUrlQuery } from 'querystring';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	category: string;
}

export default function CategoryPage({ category, ...props }: Props) {
	const title = getUpperCategory(category);
	return <PostListPageContainer {...props} title={title} />;
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
	const filteredPosts = posts.filter(
		(post) => post.frontMatter.category === category,
	);
	const { pageNo, maximumPageNo, slicedPosts, hasMore } = getPageInfo({
		id,
		posts: filteredPosts,
	});

	if (!params || !pageNo || isNaN(pageNo) || pageNo > maximumPageNo) {
		return { notFound: true };
	}

	return {
		props: {
			posts: slicedPosts,
			category,
			hasMore,
			pageNo,
		},
	};
};
