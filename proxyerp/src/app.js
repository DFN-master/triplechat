/**
 * Arquivo: app.js
 * Descrição: Arquivo responsável por toda a configuração e execução da aplicação.
 */

const express = require('express');
const cors = require('cors');
const ApplicationRoutes = require('./routes/ApplicationRoutes');
const AutomationRoutes = require('./routes/AutomationRoutes')

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', ApplicationRoutes);
app.use('/automacao',AutomationRoutes)

module.exports = app;