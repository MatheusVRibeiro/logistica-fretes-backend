import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const dashboardController = new DashboardController();

router.use(authMiddleware);

router.get('/kpis', (req, res) => dashboardController.obterKPIs(req, res));
router.get('/estatisticas-rotas', (req, res) => dashboardController.obterEstatisticasPorRota(req, res));

export default router;
