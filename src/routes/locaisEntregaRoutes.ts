import { Router } from 'express';
import { LocaisEntregaController } from '../controllers/LocaisEntregaController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const locaisEntregaController = new LocaisEntregaController();

router.use(authMiddleware);

router.get('/', (req, res) => locaisEntregaController.listar(req, res));
router.get('/:id', (req, res) => locaisEntregaController.obterPorId(req, res));
router.post('/', (req, res) => locaisEntregaController.criar(req, res));
router.put('/:id', (req, res) => locaisEntregaController.atualizar(req, res));
router.delete('/:id', (req, res) => locaisEntregaController.deletar(req, res));

export default router;
