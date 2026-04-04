import express from 'express';
import dotenv from 'dotenv';
import projectsRouter from './api_routes/projectsRouter.js';
import authRouter from './api_routes/authRouter.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') })
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);
app.use((err, req, res , next) => {
    console.log(err);
    res.status(err.status || 500);
    res.json({ message: err.message })
})
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})