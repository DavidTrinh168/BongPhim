import 'dotenv/config';

import express from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bongphim';

// Middleware cơ bản
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Route kiểm tra
app.get('/', (req: Request, res: Response) => {
  res.send('BongPhim Server API is running!');
});

app.listen(PORT, () => {
  console.log(`⚡️ Server is running on http://localhost:${PORT}`);
});