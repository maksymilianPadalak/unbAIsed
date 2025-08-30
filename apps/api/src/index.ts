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
  
  // JSON parsing with error handling
  app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        console.error('Invalid JSON received:', buf.toString());
        throw new Error('Invalid JSON format');
      }
    }
  }));
  
  // Global error handler for JSON parsing
  app.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof SyntaxError && 'body' in error) {
      console.error('JSON Parse Error:', error.message);
      return res.status(400).json({ error: 'Invalid JSON format in request body' });
    }
    next();
  });

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
