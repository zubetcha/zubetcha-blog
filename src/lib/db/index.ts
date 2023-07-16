import { Post, Category } from './model';
import { connectDB } from './connect';

type GetPostsParams = {
  page: number;
  limit?: number;
  category?: string;
};

const getPosts = async ({ page, limit = 10, category }: GetPostsParams) => {
  await connectDB();

  const offset = (page - 1) * limit;
  const posts = await Post.find({ published: true }, null, { sort: { updatedDate: -1 } })
    .limit(limit)
    .skip(offset)
    .lean()
    .exec()
    .then((posts) => posts.map((post: any) => ({ ...post, _id: post._id.toString(), date: post.date.toString(), updatedDate: post.updatedDate.toString() })));

  const totalPost = await Post.countDocuments({ published: true });
  const totalPage = Math.ceil(totalPost / limit);

  return {
    posts,
    totalPage,
  };
};

const getCategories = async () => {
  await connectDB();

  const categories = await Post.find({ published: true }, 'category', { sort: { name: 1 } })
    .distinct('category')
    .lean()
    .exec();

  return ['All', ...categories];
};

export { getPosts, getCategories };
