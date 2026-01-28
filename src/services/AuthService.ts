import prisma from '../database/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/auth';
import { CriarUsuarioInput, LoginInput } from '../utils/validators';

export class AuthService {
  async login(input: LoginInput) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: input.email },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(input.senha, usuario.senha);

    if (!senhaValida) {
      throw new Error('Senha inválida');
    }

    const token = generateToken(usuario.id, usuario.email);

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }

  async criarUsuario(input: CriarUsuarioInput) {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: input.email },
    });

    if (usuarioExistente) {
      throw new Error('Usuário com este email já existe');
    }

    const senhaCriptografada = await bcrypt.hash(input.senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome: input.nome,
        email: input.email,
        senha: senhaCriptografada,
      },
    });

    const token = generateToken(usuario.id, usuario.email);

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }
}
