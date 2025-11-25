import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import authRouter from './routes/user.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';



const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {

  connectDb();
  console.log(`Server is running on port ${PORT}`);
});
