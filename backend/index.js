import express from 'express';
import dotenv from 'dotenv';
dotenv.config();



import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import geminiResponse from './gemini.js';

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static('public'));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);



app.get("/", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) return res.send("Hello, World!");
  const answer = await geminiResponse(prompt);
  res.json({ data: answer });
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on port ${PORT}`);
});
