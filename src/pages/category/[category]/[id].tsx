import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getAllCategories, getPageInfo } from '@utils/index';
import { PostListContainer } from '@containers/PostList';

import { NUMBER_OF_POSTS } from '@constants/post';
import { Post } from '@type/post';
import { ParsedUrlQuery } from 'querystring';

interface Props {
  posts: Array<Post>;
  hasMore: boolean;
  pageNo: number;
  category: string;
  categories: Array<string>;
}

export default function CategoryPage({
  category: _category,
  posts,
  hasMore,
  pageNo,
  categories,
}: Props) {
  const category = categories.find(
    (category) => category.toLowerCase() === _category,
  ) as string;

  return (
    <PostListContainer
      posts={posts}
      hasMore={hasMore}
      pageNo={pageNo}
      categories={categories}
      category={category}
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();

  const paths = getAllCategories(posts)
    .map((category, i) => {
      const lowerCategory = category.toLowerCase();
      const filteredPosts = posts.filter(
        (post) => post.frontMatter.category.toLowerCase() === lowerCategory,
      );

      return [
        ...new Array(Math.round(filteredPosts.length / NUMBER_OF_POSTS)).keys(),
      ].map((i) => ({
        params: { category: lowerCategory, id: `${i + 1}` },
      }));
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
    (post) => post.frontMatter.category.toLowerCase() === category,
  );
  const { pageNo, maximumPageNo, slicedPosts, hasMore } = getPageInfo({
    id,
    posts: filteredPosts,
  });
  const { categories } = getPageInfo({ id, posts });

  if (!params || !pageNo || isNaN(pageNo) || pageNo > maximumPageNo) {
    return { notFound: true };
  }

  return {
    props: {
      posts: slicedPosts,
      categories,
      category,
      hasMore,
      pageNo,
    },
  };
};
