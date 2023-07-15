import { getPosts } from '@utils/api';

import { getAllPosts, getPageInfo, getUpperCategory } from '@utils/index';
import { NUMBER_OF_POSTS } from '@constants/post';

import { PostListContainer } from '@components/Container';

import type { GetStaticPaths, GetStaticProps } from 'next';
import type { Post } from 'src/type/post';
import type { ParsedUrlQuery } from 'querystring';

interface Props {
  posts: Array<Post>;
  hasMore: boolean;
  pageNo: number;
  categories: Array<string>;
}

export default function PostListPage({ posts, hasMore, pageNo, categories }: Props) {
  return <PostListContainer posts={posts} hasMore={hasMore} pageNo={pageNo} categories={categories} category='All Posts' />;
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const posts = await getAllPosts();

//   const paths = [...new Array(Math.round(posts.length / NUMBER_OF_POSTS)).keys()].map((i) => ({ params: { id: `${i + 1}` } }));

//   return {
//     paths,
//     fallback: 'blocking',
//   };
// };

export const getServerSideProps: GetStaticProps = async ({ params }) => {
  const { id } = params as ParsedUrlQuery;

  const res = await getPosts();
  console.log(res);

  const posts = await getAllPosts();
  const { pageNo, maximumPageNo, slicedPosts, hasMore, categories } = getPageInfo({
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
