import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import apiRouter from './server/src/routes/api';
import { connectDatabase } from './server/src/config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount REST API routes under /api
app.use('/api', apiRouter);

// Database initialization
connectDatabase().catch(err => {
  console.error('Database initialization notice:', err);
});

// Setup Frontend serving (Vite in dev mode, static files in production)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import of vite in dev mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
    console.log('⚡ Vite dev middleware mounted');
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ScholarSphere Full-Stack Application is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
