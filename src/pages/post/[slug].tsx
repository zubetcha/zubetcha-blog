import axios from 'axios';
import matter from 'gray-matter';
import { MDXComponents, PostContainer } from '@components/index';
import { MDXRemote } from 'next-mdx-remote';

import type { GetServerSideProps } from 'next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { getPost } from '@lib/db';
import { parseMdx, getLinkContent } from '@utils/index';

import type { NewFrontMatter } from '@type/post';

interface Props {
  post: NewFrontMatter & { content: string };
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
      <PostContainer frontMatter={post} slug={post.slug} headingList={headingList}>
        <MDXRemote {...mdx} components={MDXComponents} />
      </PostContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params || typeof params.slug !== 'string') {
    return { notFound: true };
  }

  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return { notFound: true };
  }

  const file = await axios.get(post.url).then((res) => res.data);
  const { content } = matter(file);
  const mdx = await parseMdx(content);

  return {
    props: {
      post: { ...post, content },
      mdx,
    },
  };
};
