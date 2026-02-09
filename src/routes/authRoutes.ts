import { Router } from 'express';
import { AuthController } from '../controllers';

const router = Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/registrar', (req, res) => authController.registrar(req, res));

export default router;
