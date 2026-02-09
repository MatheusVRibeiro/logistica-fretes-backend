import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const usuarioController = new UsuarioController();

router.use(authMiddleware);

router.get('/', (req, res) => usuarioController.listar(req, res));
router.get('/:id', (req, res) => usuarioController.obterPorId(req, res));
router.post('/', (req, res) => usuarioController.criar(req, res));
router.put('/:id', (req, res) => usuarioController.atualizar(req, res));
router.delete('/:id', (req, res) => usuarioController.deletar(req, res));

export default router;
