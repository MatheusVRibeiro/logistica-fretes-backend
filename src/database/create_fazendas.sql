-- =============================================================================
-- 4. TABELA: fazendas (Independente)
-- =============================================================================
CREATE TABLE IF NOT EXISTS fazendas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_fazenda VARCHAR(20) UNIQUE NULL COMMENT 'ID de negócio (Ex: FAZ-2026-001)',
  fazenda VARCHAR(200) NOT NULL COMMENT 'Nome da fazenda',
  estado ENUM('SP', 'MS', 'MT') NOT NULL COMMENT 'Estado da operação',
  proprietario VARCHAR(200) NOT NULL,
  mercadoria VARCHAR(100) NOT NULL,
  variedade VARCHAR(100),
  safra VARCHAR(20) NOT NULL,
  preco_por_tonelada DECIMAL(10,2) NOT NULL,
  peso_medio_saca DECIMAL(10,2) DEFAULT 25.00,
  total_sacas_carregadas INT DEFAULT 0,
  total_toneladas DECIMAL(15,2) DEFAULT 0.00,
  faturamento_total DECIMAL(15,2) DEFAULT 0.00,
  ultimo_frete DATE,
  colheita_finalizada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_fazenda (fazenda),
  INDEX idx_safra (safra),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
