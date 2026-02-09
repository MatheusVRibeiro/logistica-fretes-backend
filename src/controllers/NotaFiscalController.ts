import { Request, Response } from 'express';
import { ZodError } from 'zod';
import pool from '../database/connection';
import { ApiResponse } from '../types';
import { buildUpdate } from '../utils/sql';
import { AtualizarNotaFiscalSchema, CriarNotaFiscalSchema } from '../utils/validators';

const NOTA_FISCAL_FIELDS = [
  'frete_id',
  'motorista_id',
  'numero_nf',
  'serie_nf',
  'data_emissao',
  'data_saida',
  'data_entrega',
  'mercadoria',
  'quantidade_sacas',
  'toneladas',
  'origem',
  'destino',
  'valor_bruto',
  'icms_aliquota',
  'icms_valor',
  'valor_liquido',
  'status',
  'chave_acesso',
  'arquivo_pdf',
  'arquivo_xml',
  'observacoes',
];

const buildNotaFiscalId = (): string => {
  const suffix = Date.now().toString().slice(-8);
  return `NF-${suffix}`;
};

export class NotaFiscalController {
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const [rows] = await pool.execute('SELECT * FROM notas_fiscais ORDER BY created_at DESC');
      res.json({
        success: true,
        message: 'Notas fiscais listadas com sucesso',
        data: rows,
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar notas fiscais',
      } as ApiResponse<null>);
    }
  }

  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute('SELECT * FROM notas_fiscais WHERE id = ? LIMIT 1', [id]);
      const notas = rows as unknown[];

      if (notas.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Nota fiscal nao encontrada',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Nota fiscal carregada com sucesso',
        data: notas[0],
      } as ApiResponse<unknown>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter nota fiscal',
      } as ApiResponse<null>);
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const payload = CriarNotaFiscalSchema.parse(req.body);
      const id = payload.id || buildNotaFiscalId();
      const serieNf = payload.serie_nf || '1';
      const icmsAliquota = payload.icms_aliquota !== undefined ? payload.icms_aliquota : 18.0;
      const icmsValor = payload.icms_valor !== undefined
        ? payload.icms_valor
        : (Number(payload.valor_bruto) * Number(icmsAliquota)) / 100;
      const valorLiquido = payload.valor_liquido !== undefined
        ? payload.valor_liquido
        : Number(payload.valor_bruto) - Number(icmsValor);
      const status = payload.status || 'emitida';

      await pool.execute(
        `INSERT INTO notas_fiscais (
          id, frete_id, motorista_id, numero_nf, serie_nf, data_emissao, data_saida,
          data_entrega, mercadoria, quantidade_sacas, toneladas, origem, destino,
          valor_bruto, icms_aliquota, icms_valor, valor_liquido, status, chave_acesso,
          arquivo_pdf, arquivo_xml, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.frete_id,
          payload.motorista_id,
          payload.numero_nf,
          serieNf,
          payload.data_emissao,
          payload.data_saida || null,
          payload.data_entrega || null,
          payload.mercadoria,
          payload.quantidade_sacas,
          payload.toneladas,
          payload.origem,
          payload.destino,
          payload.valor_bruto,
          icmsAliquota,
          icmsValor,
          valorLiquido,
          status,
          payload.chave_acesso || null,
          payload.arquivo_pdf || null,
          payload.arquivo_xml || null,
          payload.observacoes || null,
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Nota fiscal criada com sucesso',
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
        message: 'Erro ao criar nota fiscal',
      } as ApiResponse<null>);
    }
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const payload = AtualizarNotaFiscalSchema.parse(req.body);
      const { fields, values } = buildUpdate(payload as Record<string, unknown>, NOTA_FISCAL_FIELDS);

      if (fields.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Nenhum campo valido para atualizar',
        } as ApiResponse<null>);
        return;
      }

      const sql = `UPDATE notas_fiscais SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      const [result] = await pool.execute(sql, values);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Nota fiscal nao encontrada',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Nota fiscal atualizada com sucesso',
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
        message: 'Erro ao atualizar nota fiscal',
      } as ApiResponse<null>);
    }
  }

  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [result] = await pool.execute('DELETE FROM notas_fiscais WHERE id = ?', [id]);
      const info = result as { affectedRows: number };

      if (info.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Nota fiscal nao encontrada',
        } as ApiResponse<null>);
        return;
      }

      res.json({
        success: true,
        message: 'Nota fiscal removida com sucesso',
      } as ApiResponse<null>);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao remover nota fiscal',
      } as ApiResponse<null>);
    }
  }
}
