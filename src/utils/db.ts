import mongoose from 'mongoose';
import { Globals } from 'react-spring';

type GetPostsParams = {
  page: number;
  limit?: number;
  category?: string;
};

const { Schema } = mongoose;
const { ObjectId } = Schema;

const PostSchema = new Schema({
  id: ObjectId,
  author: String,
  title: String,
  category: String,
  date: Date,
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  description: String,
  published: Boolean,
  slug: String,
  tags: [String],
  url: String,
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

const connectDB = async () => {
  const url = process.env.DATABASE_URI;
  const db = process.env.DATABASE_NAME;

  if (!url) {
    return;
  }

  if (!global.mongoose) {
    global.mongoose = await mongoose.connect(url, { dbName: db });
    console.log('MongoDB Connected');
  }
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

export { getPosts };
