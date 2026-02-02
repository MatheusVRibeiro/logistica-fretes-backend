# 🔧 Guia de Implementação - Backend para Frontend

## ⚠️ Mudanças Importantes nos Enums

O frontend usa **valores em minúsculas com underscore** para enums. O backend foi ajustado para compatibilidade:

### Status de Frete
```
Frontend/DB: 'pendente', 'em_transito', 'concluido', 'cancelado'
Antigo:      'PENDENTE', 'EM_TRANSITO', 'CONCLUIDO', 'CANCELADO'
```

### Status de Motorista
```
Novo: 'ativo', 'inativo', 'ferias'
```

### Status de Caminhão
```
Novo: 'disponivel', 'em_viagem', 'manutencao'
```

### Tipo de Custo
```
Novo: 'combustivel', 'manutencao', 'pedagio', 'outros'
```

---

## 📡 Endpoints Esperados pelo Frontend

### **Autenticação**
```
POST /api/auth/login
POST /api/auth/registrar
```

### **Dashboard**
```
GET /api/dashboard/kpis
  Response: {
    janeiro: {
      fretesAtivos: number,
      totalSacas: number,
      totalReceita: number,
      totalCustos: number,
      totalResultado: number,
      custoPorSaca: number,
      taxaOcupacao: number
    },
    dezembro: { ... },
    trends: { sacas, custoPorSaca, resultado }
  }

GET /api/dashboard/estatisticas-rotas
```

### **Fretes (CRUD)**
```
GET /api/fretes?status=pendente&motorista=1&page=1&limit=10
  Response: { fretes: [], total, page, pageSize }

GET /api/fretes/:id
  Response: { frete com relacionamentos }

POST /api/fretes
  Body: {
    origem: string,
    destino: string,
    motoristaId: string,
    caminhaoId: string,
    mercadoriaId: string,
    quantidadeSacas: number
  }

PUT /api/fretes/:id
  Body: { status, receita, custos, ... }

DELETE /api/fretes/:id
```

### **Motoristas**
```
GET /api/motoristas
GET /api/motoristas/:id
POST /api/motoristas
PUT /api/motoristas/:id
DELETE /api/motoristas/:id

Response fields:
{
  id, nome, cpf, telefone, status,
  receitaGerada, viagensRealizadas, dataAdmissao
}
```

### **Caminhões**
```
GET /api/caminhoes
GET /api/caminhoes/:id
POST /api/caminhoes
PUT /api/caminhoes/:id
DELETE /api/caminhoes/:id

Response fields:
{
  id, placa, modelo, capacidade,
  status, kmRodados, ativo
}
```

### **Mercadorias**
```
GET /api/mercadorias
POST /api/mercadorias
PUT /api/mercadorias/:id
DELETE /api/mercadorias/:id

Response fields:
{ id, nome, tipo, tarifaPorSaca, pesoMedioSaca }
```

### **Custos**
```
GET /api/custos?freteId=xxx
POST /api/custos
PUT /api/custos/:id
DELETE /api/custos/:id

Response fields:
{ id, freteId, tipo, descricao, valor, data, comprovante }
```

---

## 🧮 Lógica de Cálculo de Custos

### Quando criar frete, o backend deve calcular:

```typescript
// 1. Receita
receita = quantidadeSacas * tarifaPorSaca

// 2. Custos
// a) Combustível (estimado)
//    - Assumir: 8km por litro
//    - Distância: estimada pela rota (ou valor fixo de 150km)
//    - combustivel = (distancia / 8) * custoLitroAbastecimento

// b) Motorista (diária)
//    - motorista = diaria + (pernoite se distancia > 500km)

// c) Outros custos do frete (somados depois)
//    - combustivel + motorista + outros

// 3. Resultado
resultado = receita - custos

// 4. Atualizar Motorista
motorista.receitaGerada += receita
motorista.viagensRealizadas += 1
```

---

## 📝 Atualizações de Motorista/Caminhão

Quando um frete é criado/concluído:

```sql
-- Atualizar Motorista
UPDATE motoristas 
SET receitaGerada = receitaGerada + ?,
    viagensRealizadas = viagensRealizadas + 1
WHERE id = ?;

-- Atualizar Caminhão
UPDATE caminhoes 
SET kmRodados = kmRodados + ?,
    status = 'em_viagem'
WHERE id = ?;

-- Quando frete termina, voltar status
UPDATE caminhoes 
SET status = 'disponivel'
WHERE id = ? AND id NOT IN (
  SELECT caminhaoId FROM fretes WHERE status IN ('pendente', 'em_transito')
);
```

---

## 🔍 Filtros Importantes

### Listar Fretes com Filtros
```typescript
GET /api/fretes?status=em_transito&motorista=1&mes=jan&page=1

// SQL:
// WHERE status = 'em_transito'
// AND motoristaId = '1'
// AND MONTH(createdAt) = 1 AND YEAR(createdAt) = 2025
// ORDER BY createdAt DESC
// LIMIT 10 OFFSET 0
```

### KPIs - Dashboard
```typescript
// Janeiro (mês atual)
SELECT COUNT(*) as fretesAtivos,
       SUM(quantidadeSacas) as totalSacas,
       SUM(receita) as totalReceita,
       SUM(custos) as totalCustos,
       SUM(receita - custos) as totalResultado
FROM fretes
WHERE MONTH(createdAt) = 1 
  AND YEAR(createdAt) = 2025
  AND status != 'cancelado';

// Custo por Saca
custoPorSaca = totalCustos / totalSacas

// Taxa de Ocupação
taxaOcupacao = (fretesEmTransito / totalCaminhoes) * 100
```

---

## 🛠️ Exemplo de Implementação - Service

```typescript
export class FreteService {
  async criarFrete(input: CriarFreteInput, db: Database) {
    // 1. Validar motorista e caminhão
    const motorista = await this.obterMotorista(input.motoristaId, db);
    const caminhao = await this.obterCaminhao(input.caminhaoId, db);
    const mercadoria = await this.obterMercadoria(input.mercadoriaId, db);

    // 2. Calcular custos
    const receita = input.quantidadeSacas * mercadoria.tarifaPorSaca;
    const custos = await this.calcularCustos(
      input.caminhaoId,
      input.motoristaId,
      input.quantidadeSacas,
      db
    );
    const resultado = receita - custos;

    // 3. Criar frete
    const frete = await db.pool.query(
      `INSERT INTO fretes (...) VALUES (...)`,
      [...]
    );

    // 4. Atualizar motorista
    await db.pool.query(
      `UPDATE motoristas SET receitaGerada = receitaGerada + ?, 
       viagensRealizadas = viagensRealizadas + 1 WHERE id = ?`,
      [receita, input.motoristaId]
    );

    return frete;
  }

  private async calcularCustos(
    caminhaoId: string,
    motoristaId: string,
    quantidadeSacas: number,
    db: Database
  ) {
    // Buscar custos de referência
    const [abastecimento] = await db.pool.query(
      `SELECT custoLitro FROM custo_abastecimento WHERE caminhaoId = ?`,
      [caminhaoId]
    );

    const [motorista] = await db.pool.query(
      `SELECT diaria FROM custo_motorista WHERE motoristaId = ?`,
      [motoristaId]
    );

    // Calcular (distância estimada = 150km, 8km/litro)
    const custoCombustivel = (150 / 8) * abastecimento.custoLitro;
    const custoMotorista = motorista.diaria;

    return custoCombustivel + custoMotorista;
  }
}
```

---

**Versão**: 1.0.0
**Última Atualização**: 28 de Janeiro de 2026
