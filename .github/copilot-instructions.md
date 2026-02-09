<!-- Este é um arquivo de instruções customizado para Copilot -->

# Backend - Sistema de Logística e Fretes Inteligentes

## ✅ Projeto Criado com Sucesso!

O backend foi **completamente estruturado, configurado e compilado** com sucesso. Toda a arquitetura está pronta para desenvolvimento.

---

## 📦 O que foi Implementado

### **Stack Tecnológico**
- ✅ **Node.js + TypeScript** - Linguagem tipada
- ✅ **Express.js** - Framework web
- ✅ **SQL Puro com mysql2** - Gestão de dados
- ✅ **MySQL** - Base de dados (compatível com AWS RDS)
- ✅ **JWT** - Autenticação
- ✅ **Bcrypt** - Hash de senhas
- ✅ **Zod** - Validação de dados
- ✅ **CORS & Morgan** - Middleware de produção

### **Estrutura Arquitetônica**

```
logistica-fretes-backend/
├── src/
│   ├── database/           # Conexão MySQL e init_database.sql
│   ├── middlewares/        # Auth JWT, Error Handler
│   ├── controllers/        # 10 controllers: Auth, Dashboard, Frete, Motorista, Frota, Fazenda, Custo, Pagamento, Usuario, LocaisEntrega
│   ├── routes/             # 10 arquivos de rotas
│   ├── types/              # Tipos TypeScript
│   ├── utils/              # Validadores Zod, ID generator, SQL helpers
│   └── server.ts           # Arquivo principal
├── dist/                   # Build compilado ✅
├── package.json            # Dependências configuradas
├── tsconfig.json           # TypeScript configurado
├── .env                    # Variáveis de ambiente
└── README.md               # Documentação
```

---

## 🗄️ Entidades do Banco de Dados (Modelo Atualizado)

### **usuarios**
- id, nome, email (único), senha_hash (bcrypt), role (admin/operador/contabilidade)
- ativo, telefone, cpf, ultimo_acesso, tentativas_login_falhas
- token_recuperacao, timestamps

### **motoristas**
- id, nome, cpf (único), telefone, email, endereco
- cnh, cnh_validade, cnh_categoria, status (ativo/inativo/ferias)
- tipo (proprio/terceirizado), data_admissao, data_desligamento
- tipo_pagamento, chave_pix, banco, agencia, conta
- receita_gerada, viagens_realizadas, caminhao_atual

### **Frota** (caminhões)
- id, placa (única), placa_carreta, modelo, ano_fabricacao
- status (disponivel/em_viagem/manutencao), motorista_fixo_id
- capacidade_toneladas, km_atual, tipo_combustivel, tipo_veiculo
- renavam, chassi, registro_antt, validade_seguro, proprietario_tipo

### **fazendas**
- id, fazenda (nome), localizacao, proprietario, mercadoria, variedade
- safra, preco_por_tonelada, peso_medio_saca
- total_sacas_carregadas, total_toneladas, faturamento_total
- ultimo_frete, colheita_finalizada

### **fretes**
- id, origem, destino, motorista_id, motorista_nome
- caminhao_id, caminhao_placa, fazenda_id, fazenda_nome
- mercadoria, variedade, data_frete, quantidade_sacas, toneladas
- valor_por_tonelada, receita, custos, resultado, pagamento_id

### **custos**
- id, frete_id, tipo (combustivel/manutencao/pedagio/outros)
- descricao, valor, data, comprovante, observacoes
- motorista, caminhao, rota, litros, tipo_combustivel

### **pagamentos**
- id, motorista_id, motorista_nome, periodo_fretes
- quantidade_fretes, fretes_incluidos, total_toneladas
- valor_por_tonelada, valor_total, data_pagamento
- status (pendente/processando/pago/cancelado), metodo_pagamento
- comprovante_nome, comprovante_url, observacoes

> **Nota:** `notas_fiscais` e `locais_entrega` foram removidas do schema atual

---

## 🔌 Endpoints da API (Rotas Simples - sem /api)

