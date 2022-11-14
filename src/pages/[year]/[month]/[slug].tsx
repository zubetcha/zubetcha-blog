import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Post } from '@type/post';
import { MDXComponents } from '@components/MDXComponents/MDXComponents';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getAllPosts, parseMdx, getLinkContent } from '@utils/index';
import { ToC } from '@components/ToC/ToC';
import { PostContainer } from '@containers/Post/PostContainer';

interface Props {
	post: Post;
	mdx: MDXRemoteSerializeResult;
}
export default function PostPage({ post, mdx }: Props) {
	const headingList = post.content
		.split('\n')
		.filter((el) => el.startsWith('#'))
		.map((heading) => {
			const text = heading.replace(/#/g, '').trim();
			const link = '#' + getLinkContent(text);
			const sharp = heading.split(' ')[0];

			return {
				text,
				link,
				className: `h${sharp.length}`,
			};
		});

	return (
		<>
			<PostContainer
				frontMatter={post.frontMatter}
				slug={post.fields.slug}
				headingList={headingList}
			>
				<MDXRemote {...mdx} components={MDXComponents} />
			</PostContainer>
		</>
	);
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
	const mdx = await parseMdx(post.content);

	return {
		props: {
			post,
			mdx,
		},
	};
};
