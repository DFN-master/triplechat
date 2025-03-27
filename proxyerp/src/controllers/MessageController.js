
const logger = require('../utils/logger');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { DownloadPdf } = require('../services/PdfServices/DownloadPdf')
const { SendPdfFile } = require('../services/PdfServices/SendPdfFIle')


exports.SendMessage = async (req, res) => {
    try {

        const numero = req.query.numero
        const token = req.query.token

        // const numero = "5531994766933"
        // const token = "tokenFibraxxWpp001"

        const mensagem = req.query.mensagem
        const msgJson = JSON.parse(mensagem)
        const pdfUrl = msgJson.urlpdf


        const msgFormatadaSemPix = `*${msgJson.empresa} Informa:* \n\nOlá, ${msgJson.nomeCliente} 😊\n\nSua fatura no valor de R$${msgJson.valor} vence em ${msgJson.dataVencimento}. Para realizar o pagamento, utilize o código de barras abaixo:\n\n📌 Código de barras: \n\n${msgJson.linhaDigitalvel}\n\n📄 Você também pode acessar sua fatura em PDF aqui:\n🔗 ${msgJson.urlpdf}\n\n💬 Se precisar, estamos à disposição!`

        const msgFormatadaComPix = `*${msgJson.empresa} Informa:* \n\nOlá, ${msgJson.nomeCliente} 😊\n\nSua fatura no valor de R$${msgJson.valor} vence em ${msgJson.dataVencimento}. Para realizar o pagamento, utilize o código de barras abaixo:\n\n📌 Código de barras: \n\n${msgJson.linhaDigitalvel}\n\n📄 Você também pode acessar sua fatura em PDF aqui:\n🔗 ${msgJson.urlpdf}\n\n💵 Pagamento via PIX: \nCopie e cole o código abaixo no seu app bancário: \n\n💬 Se precisar, estamos à disposição!`


        const url = `${process.env.API_URL}/api/messages/send`

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }


        const dataPix = {
            number: numero,
            body: msgJson.chavepix,
            closeTicket: true
        };



        if (msgJson.chavepix) {
            const dataMsg = {
                number: numero,
                body: msgFormatadaComPix,
                closeTicket: true
            };

            await axios.post(url, dataMsg, { headers });
            await axios.post(url, dataPix, { headers });

            logger.info(`Boleto enviado com sucesso para ${numero}.`)

            if (pdfUrl) {
                const pdfLocation = await DownloadPdf(pdfUrl);
                await SendPdfFile(url, pdfLocation, token, numero)
                logger.info(`PDF enviado com sucesso para ${numero}.`)
            }

        } else {
            const dataMsg = {
                number: numero,
                body: msgFormatadaSemPix,
                closeTicket: true
            };

            await axios.post(url, dataMsg, { headers });
            logger.info(`Boleto enviado com sucesso para ${numero}.`)

            if (pdfUrl) {
                const pdfLocation = await DownloadPdf(pdfUrl);
                await SendPdfFile(url, pdfLocation, token, numero)
                logger.info(`PDF enviado com sucesso para ${numero}.`)
            }
        }

        return res
            .status(200)
            .send("Mensagem enviada com sucesso!");
    } catch (error) {
        logger.error("Erro ao Enviar Mensagem", error)
        return res
            .status(501)
            .send("Não foi possivel enviar a mensagem.");
    }
};

