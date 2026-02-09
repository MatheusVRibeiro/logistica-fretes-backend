import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { ZodError } from 'zod';
import pool from '../database/connection';
import { generateToken } from '../middlewares/auth';
import { CriarUsuarioSchema, LoginSchema } from '../utils/validators';
import { ApiResponse } from '../types';
import { generateId } from '../utils/id';

export class AuthController {
  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const data = CriarUsuarioSchema.parse(req.body);

      const [existingRows] = await pool.execute(
        'SELECT id FROM usuarios WHERE email = ? LIMIT 1',
        [data.email]
      );

      const existing = existingRows as { id: string }[];
      if (existing.length > 0) {
        res.status(409).json({
          success: false,
          message: 'Email ja cadastrado',
        } as ApiResponse<null>);
        return;
      }

      const senhaHash = await bcrypt.hash(data.senha, 10);
      const id = generateId('USR');

      await pool.execute(
        'INSERT INTO usuarios (id, nome, email, senha_hash) VALUES (?, ?, ?, ?)',
        [id, data.nome, data.email, senhaHash]
      );

      res.status(201).json({
        success: true,
        message: 'Usuario criado com sucesso',
        data: { id, nome: data.nome, email: data.email },
      } as ApiResponse<{ id: string; nome: string; email: string }>);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Dados invalidos',
          error: error.errors.map((err) => err.message).join('; '),
        } as ApiResponse<null>);
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao registrar usuario',
      } as ApiResponse<null>);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = LoginSchema.parse(req.body);

      const [rows] = await pool.execute(
        'SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ? LIMIT 1',
        [data.email]
      );

      const users = rows as Array<{ id: string; nome: string; email: string; senha_hash: string }>;
      if (users.length === 0) {
        res.status(401).json({
          success: false,
          message: 'Credenciais invalidas',
        } as ApiResponse<null>);
        return;
      }

      const user = users[0];
      const valid = await bcrypt.compare(data.senha, user.senha_hash);
      if (!valid) {
        res.status(401).json({
          success: false,
          message: 'Credenciais invalidas',
        } as ApiResponse<null>);
        return;
      }

      const token = generateToken(user.id, user.email);
      await pool.execute('UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ?', [user.id]);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          token,
          usuario: {
            id: user.id,
            nome: user.nome,
            email: user.email,
          },
        },
      } as ApiResponse<{ token: string; usuario: { id: string; nome: string; email: string } }>);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Dados invalidos',
          error: error.errors.map((err) => err.message).join('; '),
        } as ApiResponse<null>);
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao realizar login',
      } as ApiResponse<null>);
    }
  }
}
