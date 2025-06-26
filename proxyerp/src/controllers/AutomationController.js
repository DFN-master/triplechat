
const logger = require('../utils/logger');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { downloadAndDecryptAsBase64 } = require('../services/DownloadAndDecryptServices/DownloadAudioAndDecrypt');
const { downloadImageAndDecryptBase64 } = require('../services/DownloadAndDecryptServices/DownloadImageAndDecrypt')


exports.DownloadBase64Audio = async (req, res) => {
    try {

        const requiredFields = ["url", "mediaKey", "fileEncSha256", "fileSha256", "mimetype"];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    status: "erro",
                    msg: `Falta o parâmetro obrigatório: ${field}`
                });
            }
        }

        const response = await downloadAndDecryptAsBase64(req.body);

        if (!response.success) {
            return res.status(500).json({
                status: "erro",
                msg: "Falha ao processar o áudio",
                erroInterno: response.error
            });
        }

        return res.status(200).json({
            status: "sucesso",
            base64: response.base64,
            mimetype: response.mimetype
        });

    } catch (err) {
        console.error("Erro inesperado:", err);
        return res.status(500).json({
            status: "erro",
            msg: "Erro inesperado ao processar requisição",
            erroInterno: err.message
        });
    }
};

exports.DownloadBase64Image = async (req, res) => {
    try {

        const requiredFields = ["url", "mediaKey", "fileEncSha256", "fileSha256", "mimetype"];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    status: "erro",
                    msg: `Falta o parâmetro obrigatório: ${field}`
                });
            }
        }

        const response = await downloadImageAndDecryptBase64(req.body);

        if (!response.success) {
            return res.status(500).json({
                status: "erro",
                msg: "Falha ao processar o Imagem",
                erroInterno: response.error
            });
        }

        return res.status(200).json({
            status: "sucesso",
            base64: response.base64,
            mimetype: response.mimetype
        });

    } catch (err) {
        console.error("Erro inesperado:", err);
        return res.status(500).json({
            status: "erro",
            msg: "Erro inesperado ao processar requisição",
            erroInterno: err.message
        });
    }
};

