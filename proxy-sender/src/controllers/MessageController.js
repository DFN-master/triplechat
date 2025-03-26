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
const { DownloadPdf } = require('../services/PdfServices/DownloadPdf')
const { SendPdfFile } = require('../services/PdfServices/SendPdfFIle')

const secret = '1234';

exports.SendMessage = async (req, res) => {
    try {

        // const numero = req.query.numero 
        // const numero = req.query.token



        const mensagem = req.query.mensagem
        const msgJson = JSON.parse(mensagem)
        const numero = "5531994766933"
        const token = "tokenFibraxxWpp001"
        const pdfUrl = msgJson.urlpdf


        const msgFormatadaSemPix = `*${msgJson.empresa} Informa:* \n\nOlá, ${msgJson.nomeCliente} 😊\n\nSua fatura no valor de R$${msgJson.valor} vence em ${msgJson.dataVencimento}. Para realizar o pagamento, utilize o código de barras abaixo:\n\n📌 Código de barras: \n\n${msgJson.linhaDigitalvel}\n\n📄 Você também pode acessar sua fatura em PDF aqui:\n🔗 ${msgJson.urlpdf}\n\n💬 Se precisar, estamos à disposição!`

        const msgFormatadaComPix = `*${msgJson.empresa} Informa:* \n\nOlá, ${msgJson.nomeCliente} 😊\n\nSua fatura no valor de R$${msgJson.valor} vence em ${msgJson.dataVencimento}. Para realizar o pagamento, utilize o código de barras abaixo:\n\n📌 Código de barras: \n\n${msgJson.linhaDigitalvel}\n\n📄 Você também pode acessar sua fatura em PDF aqui:\n🔗 ${msgJson.urlpdf}\n\n💵 Pagamento via PIX: \nCopie e cole o código abaixo no seu app bancário: \n\n💬 Se precisar, estamos à disposição!`


        const url = "https://api.triplechat.tripleplay.network/api/messages/send"
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }


        const dataPix = {
            number: numero,
            body: msgJson.chavepix
        };



        if (msgJson.chavepix) {
            const dataMsg = {
                number: numero,
                body: msgFormatadaComPix
            };

            await axios.post(url, dataMsg, { headers });
            await axios.post(url, dataPix, { headers });
            if (pdfUrl) {
                const pdfLocation = await DownloadPdf(pdfUrl);
                await SendPdfFile(url, pdfLocation, token, numero)
            }

        } else {
            const dataMsg = {
                number: numero,
                body: msgFormatadaSemPix
            };

            await axios.post(url, dataMsg, { headers });

            if (pdfUrl) {
                const pdfLocation = await DownloadPdf(pdfUrl);
                await SendPdfFile(url, pdfLocation, token, numero)
            }
        }

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

