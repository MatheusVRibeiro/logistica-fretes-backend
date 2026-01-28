import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_key_aqui';

export interface JwtPayload {
  id: string;
  email: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
      return;
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.userId = decoded.id;
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao validar token',
    });
  }
};

export const generateToken = (id: string, email: string): string => {
  return jwt.sign(
    { id, email },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    } as any
  );
};
