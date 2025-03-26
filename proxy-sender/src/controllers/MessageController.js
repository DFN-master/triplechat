/**
 * Arquivo: MessageController.js
 * Descrição: Arquivo responsável por controlar as ações das rotas
 * e executar os processos de usuários.
 */
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const secret = '1234';

exports.SendMessage = async (req, res) => {
    try {

        // const numero = req.query.numero 
        // const numero = req.query.token



        const mensagem = req.query.mensagem
        const numero = "5531994766933"
        const token = "tokenFibraxxWpp001"



        const url = "https://api.triplechat.tripleplay.network/api/messages/send"
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }

        const data = {
            number: numero,
            body: mensagem
        };



        const extractPdfLink = (text) => {
            const regex = /(https?:\/\/[^\s]+)/g;
            const match = text.match(regex);
            return match ? match[0] : null;
        };

        const getFileNameFromHeaders = (headers) => {
            const contentDisposition = headers['content-disposition'];
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+?)"/);
                if (match) return match[1];
            }
            return `arquivo_${Date.now()}.pdf`; // Nome genérico se não houver header
        };


        const downloadPdf = async (url) => {
            try {
                const response = await axios({
                    url,
                    method: 'GET',
                    responseType: 'stream',
                });

                const fileName = getFileNameFromHeaders(response.headers);
                const outputPath = path.join(__dirname, `../archives/${fileName}`);

                const writer = fs.createWriteStream(outputPath);
                response.data.pipe(writer);

                return new Promise((resolve, reject) => {
                    writer.on('finish', () => {
                        console.log('Download concluído:', outputPath);
                        resolve();
                    });
                    writer.on('error', reject);
                });
            } catch (error) {
                console.error('Erro ao baixar o PDF:', error.message);
            }
        };

        const pdfUrl = extractPdfLink(mensagem);
        if (pdfUrl) {
            downloadPdf(pdfUrl);
        } else {
            console.log('Nenhum link de PDF encontrado.');
        }

        const response = await axios.post(url, data, { headers });

        console.log(response.data)
        return res
            .status(200)
            .send("Mensagem enviada com sucesso!");
    } catch (error) {
        console.log(error);
        return res
            .status(501)
            .send("Não foi possivel enviar a mensagem.");
    }
};

