import express from 'express';
import swaggerUi from 'swagger-ui-express';
import productRoutes from './routes/product.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
export function createApp(swaggerDocument) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));
  app.get('/', (req, res) => res.json({ message: "Bienvenue sur l'API REST Product - LAB 5" }));
  app.use('/api/products', productRoutes);
  app.get('/api-docs.json', (req, res) => res.json(swaggerDocument));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use((req, res) => res.status(404).json({ success: false, error: { status: 404, message: 'Route non trouvée' } }));
  app.use(errorHandler);
  return app;
}
