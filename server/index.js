import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import adminRoutes from './routes/admin.routes.js';
import cityRoutes from './routes/city.routes.js';
import tourRoutes from './routes/tour.routes.js';
import reviewRoutes from './routes/review.routes.js';
import contactRoutes from './routes/contact.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const CORS_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];

// app.use((req, res, next) => {
//     console.log("Incoming:", req.method, req.url);
//     next();
// });

app.use(express.json());

// console.log('CORS_ORIGINS:', CORS_ORIGINS);

app.use(cookieParser());
app.use(cors({
    origin: CORS_ORIGINS,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// admin routes

app.use('/api/v1/admin', adminRoutes);

// user routes
app.use('/api/v1/cities', cityRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/contact', contactRoutes);


const PORT = process.env.PORT || 8000;

await connectDB();

app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});
