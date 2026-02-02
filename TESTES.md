# 🧪 Guia de Testes - API Backend Logística

## 📌 Preparação

1. Inicie o servidor: `npm run dev`
2. Tenha MySQL rodando
3. Execute o schema: `mysql -u root -p logistica_db < src/database/schema.sql` (se não feito)

---

## 🔐 Autenticação

### 1. Registrar novo usuário
**Endpoint:** `POST /api/auth/registrar`

```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "clx...",
      "nome": "João Silva",
      "email": "joao@example.com"
    }
  }
}
```

### 2. Fazer login
**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

**Salve o token retornado para os próximos testes!**

---

## 📊 Dashboard

### 3. Obter KPIs
**Endpoint:** `GET /api/dashboard/kpis`

```bash
curl -X GET http://localhost:3000/api/dashboard/kpis \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "KPIs obtidos com sucesso",
  "data": {
    "receitaTotal": 0,
    "custosTotal": 0,
    "lucroTotal": 0,
    "margemLucro": 0,
    "totalFretes": 0,
    "motoristasAtivos": 0,
    "caminhoeAtivos": 0,
    "fretesPorStatus": []
  }
}
```

### 4. Obter estatísticas por rota
**Endpoint:** `GET /api/dashboard/estatisticas-rotas`

```bash
curl -X GET http://localhost:3000/api/dashboard/estatisticas-rotas \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

---

## 🚚 Fretes

### Criar Motorista (necessário para frete)

Primeiro, você precisa criar um motorista e um caminhão. Para isso, use SQL direto ou crie endpoints adicionais:

```bash
mysql -u root -p logistica_db
INSERT INTO motoristas (id, nome, cpf, telefone) VALUES ('unique-id', 'João', '12345678901', '11999999999');
INSERT INTO caminhoes (id, placa, modelo, capacidade) VALUES ('unique-id-2', 'ABC1234', 'Volvo', 25.5);
```

### 5. Listar fretes
**Endpoint:** `GET /api/fretes`

```bash
curl -X GET "http://localhost:3000/api/fretes?page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

**Query params:**
- `page`: Número da página (padrão: 1)
- `limit`: Fretes por página (padrão: 10)
- `status`: Filtrar por status (PENDENTE, EM_TRANSITO, CONCLUIDO, CANCELADO)

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Fretes listados com sucesso",
  "data": {
    "fretes": [],
    "total": 0,
    "page": 1,
    "pageSize": 10
  }
}
```

### 6. Criar frete
**Endpoint:** `POST /api/fretes`

```bash
curl -X POST http://localhost:3000/api/fretes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -d '{
    "origem": "São Paulo",
    "destino": "Rio de Janeiro",
    "receita": 5000.00,
    "custos": 1500.00,
    "motoristaId": "SEU_MOTORISTA_ID",
    "caminhaoId": "SEU_CAMINHAO_ID",
    "descricao": "Entrega de eletrônicos"
  }'
```

### 7. Obter frete por ID
**Endpoint:** `GET /api/fretes/:id`

```bash
curl -X GET http://localhost:3000/api/fretes/SEU_FRETE_ID \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

### 8. Atualizar frete
**Endpoint:** `PUT /api/fretes/:id`

```bash
curl -X PUT http://localhost:3000/api/fretes/SEU_FRETE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI" \
  -d '{
    "status": "EM_TRANSITO",
    "receita": 5500.00
  }'
```

**Status válidos:** `PENDENTE`, `EM_TRANSITO`, `CONCLUIDO`, `CANCELADO`

### 9. Deletar frete
**Endpoint:** `DELETE /api/fretes/:id`

```bash
curl -X DELETE http://localhost:3000/api/fretes/SEU_FRETE_ID \
  -H "Authorization: Bearer SEU_TOKEN_JWT_AQUI"
```

---

## ✔️ Health Check

### Verificar se servidor está rodando
**Endpoint:** `GET /health`

```bash
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Backend está funcionando",
  "timestamp": "2026-01-27T20:00:00.000Z"
}
```

---

## 🐛 Testes de Erro

### 1. Requisição sem autenticação
```bash
curl -X GET http://localhost:3000/api/fretes
```

**Esperado:** Erro 401 Unauthorized

### 2. Token inválido
```bash
curl -X GET http://localhost:3000/api/fretes \
  -H "Authorization: Bearer token_invalido"
```

**Esperado:** Erro 401 Token inválido ou expirado

### 3. Validação de entrada
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalido",
    "senha": "123"
  }'
```

**Esperado:** Erro 400 com detalhes de validação

### 4. Rota não existente
```bash
curl http://localhost:3000/api/rota-inexistente
```

**Esperado:** Erro 404 Rota não encontrada

---

## 💡 Dicas

1. **Salve o token** em uma variável:
   ```bash
   TOKEN="seu_jwt_aqui"
   curl -X GET http://localhost:3000/api/dashboard/kpis \
     -H "Authorization: Bearer $TOKEN"
   ```

2. **Use Postman/Insomnia** para testes mais organizados

3. **Use SQL direto** para gerenciar dados:
   ```bash
   mysql -u root -p logistica_db
   ```

4. **Veja logs** no terminal onde npm run dev está rodando

---

## 📝 Checklist de Testes

- [ ] Health check retorna 200
- [ ] Registrar usuário funciona
- [ ] Login retorna token
- [ ] KPIs acessível com token
- [ ] Listar fretes (vazio inicialmente)
- [ ] Criar motorista (via SQL INSERT)
- [ ] Criar caminhão (via SQL INSERT)
- [ ] Criar frete com dados válidos
- [ ] Listar fretes retorna o frete criado
- [ ] Atualizar status de frete
- [ ] Deletar frete
- [ ] Erro ao acessar sem token
- [ ] Erro ao usar token inválido

---

**Status**: Todos os testes criados para validar a API! ✅
