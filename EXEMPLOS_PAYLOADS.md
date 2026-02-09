# Exemplos de payloads

Este arquivo traz exemplos simples para testar os endpoints principais.

## Auth

POST /api/auth/login
```json
{
  "email": "admin@rnlogistica.com",
  "senha": "Admin@2025"
}
```

POST /api/auth/registrar
```json
{
  "nome": "Joao Silva",
  "email": "joao@empresa.com",
  "senha": "senha123"
}
```

## Usuarios

POST /api/usuarios
```json
{
  "nome": "Ana Costa",
  "email": "ana@empresa.com",
  "senha": "senha123",
  "role": "operador",
  "ativo": true,
  "telefone": "11999998888",
  "cpf": "123.456.789-00"
}
```

PUT /api/usuarios/:id
```json
{
  "telefone": "11911112222",
  "ativo": false
}
```

## Motoristas

POST /api/motoristas
```json
{
  "nome": "Carlos Silva",
  "cpf": "123.456.789-00",
  "telefone": "11987654321",
  "email": "carlos@email.com",
  "cnh": "12345678900",
  "cnh_validade": "2027-08-15",
  "cnh_categoria": "E",
  "tipo": "proprio",
  "data_admissao": "2020-03-15",
  "tipo_pagamento": "pix",
  "chave_pix_tipo": "cpf",
  "chave_pix": "123.456.789-00"
}
```

PUT /api/motoristas/:id
```json
{
  "status": "ferias",
  "caminhao_atual": "ABC-1234"
}
```

## Frota

POST /api/frota
```json
{
  "placa": "ABC-1234",
  "modelo": "Volvo FH 540",
  "ano_fabricacao": 2020,
  "capacidade_toneladas": 40.0,
  "tipo_veiculo": "CARRETA",
  "status": "disponivel",
  "tipo_combustivel": "S10"
}
```

PUT /api/frota/:id
```json
{
  "status": "manutencao",
  "km_atual": 250000
}
```

## Fazendas

POST /api/fazendas
```json
{
  "fazenda": "Fazenda Santa Esperanca",
  "localizacao": "Marilia, SP",
  "proprietario": "Joao Silva",
  "mercadoria": "Amendoim",
  "safra": "2024/2025",
  "preco_por_tonelada": 600.0
}
```

PUT /api/fazendas/:id
```json
{
  "colheita_finalizada": true
}
```

## Fretes

POST /api/fretes
```json
{
  "origem": "Fazenda Santa Esperanca",
  "destino": "Secador Central - Filial 1",
  "motorista_id": "MOT-001",
  "motorista_nome": "Carlos Silva",
  "caminhao_id": "1",
  "caminhao_placa": "ABC-1234",
  "mercadoria": "Amendoim em Casca",
  "data_frete": "2026-01-20",
  "quantidade_sacas": 450,
  "toneladas": 11.25,
  "valor_por_tonelada": 600.0
}
```

PUT /api/fretes/:id
```json
{
  "custos": 1720.0,
  "resultado": 5030.0
}
```

## Custos

POST /api/custos
```json
{
  "frete_id": "FRETE-2026-001",
  "tipo": "combustivel",
  "descricao": "Abastecimento completo",
  "valor": 2500.0,
  "data": "2026-01-20",
  "comprovante": true,
  "motorista": "Carlos Silva",
  "caminhao": "ABC-1234",
  "rota": "Sao Paulo - Rio de Janeiro",
  "litros": 450.0,
  "tipo_combustivel": "diesel"
}
```

PUT /api/custos/:id
```json
{
  "descricao": "Abastecimento parcial",
  "valor": 1800.0
}
```

## Pagamentos

POST /api/pagamentos
```json
{
  "motorista_id": "MOT-001",
  "motorista_nome": "Carlos Silva",
  "periodo_fretes": "15-20/01/2026",
  "quantidade_fretes": 2,
  "fretes_incluidos": "FRETE-2026-001,FRETE-2026-002",
  "total_toneladas": 85.0,
  "valor_por_tonelada": 150.0,
  "valor_total": 12750.0,
  "data_pagamento": "2026-01-22",
  "status": "pago",
  "metodo_pagamento": "pix",
  "comprovante_nome": "comprovante_pix_001.pdf",
  "comprovante_url": "/uploads/comprovantes/comprovante_pix_001.pdf"
}
```

PUT /api/pagamentos/:id
```json
{
  "status": "processando"
}
```

## Notas fiscais

POST /api/notas-fiscais
```json
{
  "frete_id": "FRETE-2026-001",
  "motorista_id": "MOT-001",
  "numero_nf": 1001,
  "serie_nf": "1",
  "data_emissao": "2026-01-20",
  "mercadoria": "Amendoim em Casca",
  "quantidade_sacas": 450,
  "toneladas": 11.25,
  "origem": "Fazenda Santa Maria",
  "destino": "Secador Central - Filial 1",
  "valor_bruto": 7600.0
}
```

PUT /api/notas-fiscais/:id
```json
{
  "status": "cancelada",
  "observacoes": "Cancelada por erro de emissao"
}
```

## Locais de entrega

POST /api/locais-entrega
```json
{
  "nome": "Filial 1, Tupa",
  "cidade": "Tupa",
  "estado": "SP",
  "ativo": true
}
```

PUT /api/locais-entrega/:id
```json
{
  "ativo": false
}
```
