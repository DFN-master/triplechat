const app = require('./app');
const http = require('http');
const GracefulShutdown = require('http-graceful-shutdown');
const logger = require('./utils/logger'); 

require('./bootstrap')

// Criação do servidor HTTP para o app
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  logger.info(`Servidor Iniciado na porta: ${process.env.PORT}`);
});

// Adiciona o graceful shutdown
GracefulShutdown(server);