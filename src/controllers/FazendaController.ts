import { Request, Response } from 'express';
import { ZodError } from 'zod';
import pool from '../database/connection';
import { ApiResponse } from '../types';
import { generateId } from '../utils/id';
import { buildUpdate } from '../utils/sql';
import { AtualizarFazendaSchema, CriarFazendaSchema } from '../utils/validators';

const FAZENDA_FIELDS = [
  'fazenda',
  'localizacao',
  'proprietario',
  'mercadoria',
  'variedade',
  'safra',
  'preco_por_tonelada',
  'peso_medio_saca',
  'total_sacas_carregadas',
  'total_toneladas',
  'faturamento_total',
  'ultimo_frete',
  'colheita_finalizada',
];

export class FazendaController {
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await pool.execute('SELECT * FROM fazendas ORDER BY created_at DESC');
      res.json({
        success: true,
        message: 'Fazendas listadas com sucesso',
        data: rows,
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar fazendas',
      } as ApiResponse<null>);
    }
  }

  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM fazendas WHERE id = ? LIMIT 1', [id]);
      const fazendas = rows as unknown[];

      if (fazendas.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Fazenda nao encontrada',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Fazenda carregada com sucesso',
        data: fazendas[0],
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter fazenda',
      } as ApiResponse<null>);
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const payload = CriarFazendaSchema.parse(req.body);
      const id = payload.id || generateId('FAZ');
      const pesoMedioSaca = payload.peso_medio_saca !== undefined ? payload.peso_medio_saca : 25.0;
      const colheitaFinalizada = payload.colheita_finalizada !== undefined ? payload.colheita_finalizada : false;

      await pool.execute(
        `INSERT INTO fazendas (
          id, fazenda, localizacao, proprietario, mercadoria, variedade, safra,
          preco_por_tonelada, peso_medio_saca, total_sacas_carregadas, total_toneladas,
          faturamento_total, ultimo_frete, colheita_finalizada
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.fazenda,
          payload.localizacao,
          payload.proprietario,
          payload.mercadoria,
          payload.variedade || null,
          payload.safra,
          payload.preco_por_tonelada,
          pesoMedioSaca,
          payload.total_sacas_carregadas || 0,
          payload.total_toneladas || 0,
          payload.faturamento_total || 0,
          payload.ultimo_frete || null,
          colheitaFinalizada,
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Fazenda criada com sucesso',
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
        message: 'Erro ao criar fazenda',
      } as ApiResponse<null>);
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload = AtualizarFazendaSchema.parse(req.body);
      const { fields, values } = buildUpdate(payload as Record<string, unknown>, FAZENDA_FIELDS);

      if (fields.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum campo valido para atualizar',
        } as ApiResponse<null>);
        return;
      }

      const sql = `UPDATE fazendas SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      const [result] = await pool.execute(sql, values);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Fazenda nao encontrada',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Fazenda atualizada com sucesso',
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
        message: 'Erro ao atualizar fazenda',
      } as ApiResponse<null>);
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM fazendas WHERE id = ?', [id]);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Fazenda nao encontrada',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Fazenda removida com sucesso',
      } as ApiResponse<null>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao remover fazenda',
      } as ApiResponse<null>);
    }
  }
}
