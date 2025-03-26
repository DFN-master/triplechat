const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

exports.DownloadPdf = async (url) => {
    try {
        const getFileNameFromHeaders = (headers) => {
            const contentDisposition = headers['content-disposition'];
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+?)"/);
                if (match) return match[1];
            }
            return `arquivo_${Date.now()}.pdf`; // Nome genérico se não houver header
        };

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        const fileName = getFileNameFromHeaders(response.headers);
        const outputPath = path.join(__dirname, `../../archives/${fileName}`);

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                logger.info(`PDF salvo em: ${outputPath}`)
                resolve(outputPath); // Retorna corretamente o caminho do arquivo
            });
            writer.on('error', reject);
        });

    } catch (error) {
        logger.error("Erro ao baixar o PDF:", error.message);
    }
};
