const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const logger = require('../../utils/logger');

exports.SendPdfFile = async (url, filePath, token, number) => {
    try {
        const formData = new FormData();
        formData.append('number', number);
        formData.append('medias', fs.createReadStream(filePath)); // Lendo o arquivo para envio

        await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(), // Inclui automaticamente Content-Type correto
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        logger.error('Erro ao enviar PDF', error.response?.data || error.message);
    }
};
