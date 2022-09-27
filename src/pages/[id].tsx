import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getAllPosts } from '@utils/post';
import { getPageInfo } from '@utils/page';
import { PostListPageContainer } from '@container/index';
import { NUMBER_OF_POSTS } from '@constants/post';
import { Post } from 'src/type/post';
import { ParsedUrlQuery } from 'querystring';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
	categories: Array<string>;
}

export default function PostListPage(props: Props) {
	return <PostListPageContainer {...props} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();

	const paths = [
		...new Array(Math.round(posts.length / NUMBER_OF_POSTS)).keys(),
	].map((i) => ({ params: { id: `${i + 1}` } }));

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { id } = params as ParsedUrlQuery;

	const posts = await getAllPosts();
	const { pageNo, maximumPageNo, slicedPosts, hasMore, categories } =
		getPageInfo({
			id,
			posts,
		});

	if (!params || !pageNo || isNaN(pageNo) || pageNo > maximumPageNo) {
		return { notFound: true };
	}

	return {
		props: {
			posts: slicedPosts,
			categories,
			hasMore,
			pageNo,
		},
	};
};
