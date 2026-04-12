import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });
import authRoutes from './routes/auth';
import contestRoutes from './routes/contests';
import problemRoutes from './routes/problems';

export const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.get('/api/health', (_, res) => {
    return res.status(200).json({
        success: true,
        data: {
            status: 'ok'
        },
        error: null
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/problems', problemRoutes);


if (import.meta.main) {
    app.listen(port, () => {
        console.log(`Listening to Aujla on port ${port}`);
    });
}
