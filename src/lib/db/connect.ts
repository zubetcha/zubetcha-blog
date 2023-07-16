import mongoose from 'mongoose';

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

export { connectDB };
