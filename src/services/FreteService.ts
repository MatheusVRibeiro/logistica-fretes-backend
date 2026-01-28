import prisma from '../database/prisma';
import { CriarFreteInput, AtualizarFreteInput } from '../utils/validators';

export class FreteService {
  async listarFretes(status?: string, skip: number = 0, take: number = 10) {
    const where = status ? { status: status as any } : {};

    const fretes = await prisma.frete.findMany({
      where,
      include: {
        motorista: true,
        caminhao: true,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.frete.count({ where });

    return {
      fretes,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

  async obterFretePorId(id: string) {
    const frete = await prisma.frete.findUnique({
      where: { id },
      include: {
        motorista: true,
        caminhao: true,
      },
    });

    if (!frete) {
      throw new Error('Frete não encontrado');
    }

    return frete;
  }

  async criarFrete(input: CriarFreteInput) {
    // Validar se motorista existe
    const motorista = await prisma.motorista.findUnique({
      where: { id: input.motoristaId },
    });

    if (!motorista) {
      throw new Error('Motorista não encontrado');
    }

    // Validar se caminhão existe
    const caminhao = await prisma.caminhao.findUnique({
      where: { id: input.caminhaoId },
    });

    if (!caminhao) {
      throw new Error('Caminhão não encontrado');
    }

    const resultado = input.receita - input.custos;

    const frete = await prisma.frete.create({
      data: {
        origem: input.origem,
        destino: input.destino,
        receita: input.receita,
        custos: input.custos,
        resultado,
        motoristaId: input.motoristaId,
        caminhaoId: input.caminhaoId,
        descricao: input.descricao,
        dataPartida: input.dataPartida ? new Date(input.dataPartida) : null,
        dataChegada: input.dataChegada ? new Date(input.dataChegada) : null,
      },
      include: {
        motorista: true,
        caminhao: true,
      },
    });

    return frete;
  }

  async atualizarFrete(id: string, input: AtualizarFreteInput) {
    const frete = await prisma.frete.findUnique({ where: { id } });

    if (!frete) {
      throw new Error('Frete não encontrado');
    }

    // Se atualizar receita ou custos, recalcular resultado
    let resultado = frete.resultado;
    if (input.receita !== undefined || input.custos !== undefined) {
      const receita = input.receita !== undefined ? input.receita : frete.receita;
      const custos = input.custos !== undefined ? input.custos : frete.custos;
      resultado = receita - custos;
    }

    const freteAtualizado = await prisma.frete.update({
      where: { id },
      data: {
        ...input,
        resultado,
        dataPartida: input.dataPartida ? new Date(input.dataPartida) : frete.dataPartida,
        dataChegada: input.dataChegada ? new Date(input.dataChegada) : frete.dataChegada,
      },
      include: {
        motorista: true,
        caminhao: true,
      },
    });

    return freteAtualizado;
  }

  async deletarFrete(id: string) {
    const frete = await prisma.frete.findUnique({ where: { id } });

    if (!frete) {
      throw new Error('Frete não encontrado');
    }

    await prisma.frete.delete({ where: { id } });

    return { message: 'Frete deletado com sucesso' };
  }
}
