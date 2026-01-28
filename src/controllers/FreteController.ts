import { Response } from 'express';
import { AuthRequest } from '../types';
import { FreteService } from '../services/FreteService';
import { CriarFreteSchema, AtualizarFreteSchema } from '../utils/validators';

const freteService = new FreteService();

export class FreteController {
  async listar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const resultado = await freteService.listarFretes(status as string, skip, Number(limit));

      res.status(200).json({
        success: true,
        message: 'Fretes listados com sucesso',
        data: resultado,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao listar fretes',
      });
    }
  }

  async obterPorId(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const frete = await freteService.obterFretePorId(id);

      res.status(200).json({
        success: true,
        message: 'Frete obtido com sucesso',
        data: frete,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Frete não encontrado',
      });
    }
  }

  async criar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const validacao = CriarFreteSchema.parse(req.body);
      const frete = await freteService.criarFrete(validacao);

      res.status(201).json({
        success: true,
        message: 'Frete criado com sucesso',
        data: frete,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar frete',
      });
    }
  }

  async atualizar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validacao = AtualizarFreteSchema.parse(req.body);
      const frete = await freteService.atualizarFrete(id, validacao);

      res.status(200).json({
        success: true,
        message: 'Frete atualizado com sucesso',
        data: frete,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar frete',
      });
    }
  }

  async deletar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await freteService.deletarFrete(id);

      res.status(200).json({
        success: true,
        message: resultado.message,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Erro ao deletar frete',
      });
    }
  }
}
