import { Post, Category } from './model';
import { connectDB } from './connect';
import type { NewFrontMatter } from '@type/post';

export type GetPostsParams = {
  page: number;
  limit?: number;
  category?: string;
};

const getPosts = async ({ page, limit = 10, category }: GetPostsParams) => {
  await connectDB();

  const offset = (page - 1) * limit;
  const filter: Partial<NewFrontMatter> = { published: true };

  if (category && category !== 'All') {
    filter.category = category;
  }

  const posts = await Post.find(filter, null, { sort: { updatedDate: -1 } })
    .limit(limit)
    .skip(offset)
    .lean<NewFrontMatter[]>()
    .exec()
    .then((posts) => posts.map((post) => ({ ...post, _id: post._id.toString(), date: post.date.toString(), updatedDate: post.updatedDate.toString() })));

  const totalPost = await Post.countDocuments(filter);
  const totalPage = Math.ceil(totalPost / limit);

  return {
    posts,
    totalPage,
  };
};

const getPost = async (slug: string) => {
  await connectDB();

  const post: NewFrontMatter | null = await Post.findOne({ slug }, null)
    .lean<NewFrontMatter>()
    .exec()
    .then((post) => {
      if (!post) {
        return null;
      }

      return { ...post, _id: post._id.toString(), date: post.date.toString(), updatedDate: post.updatedDate.toString() };
    });

  return post;
};

const getCategories = async () => {
  await connectDB();

  const categories = await Post.find({ published: true }, 'category', { sort: { name: 1 } })
    .distinct('category')
    .lean()
    .exec();

  return ['All', ...categories];
};

export { getPosts, getPost, getCategories };
