import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {clerkMiddleware} from '@clerk/express' 
import {connectDB} from './config/db.js';
import courseRouter from './routes/courseRouter.js';
import bookingRouter from './routes/bookingRouter.js';

const app = express();
const port = 4000;

//MIDDLWARES
app.use(cors({
    origins: ['http://localhost:5173', 'https://localhost:5174'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use (clerkMiddleware());

app.use('/uploads', express.static('uploads'));

//ROUTES
app.use('/api/course', courseRouter);
app.use('/api/booking', bookingRouter);

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start backend:', error.message);
        process.exit(1);
    }
};

startServer();