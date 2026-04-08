import express from 'express';
import 'dotenv/config';
import projectsRouter from './api_routes/projectsRouter.js';
import authRouter from './api_routes/authRouter.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    console.error(err);
    res.status(err.status || 500);
    res.json({ 
        code: err.code || 'SERVER_ERROR',
        message: err.message || 'Something went wrong. Please try again.',
        status: err.status || 500,
        fields: err.fields || {}
    })
})
// app.use(express.static(path.join(__dirname, '../client/dist')));
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})