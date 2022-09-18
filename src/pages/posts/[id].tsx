import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { getAllPosts } from '../../utils/post';
import { NUMBER_OF_POSTS } from '../../constants/post';

const PostListPage: NextPage = (props) => {
	console.log(props);
	return <div>PostListPage</div>;
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
	const posts = await getAllPosts();

	return {
		props: {
			params,
		},
	};
};
