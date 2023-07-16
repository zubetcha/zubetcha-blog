import { useEffect } from 'react';

import axios from 'axios';
import type { GetServerSideProps } from 'next';

import { getPosts } from '@lib/db';

type Props = {
  posts: Array<any>;
  totalPage: number;
};

const PostListPage = ({ posts, totalPage }: Props) => {
  console.log(posts);
  console.log(totalPage);

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await axios.get('/api/category');
      console.log(data);
    };

    getCategories();
  }, []);

  return <div>PostListPage</div>;
};

export default PostListPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
  if (typeof query.page !== 'string') {
    return {
      notFound: true,
    };
  }

  const page = parseInt(query.page, 10);
  const { posts, totalPage } = await getPosts({ page });

  return {
    props: {
      posts,
      totalPage,
    },
  };
};
