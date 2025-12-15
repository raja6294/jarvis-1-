import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';

const app = express();

// CORS fix: allow frontend port(s)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from public directory
app.use('/public', express.static('public'));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});
