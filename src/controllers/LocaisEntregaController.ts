import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { ZodError } from 'zod';
import pool from '../database/connection';
import { ApiResponse } from '../types';
import { buildUpdate } from '../utils/sql';
import { AtualizarLocalEntregaSchema, CriarLocalEntregaSchema } from '../utils/validators';

const LOCAL_FIELDS = ['nome', 'cidade', 'estado', 'ativo'];

export class LocaisEntregaController {
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await pool.execute('SELECT * FROM locais_entrega ORDER BY created_at DESC');
      res.json({
        success: true,
        message: 'Locais de entrega listados com sucesso',
        data: rows,
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar locais de entrega',
      } as ApiResponse<null>);
    }
  }

  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM locais_entrega WHERE id = ? LIMIT 1', [id]);
      const locais = rows as unknown[];

      if (locais.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Local de entrega nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Local de entrega carregado com sucesso',
        data: locais[0],
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter local de entrega',
      } as ApiResponse<null>);
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const payload = CriarLocalEntregaSchema.parse(req.body);
      const id = payload.id || randomUUID();
      const ativo = payload.ativo !== undefined ? payload.ativo : true;

      await pool.execute(
        'INSERT INTO locais_entrega (id, nome, cidade, estado, ativo) VALUES (?, ?, ?, ?, ?)',
        [id, payload.nome, payload.cidade, payload.estado, ativo]
      );

      res.status(201).json({
        success: true,
        message: 'Local de entrega criado com sucesso',
        data: { id },
      } as ApiResponse<{ id: string }>);
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
        message: 'Erro ao criar local de entrega',
      } as ApiResponse<null>);
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload = AtualizarLocalEntregaSchema.parse(req.body);
      const { fields, values } = buildUpdate(payload as Record<string, unknown>, LOCAL_FIELDS);

      if (fields.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum campo valido para atualizar',
        } as ApiResponse<null>);
        return;
      }

      const sql = `UPDATE locais_entrega SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      const [result] = await pool.execute(sql, values);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Local de entrega nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Local de entrega atualizado com sucesso',
      } as ApiResponse<null>);
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
        message: 'Erro ao atualizar local de entrega',
      } as ApiResponse<null>);
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM locais_entrega WHERE id = ?', [id]);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Local de entrega nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Local de entrega removido com sucesso',
      } as ApiResponse<null>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao remover local de entrega',
      } as ApiResponse<null>);
    }
  }
}
