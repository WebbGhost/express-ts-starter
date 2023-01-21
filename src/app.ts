import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize  from 'express-mongo-sanitize'

import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser'



import * as middlewares from './helpers/middlewares';
import { ResponseBack } from './interfaces/MessageResponse';

import healthCheck from './Routes/healthCheck'


const app = express();

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan('common'));
app.use(helmet());
app.use(mongoSanitize())

app.use(cors({
  origin: '*',
}));
dotenv.config();
app.disable('x-powered-by');




const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Routes
app.get<unknown, ResponseBack>('/', (req, res) => {
  res.status(200).json({

    status: 'success',
    data: {
      message: 'success',
    },
  });
});

// Error Handling Middlewares

app.use('/api/v1/',healthCheck)
app.use(middlewares.errorHandler);
app.use(middlewares.notFound);


export default app;