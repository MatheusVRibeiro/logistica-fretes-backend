-- ===== AUTENTICAÇÃO E USUÁRIOS =====
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operador', 'motorista') NOT NULL DEFAULT 'operador',
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ===== GESTÃO DE RECURSOS =====
CREATE TABLE IF NOT EXISTS caminhoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  placa VARCHAR(10) NOT NULL UNIQUE,
  modelo VARCHAR(255) NOT NULL,
  ano INT NOT NULL,
  capacidade_sacas INT NOT NULL,
  capacidade_toneladas DECIMAL(10, 2) NOT NULL,
  status ENUM('ativo', 'manutencao', 'inativo') DEFAULT 'ativo',
  ultimo_motorista_id INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ultimo_motorista_id) REFERENCES motoristas(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_placa (placa)
);

CREATE TABLE IF NOT EXISTS motoristas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL UNIQUE,
  cnh VARCHAR(20) NOT NULL UNIQUE,
  cnh_validade DATE NOT NULL,
  crlv VARCHAR(20),
  telefone VARCHAR(20),
  cidade_origem VARCHAR(255),
  data_nascimento DATE,
  status ENUM('ativo', 'inativo', 'afastado') DEFAULT 'ativo',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_cnh (cnh),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS mercadorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  tipo ENUM('amendoim', 'soja', 'milho', 'outro') NOT NULL,
  densidade DECIMAL(8, 4),
  preco_medio DECIMAL(12, 2),
  unidade ENUM('saca', 'tonelada', 'kg') DEFAULT 'saca',
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tipo (tipo)
);

-- ===== FRETES E ROTAS =====
CREATE TABLE IF NOT EXISTS fretes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_frete VARCHAR(50) NOT NULL UNIQUE,
  motorista_id INT NOT NULL,
  caminhao_id INT NOT NULL,
  mercadoria_id INT NOT NULL,
  quantidade_sacas INT NOT NULL,
  peso_total_toneladas DECIMAL(10, 2) NOT NULL,
  origem VARCHAR(255) NOT NULL,
  destino VARCHAR(255) NOT NULL,
  data_saida DATETIME NOT NULL,
  data_chegada_prevista DATETIME,
  data_chegada_real DATETIME,
  status ENUM('pendente', 'em_transito', 'concluido', 'cancelado') DEFAULT 'pendente',
  valor_frete DECIMAL(12, 2) NOT NULL,
  combustivel_gasto DECIMAL(10, 2),
  pedagio DECIMAL(10, 2),
  notas TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id) ON DELETE RESTRICT,
  FOREIGN KEY (caminhao_id) REFERENCES caminhoes(id) ON DELETE RESTRICT,
  FOREIGN KEY (mercadoria_id) REFERENCES mercadorias(id) ON DELETE RESTRICT,
  INDEX idx_status (status),
  INDEX idx_motorista (motorista_id),
  INDEX idx_caminhao (caminhao_id),
  INDEX idx_data_saida (data_saida),
  INDEX idx_numero_frete (numero_frete)
);

CREATE TABLE IF NOT EXISTS rastreamento_frete (
  id INT PRIMARY KEY AUTO_INCREMENT,
  frete_id INT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  localizacao VARCHAR(255),
  status ENUM('saido', 'em_rota', 'parado', 'chegou') NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (frete_id) REFERENCES fretes(id) ON DELETE CASCADE,
  INDEX idx_frete (frete_id),
  INDEX idx_timestamp (timestamp)
);

-- ===== CUSTOS E DESPESAS =====
CREATE TABLE IF NOT EXISTS custos_frete (
  id INT PRIMARY KEY AUTO_INCREMENT,
  frete_id INT NOT NULL,
  tipo ENUM('combustivel', 'pedagio', 'manutencao', 'alimentacao', 'outro') NOT NULL,
  descricao VARCHAR(255),
  valor DECIMAL(12, 2) NOT NULL,
  data_custo DATE NOT NULL,
  comprovante_url VARCHAR(500),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (frete_id) REFERENCES fretes(id) ON DELETE CASCADE,
  INDEX idx_frete (frete_id),
  INDEX idx_tipo (tipo),
  INDEX idx_data_custo (data_custo)
);

