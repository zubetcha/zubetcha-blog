import { GetStaticPaths, GetStaticProps } from 'next';

import { getAllPosts } from '../../utils/post';

export const PostListPage = () => {
	return <div>PostListPage</div>;
};

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();

	const paths = [...new Array(Math.round(posts.length / 10)).keys()].map(
		(i) => ({ params: { id: `${i + 1}` } }),
	);

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps = async () => {};
