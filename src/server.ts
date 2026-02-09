import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';

// Importar rotas
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import freteRoutes from './routes/freteRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import motoristaRoutes from './routes/motoristaRoutes';
import frotaRoutes from './routes/frotaRoutes';
import fazendaRoutes from './routes/fazendaRoutes';
import custoRoutes from './routes/custoRoutes';
import pagamentoRoutes from './routes/pagamentoRoutes';
import notaFiscalRoutes from './routes/notaFiscalRoutes';
import locaisEntregaRoutes from './routes/locaisEntregaRoutes';

// Carregar variáveis de ambiente
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES ====================

// CORS
app.use(
  cors({
    origin: process.env.API_URL || '*',
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan('combined'));

// ==================== ROTAS ====================

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Backend está funcionando',
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fretes', freteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/motoristas', motoristaRoutes);
app.use('/api/frota', frotaRoutes);
app.use('/api/fazendas', fazendaRoutes);
app.use('/api/custos', custoRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/notas-fiscais', notaFiscalRoutes);
app.use('/api/locais-entrega', locaisEntregaRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path,
  });
});

// Error Handler
app.use(errorHandler);

// ==================== CONEXÃO E INICIALIZAÇÃO ====================

const startServer = async () => {
  try {
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  process.exit(0);
});

startServer();

export default app;
