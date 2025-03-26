/**
 * Arquivo: ApplicationRouesjs
 * Descrição: Arquivo responsável pela rotas da aplicação.
 */

const express = require('express');

const router = express.Router();
// const auth = require('../middlewares/auth');
const MessageController = require('../controllers/MessageController');

router.get('/status', (req, res)=>{
    res.send("OK")
})
router.post('/newuser',  MessageController.NewUser);
router.post('/changeuserstatus',  MessageController.ChangeUser);

// Rotas de gestão do equipamento
// router.post('/newdevice', auth, DeviceApplicationController.NewDevice);
// router.post('/changedevice', auth, DeviceApplicationController.ChangeDevice);
// router.get('/listdevices', auth, DeviceApplicationController.ListDevices);



module.exports = router;