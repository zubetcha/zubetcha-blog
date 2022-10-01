import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Post } from '@type/post';
import { getAllPosts } from '@utils/index';

interface Props {
	post: Post;
}
export default function PostPage(props: Props) {
	console.log(props);
	return <div>[slug]</div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
	const posts = await getAllPosts();

	const paths = posts.map(({ fields }) => {
		const [year, month, slug] = fields.slug.split('/');
		return { params: { year, month, slug } };
	});

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { year, month, slug } = params as ParsedUrlQuery;

	const posts = await getAllPosts();
	const post = posts.find(
		({ fields }) => fields.slug === [year, month, slug].join('/'),
	);

	if (!params || !post) {
		return { notFound: true };
	}

	return {
		props: {
			post,
		},
	};
};
