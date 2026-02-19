-- =============================================================================
-- 9. TABELA: anexos (Polimórfica)
-- =============================================================================
CREATE TABLE IF NOT EXISTS anexos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_anexo VARCHAR(20) UNIQUE NULL COMMENT 'ID de negócio (Ex: ANX-2026-001)',
  nome_original VARCHAR(500) NOT NULL,
  nome_arquivo VARCHAR(500) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  tipo_mime VARCHAR(100) NOT NULL,
  tamanho INT NOT NULL,
  entidade_tipo VARCHAR(50) NOT NULL COMMENT 'PAGAMENTO, FRETE, CUSTO, etc',
  entidade_id INT NOT NULL COMMENT 'ID numérico da entidade vinculada',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_entidade (entidade_tipo, entidade_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
