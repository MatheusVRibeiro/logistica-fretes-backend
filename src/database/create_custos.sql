-- =============================================================================
-- 8. TABELA: custos (Depende de fretes)
-- =============================================================================
CREATE TABLE IF NOT EXISTS custos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_custo VARCHAR(20) UNIQUE NULL COMMENT 'ID de negócio (Ex: CST-2026-001)',
  frete_id INT NOT NULL,
  tipo ENUM('combustivel', 'manutencao', 'pedagio', 'outros') NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data DATE NOT NULL,
  comprovante BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  motorista VARCHAR(200),
  caminhao VARCHAR(10),
  rota VARCHAR(255),
  litros DECIMAL(10,2),
  tipo_combustivel ENUM('gasolina', 'diesel', 'etanol', 'gnv'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (frete_id) REFERENCES fretes(id) ON DELETE CASCADE,
  INDEX idx_frete_id (frete_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
