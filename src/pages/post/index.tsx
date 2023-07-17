import { useEffect, useState } from 'react';
import axios from 'axios';

import type { GetServerSideProps } from 'next';

import { getPosts } from '@lib/db';

import { PostListContainer } from '@containers/PostListContainer';

import type { GetPostsParams } from '@lib/db';
import type { Category, NewFrontMatter } from '@type/post';

type Props = {
  posts: NewFrontMatter[];
  page: number;
  totalPage: number;
  category: Category;
};

const PostListPage = ({ posts, page, totalPage, category }: Props) => {
  const hasMore = page < totalPage;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await axios.get('/api/category');
      const { categories } = data;

      setCategories(categories);
    };

    getCategories();
  }, []);

  return <PostListContainer posts={posts} hasMore={hasMore} page={page} categories={categories} category={category} />;
};

export default PostListPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res, req }) => {
  if (query.page === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/post?page=1',
      },
    };
  }

  if (typeof query.page !== 'string' || (query.category && typeof query.category !== 'string')) {
    return {
      notFound: true,
    };
  }

  const page = parseInt(query.page, 10);
  const params: GetPostsParams = { page };

  if (typeof query.category === 'string') {
    params.category = query.category;
  }

  const { posts, totalPage } = await getPosts(params);

  return {
    props: {
      posts,
      page,
      totalPage,
      category: query.category || 'All',
    },
  };
};
