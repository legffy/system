import { supabase } from "./supabase-client";
import express from 'express';
import { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes";
import cors from 'cors';
import habitRoutes from './routes/habitRoutes';
dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true, // if you're sending cookies or auth headers
}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use("/habits", habitRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
export default app;
