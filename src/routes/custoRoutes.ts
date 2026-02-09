import { Router } from 'express';
import { CustoController } from '../controllers/CustoController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const custoController = new CustoController();

router.use(authMiddleware);

router.get('/', (req, res) => custoController.listar(req, res));
router.get('/:id', (req, res) => custoController.obterPorId(req, res));
router.post('/', (req, res) => custoController.criar(req, res));
router.put('/:id', (req, res) => custoController.atualizar(req, res));
router.delete('/:id', (req, res) => custoController.deletar(req, res));

export default router;
