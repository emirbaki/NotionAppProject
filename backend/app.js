
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import errorHandler  from './middlewares/errorMiddleware.js';

import indexRouter from "./routes/index.js";

import usersRouter from "./routes/userRoutes.js";
import notifications from "./routes/notificationRoutes.js";
import notes from "./routes/noteRoutes.js";
import registration from "./routes/registration.js";
import connectDB from "./db/connection.js";
import collectionRoutes from './routes/collectionRoutes.js';
import friendship from "./routes/friendshipRoutes.js";
import profile from "./routes/profileRoutes.js";


const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

var app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:3001', // Replace with your React app's origin
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notes);
app.use('/api', registration);
app.use('/api/notifications', notifications);
app.use('/profile', profile);
app.use('/collections', collectionRoutes); 
app.use('/friendship', friendship);



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
