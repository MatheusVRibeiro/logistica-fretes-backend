# 🚀 Quick Start - Backend Logística

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Verificar que está tudo pronto

```bash
npm run type-check    # Verificar tipos
npm run build         # Compilar
```

### 2️⃣ Configurar Banco de Dados

**Opção A: MySQL Local**
```bash
mysql -u root -p
CREATE DATABASE logistica_db;
```

**Opção B: Docker**
```bash
docker run --name mysql-logistica \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=logistica_db \
  -p 3306:3306 -d mysql:8
```

### 3️⃣ Editar `.env`

```bash
DATABASE_URL="mysql://root:password@localhost:3306/logistica_db"
JWT_SECRET="chave_secreta_aqui"
```

### 4️⃣ Executar Migrações

```bash
npm run prisma:migrate
```

### 5️⃣ Iniciar Servidor

```bash
npm run dev
```

O servidor estará em: **http://localhost:3000**

---

## 🧪 Testar API (copiar e colar)

### Registrar Usuário
```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@test.com","senha":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","senha":"123456"}'
```

**Copie o token retornado**

### Dashboard KPIs
```bash
curl -X GET http://localhost:3000/api/dashboard/kpis \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📋 Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `src/server.ts` | Entrada principal da aplicação |
| `prisma/schema.prisma` | Modelo de dados |
| `src/services/` | Lógica de negócio |
| `src/controllers/` | Handlers de requisições |
| `src/routes/` | Definição de endpoints |
| `src/utils/validators.ts` | Validações Zod |
| `.env` | Variáveis de ambiente |

---

## ❌ Troubleshooting Rápido

**Erro: "ECONNREFUSED"** 
→ MySQL não está rodando

**Erro: "Port already in use"**
→ `PORT=3001 npm run dev`

**Erro: "JWT not found"**
→ `npm run prisma:generate`

---

## 📚 Documentos Completos

- [SETUP.md](./SETUP.md) - Configuração detalhada
- [README.md](./README.md) - Documentação geral
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Instruções do Copilot

---

**Status**: ✅ Tudo pronto! Execute `npm run dev` para começar 🎉
