/**
 * Arquivo: ApplicationRouesjs
 * Descrição: Arquivo responsável pela rotas da aplicação.
 */

const express = require('express');

const router = express.Router();
// const auth = require('../middlewares/auth');
const AutomationController = require('../controllers/AutomationController');


router.post('/download/audio', AutomationController.DownloadBase64Audio)

module.exports = router;