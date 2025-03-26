const axios = require('axios');
const fs = require('fs');
const path = require('path');


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
                resolve();
                return outputPath
            });
            writer.on('error', reject);
        });


    } catch (error) {

    }

}