### **Autenticação (conveniência)**
```
GET    /login                  - Mensagem instrutiva
POST   /login                  - Login (retorna JWT)
POST   /registrar              - Registro novo usuário
POST   /auth/login             - Alternativa com prefixo /auth
POST   /auth/registrar         - Alternativa com prefixo /auth
```

### **Dashboard**
```
GET    /dashboard/kpis                    - KPIs (Receita, Custos, Lucro, Margem)
GET    /dashboard/estatisticas-rotas      - Análise de rentabilidade por rota
```

### **Fazendas (CRUD)**
```
GET    /fazendas               - Listar todas as fazendas
GET    /fazendas/:id           - Obter fazenda específica
POST   /fazendas               - Criar fazenda (validação Zod)
PUT    /fazendas/:id           - Atualizar fazenda
DELETE /fazendas/:id           - Deletar fazenda
```

### **Motoristas (CRUD)**
```
GET    /motoristas             - Listar motoristas
GET    /motoristas/:id         - Obter motorista específico
POST   /motoristas             - Criar motorista
PUT    /motoristas/:id         - Atualizar motorista
DELETE /motoristas/:id         - Deletar motorista
```

### **Frota/Caminhões (CRUD)**
```
GET    /frota                  - Listar frota
GET    /frota/:id              - Obter veículo específico
POST   /frota                  - Criar veículo
PUT    /frota/:id              - Atualizar veículo
DELETE /frota/:id              - Deletar veículo
```

### **Fretes (CRUD)**
```
GET    /fretes                 - Listar fretes
GET    /fretes/:id             - Obter frete específico
POST   /fretes                 - Criar frete (validação Zod)
PUT    /fretes/:id             - Atualizar frete
DELETE /fretes/:id             - Deletar frete
```

### **Custos (CRUD)**
```
GET    /custos                 - Listar custos
GET    /custos/:id             - Obter custo específico
POST   /custos                 - Criar custo
PUT    /custos/:id             - Atualizar custo
DELETE /custos/:id             - Deletar custo
```

### **Pagamentos (CRUD)**
```
GET    /pagamentos             - Listar pagamentos
GET    /pagamentos/:id         - Obter pagamento específico
POST   /pagamentos             - Criar pagamento
PUT    /pagamentos/:id         - Atualizar pagamento
DELETE /pagamentos/:id         - Deletar pagamento
```

### **Usuários (CRUD)**
```
GET    /usuarios               - Listar usuários
GET    /usuarios/:id           - Obter usuário específico
POST   /usuarios               - Criar usuário
PUT    /usuarios/:id           - Atualizar usuário
DELETE /usuarios/:id           - Deletar usuário
```

> **IMPORTANTE:** Todas as rotas (exceto `/login` e `/registrar`) exigem autenticação JWT via header `Authorization: Bearer <token>`

---

## 🚀 Como Usar

### **1. Configurar MySQL**

```bash
# Criar banco de dados
mysql> CREATE DATABASE logistica_db;

# Ou usar Docker
docker run --name mysql-logistica -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=logistica_db -p 3306:3306 -d mysql:8
```

### **2. Configurar .env**

Editar arquivo `.env` (já existe com template):

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=logistica_db
JWT_SECRET="sua_chave_secreta_super_segura"
JWT_EXPIRES_IN="7d"
API_URL="http://localhost:3000"
```

### **3. Executar Schema SQL**

```bash
mysql -u root -p logistica_db < src/database/schema.sql
```

Isso criará todas as tabelas no MySQL automaticamente.

### **4. Iniciar Servidor**

```bash
# Modo desenvolvimento (com reload automático)
npm run dev

# Ou modo produção
npm run build
npm start
```

Servidor rodará em `http://localhost:3000`

### **5. Testar API**

