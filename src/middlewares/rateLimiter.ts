import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Limiter específico para rota de login — protege contra brute-force por IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo de 10 requisições por IP a cada janela
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente mais tarde.'
  },
  keyGenerator: (req: Request) => {
    // Usar combinação de IP + possível identificador extra no futuro
    return req.ip || '';
  },
});

// Limiter genérico (padrão) para outras rotas sensíveis se necessário
export const defaultLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60, // 60 requisições por IP por minuto
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginLimiter;
