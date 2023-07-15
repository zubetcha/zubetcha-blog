import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { getPosts } from '@utils/db';

type Props = {
  posts: Array<any>;
  totalPage: number;
};

const PostListPage = ({ posts, totalPage }: Props) => {
  console.log(posts);
  console.log(totalPage);

  return <div>PostListPage</div>;
};

export default PostListPage;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  if (typeof query.page !== 'string') {
    return {
      notFound: true,
    };
  }

  const page = parseInt(query.page, 10);

  const { posts, totalPage } = await getPosts({ page });

  return {
    props: {
      posts: [],
      totalPage: 0,
    },
  };
};
