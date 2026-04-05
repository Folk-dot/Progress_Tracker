import express from 'express';
import 'dotenv/config';
import projectsRouter from './api_routes/projectsRouter.js';
import authRouter from './api_routes/authRouter.js';
import cors from 'cors';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean)
}))

app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);
app.use((err, req, res , next) => {
    console.log(err);
    res.status(err.status || 500);
    res.json({ message: err.message })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})