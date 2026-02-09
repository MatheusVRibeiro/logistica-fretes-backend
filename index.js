require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Configuração CORS para permitir requisições de múltiplas origens
const corsOptions = {
  origin: [
    'http://localhost:3000',        // Painel Web
    'http://localhost:8081',        // Expo Web (React Native)
    'http://192.168.0.174:8081',    // Expo Web na rede local
    'http://192.168.0.174:19006',   // Expo Dev Server alternativo
    'exp://192.168.0.174:8081',     // Expo Go
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Dev-User'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rotas do projeto TypeScript (após build)
const authRoutes = require('./dist/routes/authRoutes');
const dashboardRoutes = require('./dist/routes/dashboardRoutes');
const freteRoutes = require('./dist/routes/freteRoutes');
const usuarioRoutes = require('./dist/routes/usuarioRoutes');
const motoristaRoutes = require('./dist/routes/motoristaRoutes');
const frotaRoutes = require('./dist/routes/frotaRoutes');
const fazendaRoutes = require('./dist/routes/fazendaRoutes');
const custoRoutes = require('./dist/routes/custoRoutes');
const pagamentoRoutes = require('./dist/routes/pagamentoRoutes');

// Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend está funcionando',
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (request, response) => {
  response.send("Hello World");
});

// Rotas da API
app.use('/auth', authRoutes.default || authRoutes);
app.use('/dashboard', dashboardRoutes.default || dashboardRoutes);
app.use('/fretes', freteRoutes.default || freteRoutes);
app.use('/usuarios', usuarioRoutes.default || usuarioRoutes);
app.use('/motoristas', motoristaRoutes.default || motoristaRoutes);
app.use('/frota', frotaRoutes.default || frotaRoutes);
app.use('/fazendas', fazendaRoutes.default || fazendaRoutes);
app.use('/custos', custoRoutes.default || custoRoutes);
app.use('/pagamentos', pagamentoRoutes.default || pagamentoRoutes);

// Handler de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Inicia servidor
const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor iniciado em http://localhost:${porta}`);
});
