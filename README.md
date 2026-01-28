# Intelligent Logistics Backend

Backend do zero para um sistema de Gestão de Logística e Fretes Inteligentes com Node.js, TypeScript, Express, Prisma e MySQL.

## 🚀 Stack Tecnológica

- **Linguagem**: Node.js com TypeScript
- **Framework**: Express.js
- **Base de Dados**: MySQL (compatível com AWS RDS)
- **ORM**: Prisma
- **Autenticação**: JWT
- **Validação**: Zod
- **Hash de Senhas**: Bcrypt

## 📁 Estrutura do Projeto

```
src/
├── database/          # Configuração do Prisma Client
├── middlewares/       # Auth JWT, Logger, Error Handler
├── models/            # Schema Prisma
├── controllers/       # Controladores de requisições
├── services/          # Lógica de negócio
├── routes/            # Definição de endpoints
├── utils/             # Validadores Zod e tipos
├── types/             # Tipos TypeScript globais
└── server.ts          # Arquivo principal
```

## 🔧 Instalação

1. Clone o repositório e instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente criando um arquivo `.env`:
```
DATABASE_URL="mysql://user:password@localhost:3306/logistica_db"
JWT_SECRET="seu_secret_key_aqui"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```

3. Execute as migrações do Prisma:
```bash
npm run prisma:migrate
```

4. Inicie o servidor em desenvolvimento:
```bash
npm run dev
```

## 📦 Funcionalidades Iniciais

- ✅ Autenticação com JWT
- ✅ Dashboard com KPIs agregados
- ✅ CRUD de Fretes
- ✅ Gestão de Motoristas
- ✅ Gestão de Caminhões
- ✅ Validação com Zod

## 📝 Endpoints Disponíveis

### Auth
- `POST /api/auth/login` - Login de usuário

### Dashboard
- `GET /api/dashboard/kpis` - Obter KPIs agregados

### Fretes
- `GET /api/fretes` - Listar fretes
- `POST /api/fretes` - Criar frete
- `PUT /api/fretes/:id` - Atualizar frete
- `DELETE /api/fretes/:id` - Deletar frete

### Motoristas
- `GET /api/motoristas` - Listar motoristas
- `POST /api/motoristas` - Criar motorista

### Caminhões
- `GET /api/caminhoes` - Listar caminhões
- `POST /api/caminhoes` - Criar caminhão

## 🛡️ Segurança

- Senhas criptografadas com Bcrypt
- JWT para autenticação e autorização
- Validação de entrada com Zod
- CORS configurado
- Error handling centralizado

## 📚 Documentação

Para mais informações sobre o projeto, consulte os arquivos de configuração e os comentários no código.
