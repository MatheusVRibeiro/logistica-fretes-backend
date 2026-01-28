import prisma from '../database/prisma';

export class DashboardService {
  async obterKPIs() {
    // Receita total
    const receitaTotal = await prisma.frete.aggregate({
      _sum: {
        receita: true,
      },
      where: {
        status: 'CONCLUIDO',
      },
    });

    // Custos totais
    const custosTotal = await prisma.frete.aggregate({
      _sum: {
        custos: true,
      },
      where: {
        status: 'CONCLUIDO',
      },
    });

    // Lucro total
    const receita = receitaTotal._sum.receita || 0;
    const custos = custosTotal._sum.custos || 0;
    const lucro = receita - custos;

    // Fretes por status
    const fretesPorStatus = await prisma.frete.groupBy({
      by: ['status'],
      _count: true,
    });

    // Total de fretes
    const totalFretes = await prisma.frete.count();

    // Motoristas ativos
    const motoristasAtivos = await prisma.motorista.count({
      where: { ativo: true },
    });

    // Caminhões ativos
    const caminhoeAtivos = await prisma.caminhao.count({
      where: { ativo: true },
    });

    // Margem de lucro
    const margemLucro = receita > 0 ? (lucro / receita) * 100 : 0;

    return {
      receitaTotal: receita,
      custosTotal: custos,
      lucroTotal: lucro,
      margemLucro: parseFloat(margemLucro.toFixed(2)),
      totalFretes,
      motoristasAtivos,
      caminhoeAtivos,
      fretesPorStatus,
    };
  }

  async obterEstatisticasPorRota() {
    const rotasPorRenda = await prisma.frete.groupBy({
      by: ['origem', 'destino'],
      _sum: {
        receita: true,
        custos: true,
      },
      _count: true,
    });

    const rotasComLucro = rotasPorRenda.map((rota: any) => ({
      rota: `${rota.origem} → ${rota.destino}`,
      totalFretes: rota._count,
      receita: rota._sum.receita || 0,
      custos: rota._sum.custos || 0,
      lucro: (rota._sum.receita || 0) - (rota._sum.custos || 0),
    }));

    return rotasComLucro.sort((a: any, b: any) => b.lucro - a.lucro);
  }
}
