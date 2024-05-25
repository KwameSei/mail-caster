import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import './utils/scheduler.js';

// import userRoutes from './routes/userRoutes.js';
// import appLinksRoutes from './routes/appLinksRoutes.js';
import userRoutes from './routes/userRoutes.js';
import campaignsRoutes from './routes/campaignsRoutes.js';
import campaignRecipientsRoutes from './routes/campaignRecipientsRoutes.js';
import segmentsRoutes from './routes/segmentsRoutes.js';

dotenv.config();

const createApp = () => {
  const app = express();
  const server = http.createServer(app);

  // Middlewares
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors());

  // Routes
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to the Test API Platform',
    });
  });

  // app.use('/api/v1/users', userRoutes);
  // app.use('/api/v1/app', appLinksRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/campaigns', campaignsRoutes);
  app.use('/api/v1/campaign-recipients', campaignRecipientsRoutes);
  app.use('/api/v1/segments', segmentsRoutes);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Something went wrong!'
    });
  });

  return server;
};

export default createApp;