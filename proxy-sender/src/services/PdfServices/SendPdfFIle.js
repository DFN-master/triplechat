const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

exports.SendPdfFile = async (url, filePath, token, number) => {
    try {
        const formData = new FormData();
        formData.append('number', number);
        formData.append('medias', fs.createReadStream(filePath)); // Lendo o arquivo para envio

        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(), // Inclui automaticamente Content-Type correto
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('PDF enviado com sucesso:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    }
};
