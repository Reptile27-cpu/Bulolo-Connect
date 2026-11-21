import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

export function createApp(): Application {
  const app = express();

  // Security Headers & Cross-Origin
  app.use(helmet({
    crossOriginResourcePolicy: false
  }));

  app.use(cors({
    origin: config.corsOrigin,
    credentials: true
  }));

  // Logging & Parsing
  if (config.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Ensure upload directory exists
  const uploadDir = path.resolve(config.uploadDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadDir));

  // Base Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      platform: 'BULOLO CONNECT API',
      district: 'Bulolo District, Morobe Province, PNG',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API Gateway routes under /api/v1
  app.use('/api/v1', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
