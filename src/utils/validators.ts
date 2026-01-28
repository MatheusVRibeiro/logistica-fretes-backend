import { z } from 'zod';

// ==================== AUTENTICAÇÃO ====================
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ==================== USUÁRIO ====================
export const CriarUsuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type CriarUsuarioInput = z.infer<typeof CriarUsuarioSchema>;

// ==================== MOTORISTA ====================
export const CriarMotoristaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  telefone: z.string().min(10, 'Telefone inválido'),
});

export type CriarMotoristaInput = z.infer<typeof CriarMotoristaSchema>;

export const AtualizarMotoristaSchema = CriarMotoristaSchema.partial();

export type AtualizarMotoristaInput = z.infer<typeof AtualizarMotoristaSchema>;

// ==================== CAMINHÃO ====================
export const CriarCaminhaoSchema = z.object({
  placa: z.string().regex(/^[A-Z]{3}-?\d{4}$/, 'Placa inválida'),
  modelo: z.string().min(3, 'Modelo deve ter pelo menos 3 caracteres'),
  capacidade: z.number().positive('Capacidade deve ser maior que 0'),
});

export type CriarCaminhaoInput = z.infer<typeof CriarCaminhaoSchema>;

export const AtualizarCaminhaoSchema = CriarCaminhaoSchema.partial();

export type AtualizarCaminhaoInput = z.infer<typeof AtualizarCaminhaoSchema>;

// ==================== FRETE ====================
export const CriarFreteSchema = z.object({
  origem: z.string().min(3, 'Origem deve ter pelo menos 3 caracteres'),
  destino: z.string().min(3, 'Destino deve ter pelo menos 3 caracteres'),
  receita: z.number().positive('Receita deve ser maior que 0'),
  custos: z.number().positive('Custos devem ser maior que 0'),
  motoristaId: z.string().cuid('ID do motorista inválido'),
  caminhaoId: z.string().cuid('ID do caminhão inválido'),
  descricao: z.string().optional(),
  dataPartida: z.string().datetime().optional(),
  dataChegada: z.string().datetime().optional(),
});

export type CriarFreteInput = z.infer<typeof CriarFreteSchema>;

export const AtualizarFreteSchema = z.object({
  origem: z.string().min(3).optional(),
  destino: z.string().min(3).optional(),
  status: z.enum(['PENDENTE', 'EM_TRANSITO', 'CONCLUIDO', 'CANCELADO']).optional(),
  receita: z.number().positive().optional(),
  custos: z.number().positive().optional(),
  descricao: z.string().optional(),
  dataPartida: z.string().datetime().optional(),
  dataChegada: z.string().datetime().optional(),
});

export type AtualizarFreteInput = z.infer<typeof AtualizarFreteSchema>;
