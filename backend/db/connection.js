
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
// // const URI = process.env.ATLAS_URI || "";
// const client = new MongoClient(URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// try {
//   // Connect the client to the server
//   await client.connect();
//   // Send a ping to confirm a successful connection
//   await client.db("notes").command({ ping: 1 });
//   console.log("Pinged your deployment. You successfully connected to MongoDB!");
// } catch (err) {
//   console.error(err);
// }

// let db = client.db("notes");

export default connectDB;