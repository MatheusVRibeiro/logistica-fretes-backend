import { Request, Response } from 'express';
import { ZodError } from 'zod';
import pool from '../database/connection';
import { ApiResponse } from '../types';
import { generateId } from '../utils/id';
import { buildUpdate } from '../utils/sql';
import { AtualizarPagamentoSchema, CriarPagamentoSchema } from '../utils/validators';

const PAGAMENTO_FIELDS = [
  'motorista_id',
  'motorista_nome',
  'periodo_fretes',
  'quantidade_fretes',
  'fretes_incluidos',
  'total_toneladas',
  'valor_por_tonelada',
  'valor_total',
  'data_pagamento',
  'status',
  'metodo_pagamento',
  'comprovante_nome',
  'comprovante_url',
  'comprovante_data_upload',
  'observacoes',
];

export class PagamentoController {
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await pool.execute('SELECT * FROM pagamentos ORDER BY created_at DESC');
      res.json({
        success: true,
        message: 'Pagamentos listados com sucesso',
        data: rows,
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar pagamentos',
      } as ApiResponse<null>);
    }
  }

  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM pagamentos WHERE id = ? LIMIT 1', [id]);
      const pagamentos = rows as unknown[];

      if (pagamentos.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Pagamento nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Pagamento carregado com sucesso',
        data: pagamentos[0],
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter pagamento',
      } as ApiResponse<null>);
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const payload = CriarPagamentoSchema.parse(req.body);
      const id = payload.id || generateId('PAG');
      const status = payload.status || 'pendente';

      await pool.execute(
        `INSERT INTO pagamentos (
          id, motorista_id, motorista_nome, periodo_fretes, quantidade_fretes, fretes_incluidos,
          total_toneladas, valor_por_tonelada, valor_total, data_pagamento, status, metodo_pagamento,
          comprovante_nome, comprovante_url, comprovante_data_upload, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.motorista_id,
          payload.motorista_nome,
          payload.periodo_fretes,
          payload.quantidade_fretes,
          payload.fretes_incluidos || null,
          payload.total_toneladas,
          payload.valor_por_tonelada,
          payload.valor_total,
          payload.data_pagamento,
          status,
          payload.metodo_pagamento,
          payload.comprovante_nome || null,
          payload.comprovante_url || null,
          payload.comprovante_data_upload || null,
          payload.observacoes || null,
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Pagamento criado com sucesso',
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
        message: 'Erro ao criar pagamento',
      } as ApiResponse<null>);
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload = AtualizarPagamentoSchema.parse(req.body);
      const { fields, values } = buildUpdate(payload as Record<string, unknown>, PAGAMENTO_FIELDS);

      if (fields.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum campo valido para atualizar',
        } as ApiResponse<null>);
        return;
      }

      const sql = `UPDATE pagamentos SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      const [result] = await pool.execute(sql, values);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Pagamento nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Pagamento atualizado com sucesso',
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
        message: 'Erro ao atualizar pagamento',
      } as ApiResponse<null>);
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM pagamentos WHERE id = ?', [id]);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Pagamento nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Pagamento removido com sucesso',
      } as ApiResponse<null>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao remover pagamento',
      } as ApiResponse<null>);
    }
  }
}
