# 📊 Análise das Tabelas Necessárias - Frontend React

## Entidades Identificadas no Frontend

### 1. **USUÁRIO** (Autenticação)
- Campos esperados: `id`, `email`, `senha`, `nome`

### 2. **MOTORISTA**
- id, nome, cpf, telefone, status (ativo/inativo/férias)
- **Novos campos**: `receitaGerada`, `viagensRealizadas`, `dataAdmissao`

### 3. **CAMINHÃO**
- id, placa, modelo, capacidade
- **Novos campos**: `status` (disponível/em_viagem/manutenção), `kmRodados`

### 4. **FRETE** (Principal)
- id, origem, destino, status (pendente/em_transito/concluido/cancelado)
- receita, custos, resultado
- motoristaId, caminhaoId
- **Novos campos**: 
  - `mercadoriaId` (tipo de amendoim)
  - `quantidadeSacas`
  - `dataPartida`, `dataChegada` (já tem)

### 5. **MERCADORIA** ⭐ (NOVO)
- id, nome, tipo, tarifaPorSaca, pesoMedioSaca

### 6. **CUSTO** ⭐ (NOVO)
- id, freteId, tipo (combustivel/manutencao/pedagio/outros)
- descricao, valor, data, comprovante

### 7. **CUSTO_ABASTECIMENTO** ⭐ (NOVO - Referência de preços)
- caminhaoId, custoLitro (preço do combustível por caminhão)

### 8. **CUSTO_MOTORISTA** ⭐ (NOVO - Tabela de referência)
- motoristaId, diaria, adicionalPernoite

## Fluxos de Negócio Observados

1. **Criar Frete**: 
   - Seleciona Motorista, Caminhão, Mercadoria
   - Calcula: receita (sacas × tarifa), custos (combustível + diária), resultado

2. **Dashboard KPIs**:
   - Sacas Transportadas (soma de quantidadeSacas)
   - Taxa de Ocupação (fretes em trânsito / total caminhões)
   - Custo por Saca
   - Receita/Custos/Resultado

3. **Relatórios**:
   - Filtra por data, motorista
   - Exibe rota (origem → destino), receita, custos, resultado

4. **Gestão de Custos**:
   - Registra custos adicionais por frete
   - Categoriza: Combustível, Manutenção, Pedágio, Outros
