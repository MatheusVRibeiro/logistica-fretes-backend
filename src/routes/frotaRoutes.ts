import { Router } from 'express';
import { FrotaController } from '../controllers/FrotaController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const frotaController = new FrotaController();

router.use(authMiddleware);

router.get('/', (req, res) => frotaController.listar(req, res));
router.get('/:id', (req, res) => frotaController.obterPorId(req, res));
router.post('/', (req, res) => frotaController.criar(req, res));
router.put('/:id', (req, res) => frotaController.atualizar(req, res));
router.delete('/:id', (req, res) => frotaController.deletar(req, res));

export default router;