```bash
# Health check
curl http://localhost:3000/health

# Registrar usuário
curl -X POST http://localhost:3000/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123"
  }'

# Login (pega JWT)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'

# Usar JWT para acessar Dashboard
curl -X GET http://localhost:3000/dashboard/kpis \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Listar fazendas (protegido)
curl -X GET http://localhost:3000/fazendas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Listar motoristas (protegido)
curl -X GET http://localhost:3000/motoristas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🛠️ Comandos Disponíveis

```bash
npm run dev              # Desenvolver em tempo real
npm run build            # Compilar TypeScript
npm start                # Rodar versão compilada
npm run type-check       # Verificar tipos TypeScript
```

---

## 🔐 Segurança Implementada

✅ **JWT** - Tokens com expiração  
✅ **Bcrypt** - Senhas hasheadas (10 rounds)  
✅ **Zod** - Validação de inputs  
✅ **CORS** - Proteção contra requisições inválidas  
✅ **Error Handler** - Tratamento centralizado de erros  
✅ **TypeScript** - Type-safe em tempo de compilação

### **⚠️ Para Produção:**
1. Mudar `JWT_SECRET` por valor forte
2. Usar `NODE_ENV=production`
3. Adicionar Rate Limiting
4. Habilitar HTTPS
5. Configurar CORS específico

---

## 📚 Estrutura de Código

### **Service Layer** (Lógica de Negócio)
```typescript
class FreteService {
  async criarFrete(input: CriarFreteInput) {
    // Validação de motorista e caminhão
    // Cálculo automático de resultado (receita - custos)
    // Persistência no banco
  }
}
```

### **Controller Layer** (HTTP)
```typescript
class FreteController {
  async criar(req: AuthRequest, res: Response) {
    const validacao = CriarFreteSchema.parse(req.body);
    const frete = await freteService.criarFrete(validacao);
    res.status(201).json({ success: true, data: frete });
  }
}
```

### **Validação Zod**
```typescript
const CriarFreteSchema = z.object({
  origem: z.string().min(3),
  destino: z.string().min(3),
  receita: z.number().positive(),
  custos: z.number().positive(),
  motoristaId: z.string().cuid(),
  caminhaoId: z.string().cuid(),
});
```

---

## 🔍 Dashboard KPIs

A API retorna automaticamente:

```json
{
  "receitaTotal": 50000.00,
  "custosTotal": 15000.00,
  "lucroTotal": 35000.00,
  "margemLucro": 70.00,
  "totalFretes": 25,
  "motoristasAtivos": 5,
  "caminhoeAtivos": 3,
  "fretesPorStatus": [
    { "status": "CONCLUIDO", "_count": 20 },
    { "status": "PENDENTE", "_count": 5 }
  ]
}
```

---

## 📝 Próximos Passos (Recomendados)

- [ ] Criar CRUD de Motoristas e Caminhões
- [ ] Adicionar filtros avançados em Fretes
- [ ] Implementar paginação com cursores
- [ ] Adicionar Swagger/OpenAPI
- [ ] Testes unitários com Jest
- [ ] Cache com Redis
- [ ] Webhooks para eventos
- [ ] Email notifications
- [ ] Logging estruturado
- [ ] Métricas com Prometheus

---

## ⚠️ Troubleshooting

| Problema | Solução |
|----------|---------|
| "Connection refused" | Verificar se MySQL está rodando |
| "Token inválido" | Incluir "Bearer " antes do JWT |
| "DUP_ENTRY" | Campo único duplicado, verificar dados |
| "Port 3000 already in use" | Usar `PORT=3001 npm run dev` |

---

## 📞 Documentação Externa

- [Express.js](https://expressjs.com)
- [MySQL2](https://www.npmjs.com/package/mysql2)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [Zod](https://zod.dev)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)

---

## ✨ Status

- **Projeto**: ✅ Criado
- **Dependências**: ✅ Instaladas
- **TypeScript**: ✅ Compilado sem erros
- **Build**: ✅ Gerado em `dist/`
- **MySQL2**: ✅ Configurado
- **Pronto para**: 🚀 Desenvolvimento

---

**Versão**: 1.0.0  
**Data**: Janeiro 28, 2026  
**Status**: ✅ Pronto para usar (SQL Puro)!

Para começar: `npm run dev` 🎉
