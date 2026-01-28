import { Response } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/AuthService';
import { LoginSchema, CriarUsuarioSchema } from '../utils/validators';

const authService = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validacao = LoginSchema.parse(req.body);
      const resultado = await authService.login(validacao);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: resultado,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Erro ao fazer login',
      });
    }
  }

  async registrar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validacao = CriarUsuarioSchema.parse(req.body);
      const resultado = await authService.criarUsuario(validacao);

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: resultado,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar usuário',
      });
    }
  }
}
