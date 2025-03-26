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
const {DownloadPdf} = require('../services/PdfServices/DownloadPdf')

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

        const pdfUrl = extractPdfLink(mensagem);

        if (pdfUrl) {
            const pdfLocation = await DownloadPdf(pdfUrl);
            console.log(pdfLocation);
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