CREATE TABLE IF NOT EXISTS manutencao_caminhao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  caminhao_id INT NOT NULL,
  tipo ENUM('preventiva', 'corretiva', 'revisao') DEFAULT 'preventiva',
  descricao VARCHAR(500) NOT NULL,
  valor DECIMAL(12, 2) NOT NULL,
  data_manutencao DATE NOT NULL,
  proxima_manutencao DATE,
  quilometragem INT,
  notas TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (caminhao_id) REFERENCES caminhoes(id) ON DELETE CASCADE,
  INDEX idx_caminhao (caminhao_id),
  INDEX idx_data_manutencao (data_manutencao)
);

-- ===== INDICADORES E RELATÓRIOS =====
CREATE TABLE IF NOT EXISTS kpi_mensal (
  id INT PRIMARY KEY AUTO_INCREMENT,
  mes INT NOT NULL,
  ano INT NOT NULL,
  sacas_transportadas INT DEFAULT 0,
  toneladas_transportadas DECIMAL(12, 2) DEFAULT 0,
  fretes_realizados INT DEFAULT 0,
  receita_total DECIMAL(15, 2) DEFAULT 0,
  custo_total DECIMAL(15, 2) DEFAULT 0,
  lucro_liquido DECIMAL(15, 2) DEFAULT 0,
  taxa_ocupacao_media DECIMAL(5, 2) DEFAULT 0,
  custo_por_saca DECIMAL(10, 2) DEFAULT 0,
  caminhoes_em_uso INT DEFAULT 0,
  caminhoes_disponiveis INT DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_mes_ano (mes, ano),
  INDEX idx_ano (ano)
);

CREATE TABLE IF NOT EXISTS alertas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo ENUM('safra', 'eficiencia', 'custos', 'manutencao', 'performance') NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  severidade ENUM('info', 'warning', 'critical') DEFAULT 'info',
  lido BOOLEAN DEFAULT FALSE,
  frete_id INT,
  caminhao_id INT,
  motorista_id INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (frete_id) REFERENCES fretes(id) ON DELETE SET NULL,
  FOREIGN KEY (caminhao_id) REFERENCES caminhoes(id) ON DELETE SET NULL,
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id) ON DELETE SET NULL,
  INDEX idx_tipo (tipo),
  INDEX idx_lido (lido),
  INDEX idx_criado_em (criado_em)
);

-- ===== DOCUMENTAÇÃO =====
CREATE TABLE IF NOT EXISTS documentos_veiculo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  caminhao_id INT NOT NULL,
  tipo ENUM('crlv', 'seguro', 'inspecao', 'outro') NOT NULL,
  numero_documento VARCHAR(100),
  data_emissao DATE,
  data_vencimento DATE,
  arquivo_url VARCHAR(500),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (caminhao_id) REFERENCES caminhoes(id) ON DELETE CASCADE,
  INDEX idx_caminhao (caminhao_id),
  INDEX idx_tipo (tipo),
  INDEX idx_data_vencimento (data_vencimento)
);

CREATE TABLE IF NOT EXISTS documentos_motorista (
  id INT PRIMARY KEY AUTO_INCREMENT,
  motorista_id INT NOT NULL,
  tipo ENUM('cnh', 'mopp', 'outro') NOT NULL,
  numero_documento VARCHAR(100),
  data_emissao DATE,
  data_vencimento DATE,
  arquivo_url VARCHAR(500),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id) ON DELETE CASCADE,
  INDEX idx_motorista (motorista_id),
  INDEX idx_tipo (tipo),
  INDEX idx_data_vencimento (data_vencimento)
);

-- ===== AUDITORIA =====
CREATE TABLE IF NOT EXISTS auditoria (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  tabela VARCHAR(100) NOT NULL,
  operacao ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  registro_id INT NOT NULL,
  dados_anteriores JSON,
  dados_novos JSON,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_usuario (usuario_id),
  INDEX idx_tabela (tabela),
  INDEX idx_timestamp (timestamp)
);

