-- =============================================================================
-- 2. TABELA: usuarios (Independente)
-- =============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_usuario VARCHAR(20) UNIQUE NULL COMMENT 'ID de negócio (Ex: USR-2026-001)',
  nome VARCHAR(200) NOT NULL COMMENT 'Nome completo do usuário',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email para login (único)',
  senha_hash VARCHAR(255) NOT NULL COMMENT 'Hash da senha (bcrypt)',
  role ENUM('admin', 'contabilidade', 'operador') NOT NULL DEFAULT 'operador' COMMENT 'Nível de acesso',
  ativo BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Status do usuário',
  telefone VARCHAR(20),
  documento VARCHAR(20) UNIQUE,
  ultimo_acesso TIMESTAMP NULL,
  tentativas_login_falhas INT DEFAULT 0,
  bloqueado_ate TIMESTAMP NULL,
  token_recuperacao VARCHAR(255),
  token_expiracao TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
