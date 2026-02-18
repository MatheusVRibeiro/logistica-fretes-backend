import { Router } from 'express';
import { AuthController } from '../controllers';
import { loginLimiter } from '../middlewares/rateLimiter';

const router = Router();
const authController = new AuthController();

// Aplica rate limiter especificamente na rota de login
router.post('/login', loginLimiter, (req, res) => authController.login(req, res));
router.post('/registrar', (req, res) => authController.registrar(req, res));

export default router;
