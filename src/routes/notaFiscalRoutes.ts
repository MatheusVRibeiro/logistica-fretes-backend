import { Router } from 'express';
import { NotaFiscalController } from '../controllers/NotaFiscalController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const notaFiscalController = new NotaFiscalController();

router.use(authMiddleware);

router.get('/', (req, res) => notaFiscalController.listar(req, res));
router.get('/:id', (req, res) => notaFiscalController.obterPorId(req, res));
router.post('/', (req, res) => notaFiscalController.criar(req, res));
router.put('/:id', (req, res) => notaFiscalController.atualizar(req, res));
router.delete('/:id', (req, res) => notaFiscalController.deletar(req, res));

export default router;
