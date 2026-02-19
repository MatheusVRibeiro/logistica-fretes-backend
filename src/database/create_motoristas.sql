-- =============================================================================
-- 3. TABELA: motoristas (Independente)
-- =============================================================================
CREATE TABLE IF NOT EXISTS motoristas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_motorista VARCHAR(20) UNIQUE NULL COMMENT 'ID de negócio (Ex: MOT-2026-001)',
  nome VARCHAR(200) NOT NULL COMMENT 'Nome completo do motorista - OBRIGATÓRIO',
  documento VARCHAR(20) UNIQUE COMMENT 'CPF ou CNPJ do motorista/empresa',
  telefone VARCHAR(20) NOT NULL COMMENT 'Telefone principal - OBRIGATÓRIO',
  email VARCHAR(255),
  endereco TEXT,
  status ENUM('ativo', 'inativo', 'ferias') NOT NULL DEFAULT 'ativo',
  tipo ENUM('proprio', 'terceirizado', 'agregado') NOT NULL,
  tipo_pagamento ENUM('pix', 'transferencia_bancaria') NOT NULL DEFAULT 'pix',
  banco VARCHAR(100) NULL,
  agencia VARCHAR(10) NULL,
  conta VARCHAR(20) NULL,
  tipo_conta ENUM('corrente', 'poupanca') DEFAULT 'corrente',
  chave_pix_tipo ENUM('cpf', 'email', 'telefone', 'aleatoria', 'cnpj'),
  chave_pix VARCHAR(255),
  receita_gerada DECIMAL(15,2) DEFAULT 0.00,
  viagens_realizadas INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_tipo (tipo),
  INDEX idx_documento (documento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
