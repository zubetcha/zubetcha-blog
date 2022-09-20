import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getAllPosts } from '../../utils/post';

import { NUMBER_OF_POSTS } from '../../constants/post';
import { PostCard } from '../../components';
import { Post } from '../../types/post';
import { ParsedUrlQuery } from 'querystring';

interface Props {
	posts: Array<Post>;
	hasMore: boolean;
	pageNo: number;
}

const PostListPage = ({ posts, hasMore, pageNo }: Props) => {
	// console.log(props);
	return (
		<div>
			{posts.map((post) => (
				<PostCard post={post} />
			))}
			{hasMore && <div>다음 페이지: {pageNo + 1}</div>}
		</div>
	);
};

export default PostListPage;

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
	const pageNo = parseInt(id as string);
	const maximumPageNo = Math.ceil(posts.length / NUMBER_OF_POSTS);

	let slicedPosts;
	let hasMore;

	if (!params || !pageNo || isNaN(pageNo) || pageNo > maximumPageNo) {
		return { notFound: true };
	}

	if (params && typeof params.id === 'string') {
		const startIndex = (parseInt(params.id) - 1) * NUMBER_OF_POSTS;
		const endIndex = startIndex + NUMBER_OF_POSTS;
		slicedPosts = posts.slice(startIndex, endIndex);
		hasMore = posts[endIndex] !== undefined ? true : false;
	}

	return {
		props: {
			posts: slicedPosts,
			hasMore,
			pageNo,
		},
	};
};
