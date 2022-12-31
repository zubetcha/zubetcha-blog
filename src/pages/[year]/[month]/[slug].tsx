import type { GetStaticPaths, GetStaticProps } from 'next';
import type { Post } from '@type/post';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { sync } from 'glob';
import { MDXComponents, PostContainer } from '@components/index';
import { MDXRemote } from 'next-mdx-remote';
import { postsDir } from '@utils/index';
import { getAllPosts, parseMdx, getLinkContent, getPost } from '@utils/index';

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
  if (!params) {
    return { notFound: true };
  }

  const { year, month, slug } = params;
  const postMarkdownFile = sync(`${postsDir}/${year}/${month}/${slug}.md*`);

  if (!postMarkdownFile.length) {
    return { notFound: true };
  }

  const post = getPost(postMarkdownFile[0]);

  if (!post) {
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
