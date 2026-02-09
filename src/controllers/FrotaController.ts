import { Request, Response } from 'express';
import { ZodError } from 'zod';
import pool from '../database/connection';
import { ApiResponse } from '../types';
import { generateId } from '../utils/id';
import { buildUpdate } from '../utils/sql';
import { AtualizarCaminhaoSchema, CriarCaminhaoSchema } from '../utils/validators';

const FROTA_FIELDS = [
  'placa',
  'placa_carreta',
  'modelo',
  'ano_fabricacao',
  'status',
  'motorista_fixo_id',
  'capacidade_toneladas',
  'km_atual',
  'tipo_combustivel',
  'tipo_veiculo',
  'renavam',
  'renavam_carreta',
  'chassi',
  'registro_antt',
  'validade_seguro',
  'validade_licenciamento',
  'proprietario_tipo',
  'ultima_manutencao_data',
  'proxima_manutencao_km',
];

export class FrotaController {
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await pool.execute('SELECT * FROM Frota ORDER BY created_at DESC');
      res.json({
        success: true,
        message: 'Frota listada com sucesso',
        data: rows,
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar frota',
      } as ApiResponse<null>);
    }
  }

  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM Frota WHERE id = ? LIMIT 1', [id]);
      const frota = rows as unknown[];

      if (frota.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Veiculo nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Veiculo carregado com sucesso',
        data: frota[0],
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter veiculo',
      } as ApiResponse<null>);
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const payload = CriarCaminhaoSchema.parse(req.body);
      const id = payload.id || generateId('FROTA');
      const status = payload.status || 'disponivel';
      const tipoCombustivel = payload.tipo_combustivel || 'S10';
      const kmAtual = payload.km_atual !== undefined ? payload.km_atual : 0;
      const proprietarioTipo = payload.proprietario_tipo || 'PROPRIO';

      await pool.execute(
        `INSERT INTO Frota (
          id, placa, placa_carreta, modelo, ano_fabricacao, status, motorista_fixo_id,
          capacidade_toneladas, km_atual, tipo_combustivel, tipo_veiculo, renavam,
          renavam_carreta, chassi, registro_antt, validade_seguro, validade_licenciamento,
          proprietario_tipo, ultima_manutencao_data, proxima_manutencao_km
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.placa,
          payload.placa_carreta || null,
          payload.modelo,
          payload.ano_fabricacao,
          status,
          payload.motorista_fixo_id || null,
          payload.capacidade_toneladas,
          kmAtual,
          tipoCombustivel,
          payload.tipo_veiculo,
          payload.renavam || null,
          payload.renavam_carreta || null,
          payload.chassi || null,
          payload.registro_antt || null,
          payload.validade_seguro || null,
          payload.validade_licenciamento || null,
          proprietarioTipo,
          payload.ultima_manutencao_data || null,
          payload.proxima_manutencao_km || null,
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Veiculo criado com sucesso',
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
        message: 'Erro ao criar veiculo',
      } as ApiResponse<null>);
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload = AtualizarCaminhaoSchema.parse(req.body);
      const { fields, values } = buildUpdate(payload as Record<string, unknown>, FROTA_FIELDS);

      if (fields.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum campo valido para atualizar',
        } as ApiResponse<null>);
        return;
      }

      const sql = `UPDATE Frota SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      const [result] = await pool.execute(sql, values);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Veiculo nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Veiculo atualizado com sucesso',
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
        message: 'Erro ao atualizar veiculo',
      } as ApiResponse<null>);
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM Frota WHERE id = ?', [id]);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Veiculo nao encontrado',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Veiculo removido com sucesso',
      } as ApiResponse<null>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao remover veiculo',
      } as ApiResponse<null>);
    }
  }
}
