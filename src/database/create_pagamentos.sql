-- =============================================================================
-- 6. TABELA: pagamentos (Depende de motoristas)
-- =============================================================================
CREATE TABLE IF NOT EXISTS pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_pagamento VARCHAR(20) UNIQUE NULL COMMENT 'ID de negócio (Ex: PAG-2026-001)',
  motorista_id INT NOT NULL,
  motorista_nome VARCHAR(200) NOT NULL,
  periodo_fretes VARCHAR(50) NOT NULL,
  quantidade_fretes INT NOT NULL DEFAULT 1,
  fretes_incluidos TEXT,
  total_toneladas DECIMAL(10,2) NOT NULL,
  valor_por_tonelada DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  data_pagamento DATE NOT NULL,
  status ENUM('pendente', 'processando', 'pago', 'cancelado') DEFAULT 'pendente',
  metodo_pagamento ENUM('pix', 'transferencia_bancaria') NOT NULL,
  comprovante_nome VARCHAR(255),
  comprovante_url TEXT,
  comprovante_data_upload TIMESTAMP NULL,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id) ON DELETE RESTRICT,
  INDEX idx_motorista (motorista_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
