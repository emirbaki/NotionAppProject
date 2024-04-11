
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

import notes from "./routes/notes.js";
import registration from "./routes/registration.js";

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

var app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Replace with your React app's origin
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notes);
app.use('/api', registration);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
