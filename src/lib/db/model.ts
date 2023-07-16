import mongoose from 'mongoose';

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

const CategorySchema = new Schema({
  id: ObjectId,
  name: String,
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export { Post, Category };
