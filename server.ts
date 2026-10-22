import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './src/api/apiMiddleware.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Direct in-house payment and order handling
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    handleApiRequest(req, res, next);
  } else {
    next();
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
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
    console.log(`[Mahira Select Server] Live on http://localhost:${PORT}`);
    console.log(`[Payment Gateway] Direct WhatsApp Order -> 8536943389`);
    console.log(`[Payment Gateway] Direct UPI & Card Gateway initialized`);
  });
}

startServer();
