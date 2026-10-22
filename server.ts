import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './src/api/apiMiddleware.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Render healthcheck endpoint for zero-downtime deploys and status monitors
app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    app: 'Mahira Select',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Direct in-house payment and order handling
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    handleApiRequest(req, res, next);
  } else {
    next();
  }
});

async function startServer() {
  // Resolve client dist directory across both dev and bundled production paths
  const possibleDistPaths = [
    path.resolve(process.cwd(), 'dist'),
    path.resolve(__dirname, 'dist'),
    path.resolve(__dirname, '..', 'dist'),
  ];
  const distPath = possibleDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

  const isProduction = process.env.NODE_ENV === 'production' || (Boolean(distPath) && process.env.NODE_ENV !== 'development');

  if (isProduction && distPath) {
    console.log(`[Mahira Select] Production mode: Serving assets from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite Middlewares in Development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mahira Select Server] Live on http://0.0.0.0:${PORT}`);
    console.log(`[Payment Gateway] Direct WhatsApp Order -> +91 8536943389`);
    console.log(`[Payment Gateway] PNB Settlement -> A/C 2072001501047083 (Debraj Dutta)`);
  });
}

startServer();

