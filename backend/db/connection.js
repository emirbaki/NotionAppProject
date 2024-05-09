
import mongoose from "mongoose";

const URI = 'mongodb+srv://admin:admin@dessistweb.j0eksb7.mongodb.net/?retryWrites=true&w=majority&appName=DesSistWeb';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI, {dbName : "notes"} );
    console.log(`MongoDB Connected:${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;