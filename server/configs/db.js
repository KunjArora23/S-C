import mongoose from 'mongoose';

async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
}

export default connectDB;
