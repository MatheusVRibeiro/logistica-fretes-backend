# ✅ Tabelas Ajustadas para Frontend React

## 📝 Resumo das Alterações

O schema do banco de dados foi **completamente reestruturado** com base na análise do frontend React. As mudanças garantem compatibilidade 100% com as requisições e fluxos de negócio da aplicação.

---

## 🆕 Novas Tabelas Adicionadas

### 1. **MERCADORIAS**
Armazena tipos de amendoim com tarifas de transporte.

```sql
CREATE TABLE mercadorias (
  id VARCHAR(255) PRIMARY KEY,
  nome VARCHAR(255),              -- Ex: "Amendoim em Casca"
  tipo VARCHAR(100),              -- Ex: "In Natura"
  tarifaPorSaca FLOAT,            -- Preço por saca (R$)
  pesoMedioSaca FLOAT DEFAULT 25, -- Peso em kg
  ativo BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**Exemplo de dados:**
```
| id | nome | tipo | tarifaPorSaca | pesoMedioSaca |
|----|------|------|---------------|---------------|
| 1  | Amendoim em Casca | In Natura | 15 | 25 |
| 2  | Amendoim Descascado | Processado | 20 | 25 |
| 3  | Amendoim Premium | Gourmet | 25 | 25 |
```

---

### 2. **CUSTO_ABASTECIMENTO** (Tabela de Referência)
Preço do combustível por caminhão (usado no cálculo de custos de frete).

```sql
CREATE TABLE custo_abastecimento (
  id VARCHAR(255) PRIMARY KEY,
  caminhaoId VARCHAR(255),     -- FK para caminhões
  custoLitro FLOAT,            -- Ex: 5.50 R$/litro
  dataAtualizacao TIMESTAMP
);
```

---

### 3. **CUSTO_MOTORISTA** (Tabela de Referência)
Diária e pernoites dos motoristas (usado no cálculo de custos de frete).

```sql
CREATE TABLE custo_motorista (
  id VARCHAR(255) PRIMARY KEY,
  motoristaId VARCHAR(255),        -- FK para motoristas
  diaria FLOAT,                    -- Ex: 150 R$/dia
  adicionalPernoite FLOAT,         -- Ex: 80 R$ por pernoite
  dataAtualizacao TIMESTAMP
);
```

---

### 4. **CUSTOS** (Despesas Adicionais)
Registra custos adicionais por frete (combustível, manutenção, pedágios).

```sql
CREATE TABLE custos (
  id VARCHAR(255) PRIMARY KEY,
  freteId VARCHAR(255),                           -- FK para fretes
  tipo ENUM('combustivel', 'manutencao', 'pedagio', 'outros'),
  descricao TEXT,                                 -- Ex: "Abastecimento em Brasília"
  valor FLOAT,                                    -- Ex: 250.00
  data DATE,                                      -- Data do custo
  comprovante BOOLEAN DEFAULT false,              -- Se tem comprovante
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**Exemplo de dados:**
```
| id | freteId | tipo | descricao | valor | data |
|----|---------|------|-----------|-------|------|
| 1 | #1250 | combustivel | Abastecimento | 250.00 | 2025-01-20 |
| 2 | #1250 | pedagio | Pedágio BR-116 | 45.50 | 2025-01-20 |
```

---

## 🔄 Tabelas Modificadas

### **MOTORISTAS**
Adicionados campos para estatísticas de desempenho:

```sql
-- ADICIONADOS:
status ENUM('ativo', 'inativo', 'ferias') DEFAULT 'ativo',
receitaGerada FLOAT DEFAULT 0,              -- Receita total gerada
viagensRealizadas INT DEFAULT 0,            -- Número de fretes
dataAdmissao DATE,                          -- Quando foi admitido
INDEX idx_status (status)
```

---

### **CAMINHÕES**
Adicionados campos de rastreamento e status:

```sql
-- ADICIONADOS:
status ENUM('disponivel', 'em_viagem', 'manutencao') DEFAULT 'disponivel',
kmRodados FLOAT DEFAULT 0,                  -- KM total rodado
INDEX idx_status (status)
```

---

### **FRETES**
Alterações críticas para suportar lógica de cálculo:

```sql
-- ADICIONADO:
mercadoriaId VARCHAR(255),              -- Qual tipo de amendoim
quantidadeSacas INT DEFAULT 0,          -- Quantidade transportada

-- ALTERADO (Enum em minúsculas):
-- De: ENUM('PENDENTE', 'EM_TRANSITO', ...)
-- Para: ENUM('pendente', 'em_transito', 'concluido', 'cancelado')

-- ADICIONADO FK:
FOREIGN KEY (mercadoriaId) REFERENCES mercadorias(id) ON SET NULL,
INDEX idx_mercadoria (mercadoriaId)
```

---

## 💾 Dados Iniciais Recomendados

### Inserir Mercadorias Padrão:
```sql
INSERT INTO mercadorias (id, nome, tipo, tarifaPorSaca, pesoMedioSaca) VALUES
('1', 'Amendoim em Casca', 'In Natura', 15, 25),
('2', 'Amendoim Descascado', 'Processado', 20, 25),
('3', 'Amendoim Premium', 'Gourmet', 25, 25),
('4', 'Amendoim Tipo 1', 'Industrial', 18, 25),
('5', 'Amendoim Tipo 2', 'Industrial', 16, 25);
```

### Inserir Custos de Abastecimento:
```sql
INSERT INTO custo_abastecimento (id, caminhaoId, custoLitro) VALUES
('1', '1', 5.50),  -- ABC-1234
('2', '2', 5.30),  -- DEF-5678
('3', '3', 5.80),  -- GHI-9012
('4', '4', 5.40),  -- JKL-3456
('5', '5', 5.60);  -- MNO-7890
```

### Inserir Custos de Motoristas:
```sql
INSERT INTO custo_motorista (id, motoristaId, diaria, adicionalPernoite) VALUES
('1', '1', 150, 80),   -- Carlos Silva
('2', '2', 140, 75),   -- João Oliveira
('3', '3', 160, 85),   -- Pedro Santos
('4', '4', 145, 78),   -- André Costa
('5', '5', 155, 82);   -- Lucas Ferreira
```

---

## 🔗 Relacionamentos Atualizados

```
USUÁRIO (autenticação)
    ↓
FRETE ←→ MOTORISTA
    ↓    ↓
    ├→ CAMINHÃO
    ├→ MERCADORIA
    └→ CUSTOS (despesas adicionais)

CUSTO_ABASTECIMENTO ← CAMINHÃO (tabela de referência)
CUSTO_MOTORISTA ← MOTORISTA (tabela de referência)
```

---

## 📊 Exemplo de Fluxo Completo

### 1. **Criar Frete**
```javascript
POST /api/fretes
{
  origem: "Fazenda Santa Rita",
  destino: "Secador Central",
  motoristaId: "1",           // Carlos Silva
  caminhaoId: "1",            // ABC-1234
  mercadoriaId: "1",          // Amendoim em Casca
  quantidadeSacas: 450,
  dataPartida: "2025-01-20T08:30:00"
}
```

### 2. **Sistema Calcula Automaticamente**
```
receita = 450 sacas × R$15/saca = R$6.750
custos = combustível + diária
  - Combustível: 450 sacas × 25kg = 11.250kg ÷ 1000 × 150km ÷ 8km/l × R$5.50 = ~R$1.210
  - Diária motorista: R$150
  - Total custos: ~R$1.360
resultado = R$6.750 - R$1.360 = R$5.390
```

### 3. **Adicionar Despesas Extras**
```javascript
POST /api/custos
{
  freteId: "#1250",
  tipo: "pedagio",
  descricao: "Pedágio BR-116",
  valor: 45.50,
  data: "2025-01-20"
}
```

Custos total agora = R$1.360 + R$45.50 = R$1.405.50
Resultado = R$6.750 - R$1.405.50 = R$5.344.50

---

## 🚀 Próximos Passos

1. **Executar schema.sql** para criar as tabelas
2. **Popular dados iniciais** (mercadorias, custos de referência)
3. **Implementar endpoints da API**:
   - ✅ GET/POST `/api/mercadorias`
   - ✅ GET/POST `/api/custos`
   - ✅ PUT `/api/fretes/:id` (com cálculo de custos)
   - ✅ GET `/api/dashboard/kpis` (com novos KPIs)

---

## 📋 Checklist de Integração

- [ ] Schema SQL executado
- [ ] Dados iniciais inseridos
- [ ] Endpoints de Mercadorias funcionando
- [ ] Endpoints de Custos funcionando
- [ ] Cálculo de custos de frete no backend
- [ ] Frontend conectado aos novos endpoints
- [ ] Testes de fluxo completo

---

**Data de Atualização**: 28 de Janeiro de 2026  
**Status**: ✅ Pronto para Implementação
