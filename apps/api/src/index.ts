/**
 * Main API Server
 * Functional programming approach with modular structure
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { openAiRouter } from './routes/open-ai';
import { weaviateRouter } from './routes/weaviate';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Create Express app with functional approach
const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  app.use('/api/open-ai', openAiRouter);
  app.use('/api/weaviate', weaviateRouter);

  return app;
};

// Start server function
const startServer = (app: express.Application, port: number) => {
  app.listen(port, () => {
    console.log(`🚀 API server running on http://localhost:${port}`);
  });
};

// Initialize and start the application
const app = createApp();
startServer(app, PORT);
