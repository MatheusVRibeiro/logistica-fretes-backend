# Intelligent Logistics Backend

Backend do zero para um sistema de Gestão de Logística e Fretes Inteligentes com Node.js, TypeScript, Express, SQL Puro e MySQL.

## 🚀 Stack Tecnológica

- **Linguagem**: Node.js com TypeScript
- **Framework**: Express.js
- **Base de Dados**: MySQL (compatível com AWS RDS)
- **Banco de Dados**: SQL Puro com mysql2
- **Autenticação**: JWT
- **Validação**: Zod
- **Hash de Senhas**: Bcrypt

## 📁 Estrutura do Projeto

```
src/
├── database/          # Configuração e conexão MySQL
├── middlewares/       # Auth JWT, Logger, Error Handler
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
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=logistica_db
JWT_SECRET="seu_secret_key_aqui"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```

3. Crie as tabelas no MySQL usando o schema:
```bash
mysql -u root -p logistica_db < src/database/schema.sql
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
# Intelligent Logistics Backend

Backend para o sistema de Gestão de Logística e Fretes (modelo atual atualizado).

## 🚀 Visão Geral

- Linguagem: Node.js + TypeScript
- Framework: Express
- Banco: MySQL (mysql2) — compatível com AWS RDS
- Autenticação: JWT
- Validação: Zod
- Hash de senhas: Bcrypt

## 📘 Modelo de Negócio (Entidades principais)

- `usuarios` — autenticação e papéis (admin/operador/contabilidade)
- `motoristas` — dados pessoais, CNH, tipo (próprio/terceirizado)
- `Frota` — caminhões, capacidades, placa, status
- `fazendas` — origem dos fretes, preços por tonelada
- `fretes` — registro de operação (origem, destino, motorista, caminhão, valores)
- `custos` — custos por frete (combustível, pedágio, manutenção)
- `pagamentos` — pagamentos a motoristas

> Observação: `notas_fiscais` e `locais_entrega` foram removidas do schema atual.

## 🛣️ Rotas públicas (padrão sem `/api`)

Autenticação (conveniência):
- `POST /login` — login (retorna JWT)
- `POST /registrar` — registrar usuário
- `GET  /login` — instrução de uso (mensagem)

Recursos (todos protegidos por JWT, exceto `/login` e `/registrar`):
- `GET  /fazendas`
- `GET  /fazendas/:id`
- `POST /fazendas`
- `PUT  /fazendas/:id`
- `DELETE /fazendas/:id`

- `GET  /motoristas`
- `GET  /motoristas/:id`
- `POST /motoristas`
- `PUT  /motoristas/:id`
- `DELETE /motoristas/:id`

- `GET  /fretes`
- `GET  /fretes/:id`
- `POST /fretes`
- `PUT  /fretes/:id`
- `DELETE /fretes/:id`

- `GET  /frota`
- `GET  /frota/:id`
- `POST /frota`
- `PUT  /frota/:id`
- `DELETE /frota/:id`

- `GET  /custos`
- `POST /custos`
- `PUT  /custos/:id`
- `DELETE /custos/:id`

- `GET  /pagamentos`
- `POST /pagamentos`
- `PUT  /pagamentos/:id`
- `DELETE /pagamentos/:id`

- `GET  /usuarios`
- `GET  /usuarios/:id`
- `POST /usuarios`
- `PUT  /usuarios/:id`
- `DELETE /usuarios/:id`

Dashboard:
- `GET /dashboard/kpis` — KPIs agregados (receita, custos, lucro, contagens)
- `GET /dashboard/estatisticas-rotas` — rentabilidade por rota

## 🔧 Como rodar (desenvolvimento)

1. Instale dependências:
```bash
npm install
```

2. Ajuste `.env` (exemplo minimal):
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=logistica_db
JWT_SECRET="sua_chave_jwt"
JWT_EXPIRES_IN="7d"
API_URL="http://localhost:3000"
```

3. Inicie em desenvolvimento:
```bash
npm run dev
```

4. Teste health:
```bash
curl http://localhost:3000/health
```

## ✅ Observações e Boas Práticas

- As rotas agora expõem caminhos simples (sem `/api`) para compatibilidade com integrações antigas.
- Todos os endpoints de leitura/escrita sensíveis exigem JWT (Authorization: Bearer <token>).
- Recomenda-se usar paginação (`limit`, `offset`) nas rotas de listagem em produção.
- Validações Zod já implementadas nos controllers — assegure-se de tratar erros de FK e duplicatas no frontend.

## 🔁 Próximos passos recomendados

1. Padronizar geração de IDs (usar `generateId()` em todos os controllers).
2. Implementar paginação nas listagens.
3. Adicionar validação pré-inserção de FKs (motorista, frota, fazenda).
4. Adicionar testes automatizados com Jest.

---
Para detalhes de implementação, consulte `src/controllers`, `src/routes` e `src/database`.
