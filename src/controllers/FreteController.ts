import { Response } from 'express';
import { ZodError } from 'zod';
import pool from '../database/connection';
import { ApiResponse, AuthRequest } from '../types';
import { generateId } from '../utils/id';
import { buildUpdate } from '../utils/sql';
import { AtualizarFreteSchema, CriarFreteSchema } from '../utils/validators';

const FRETE_FIELDS = [
  'origem',
  'destino',
  'motorista_id',
  'motorista_nome',
  'caminhao_id',
  'caminhao_placa',
  'fazenda_id',
  'fazenda_nome',
  'mercadoria',
  'mercadoria_id',
  'variedade',
  'data_frete',
  'quantidade_sacas',
  'toneladas',
  'valor_por_tonelada',
  'receita',
  'custos',
  'resultado',
  'pagamento_id',
];

export class FreteController {
  async listar(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const [rows] = await pool.execute('SELECT * FROM fretes ORDER BY created_at DESC');
      res.json({
        success: true,
        message: 'Fretes listados com sucesso',
        data: rows,
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar fretes',
      } as ApiResponse<null>);
    }
  }

  async obterPorId(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM fretes WHERE id = ? LIMIT 1', [id]);
      const fretes = rows as unknown[];

      if (fretes.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Frete nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Frete carregado com sucesso',
        data: fretes[0],
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter frete',
      } as ApiResponse<null>);
    }
  }

  async criar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const payload = CriarFreteSchema.parse(req.body);
      const id = payload.id || generateId('FRETE');

      const receita =
        payload.receita !== undefined
          ? payload.receita
          : Number(payload.toneladas) * Number(payload.valor_por_tonelada);
      const custos = payload.custos !== undefined ? payload.custos : 0;
      const resultado = payload.resultado !== undefined ? payload.resultado : Number(receita) - Number(custos);

      const sql = `INSERT INTO fretes (
        id, origem, destino, motorista_id, motorista_nome, caminhao_id, caminhao_placa,
        fazenda_id, fazenda_nome, mercadoria, mercadoria_id, variedade, data_frete,
        quantidade_sacas, toneladas, valor_por_tonelada, receita, custos, resultado, pagamento_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        id,
        payload.origem,
        payload.destino,
        payload.motorista_id,
        payload.motorista_nome,
        payload.caminhao_id,
        payload.caminhao_placa,
        payload.fazenda_id || null,
        payload.fazenda_nome || null,
        payload.mercadoria,
        payload.mercadoria_id || null,
        payload.variedade || null,
        payload.data_frete,
        payload.quantidade_sacas,
        payload.toneladas,
        payload.valor_por_tonelada,
        receita,
        custos,
        resultado,
        payload.pagamento_id || null,
      ];

      await pool.execute(sql, values);

      res.status(201).json({
        success: true,
        message: 'Frete criado com sucesso',
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
        message: 'Erro ao criar frete',
      } as ApiResponse<null>);
    }
  }

  async atualizar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload = AtualizarFreteSchema.parse(req.body);
      const data = { ...payload } as Record<string, unknown>;

      if (data.receita === undefined) {
        if (typeof data.toneladas === 'number' && typeof data.valor_por_tonelada === 'number') {
          data.receita = Number(data.toneladas) * Number(data.valor_por_tonelada);
        }
      }

      if (data.receita !== undefined && data.custos !== undefined && data.resultado === undefined) {
        data.resultado = Number(data.receita) - Number(data.custos);
      }

      const { fields, values } = buildUpdate(data, FRETE_FIELDS);
      if (fields.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum campo valido para atualizar',
        } as ApiResponse<null>);
        return;
      }

      const sql = `UPDATE fretes SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      const [result] = await pool.execute(sql, values);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Frete nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Frete atualizado com sucesso',
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
        message: 'Erro ao atualizar frete',
      } as ApiResponse<null>);
    }
  }

  async deletar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM fretes WHERE id = ?', [id]);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Frete nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Frete removido com sucesso',
      } as ApiResponse<null>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao remover frete',
      } as ApiResponse<null>);
    }
  }
}
