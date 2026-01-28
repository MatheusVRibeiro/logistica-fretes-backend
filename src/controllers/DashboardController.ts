import { Response } from 'express';
import { AuthRequest } from '../types';
import { DashboardService } from '../services/DashboardService';

const dashboardService = new DashboardService();

export class DashboardController {
  async obterKPIs(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const kpis = await dashboardService.obterKPIs();

      res.status(200).json({
        success: true,
        message: 'KPIs obtidos com sucesso',
        data: kpis,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter KPIs',
      });
    }
  }

  async obterEstatisticasPorRota(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const estatisticas = await dashboardService.obterEstatisticasPorRota();

      res.status(200).json({
        success: true,
        message: 'Estatísticas por rota obtidas com sucesso',
        data: estatisticas,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter estatísticas',
      });
    }
  }
}
