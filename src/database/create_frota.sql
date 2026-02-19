-- =============================================================================
-- 5. TABELA: frota (Depende de motoristas)
-- =============================================================================
CREATE TABLE IF NOT EXISTS frota (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_veiculo VARCHAR(20) UNIQUE NULL COMMENT 'ID de negócio (Ex: VEI-2026-001)',
  placa VARCHAR(10) NOT NULL UNIQUE COMMENT 'Placa do caminhão trator - OBRIGATÓRIO',
  modelo VARCHAR(100) NOT NULL COMMENT 'Modelo completo do veículo - OBRIGATÓRIO',
  tipo_veiculo ENUM('TRUCADO', 'TOCO', 'CARRETA', 'BITREM', 'RODOTREM') NOT NULL,
  status ENUM('disponivel', 'em_viagem', 'manutencao') NOT NULL DEFAULT 'disponivel',
  placa_carreta VARCHAR(10) UNIQUE COMMENT 'Placa do reboque/carreta',
  motorista_fixo_id INT COMMENT 'Vínculo numérico com motorista',
  ano_fabricacao INT,
  capacidade_toneladas DECIMAL(10,2),
  km_atual INT DEFAULT 0,
  tipo_combustivel ENUM('DIESEL', 'S10', 'ARLA', 'OUTRO') DEFAULT 'S10',
  renavam VARCHAR(20) UNIQUE,
  renavam_carreta VARCHAR(20) UNIQUE,
  chassi VARCHAR(30) UNIQUE,
  registro_antt VARCHAR(20),
  validade_seguro DATE,
  validade_licenciamento DATE,
  proprietario_tipo ENUM('PROPRIO', 'TERCEIRO', 'AGREGADO') DEFAULT 'PROPRIO',
  ultima_manutencao_data DATE,
  proxima_manutencao_km INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (motorista_fixo_id) REFERENCES motoristas(id) ON DELETE SET NULL,
  INDEX idx_placa (placa),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
