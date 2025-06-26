const axios = require('axios');
const crypto = require('crypto');
const logger = require('../../utils/logger');


// const imageData = {
//   url: "https://mmg.whatsapp.net/v/t62.7118-24/11909077_705887428912688_3146508497323318346_n.enc?ccb=11-4&oh=01_Q5Aa1wHYhVCgZFeA8goOhrOZrHVjL73so1THfOFCTfTMvi0VmA&oe=68841DB4&_nc_sid=5e03e0&mms3=true",
//   mimetype: "image/jpeg",
//   mediaKey: "o7KXVMwGonGgwjLN/KU3CtVe4WSC2xsX55dwcr5Wrao=",
//   fileEncSha256: "SBpT58zvep3LFTAjtLXRJUrmvPdAfbwAdeRH2/V+vGA=",
//   fileSha256: "Dd+v2hZBRgrAi38zI6ve3eZbbtGUi/FdIuJVTGeEV2M=",
//   fileLength: "820317"
// };


function hkdf(mediaKey, type, length = 112) {
  const salt = Buffer.alloc(32); // 32 bytes de zero
  const info = Buffer.from(`WhatsApp ${type} Keys`, 'utf-8');
  return crypto.hkdfSync("sha256", mediaKey, salt, info, length);
}

exports.downloadImageAndDecryptBase64 = async (imageData) => {
  try {

    logger.info("▶️ Iniciando download de audio...")


    const response = await axios.get(imageData.url, {
      responseType: "arraybuffer"
    });

    const encFull = Buffer.from(response.data);
    logger.info(`✅ Download OK: ${encFull.length} bytes`);

    const hashEnc = crypto.createHash("sha256").update(encFull).digest("base64");
    if (hashEnc !== imageData.fileEncSha256) {
      throw new Error("Hash do arquivo criptografado não bate com o esperado");
    }

    const encData = encFull.slice(0, -10); // remove o HMAC (últimos 10 bytes)

    const mediaKey = Buffer.from(imageData.mediaKey, "base64");
    const expandedKey = hkdf(mediaKey, "Image");

    const iv = expandedKey.slice(0, 16);
    const aesKey = expandedKey.slice(16, 48);

    const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
    const decrypted = Buffer.concat([
      decipher.update(encData),
      decipher.final()
    ]);

    const hashPlain = crypto.createHash("sha256").update(decrypted).digest("base64");
    if (hashPlain !== imageData.fileSha256) {
      throw new Error("Hash do conteúdo descriptografado não confere");
    }

    const base64Audio = decrypted.toString('base64');
    logger.info("✅ Base64 gerado com sucesso");

    return {
      success: true,
      base64: base64Audio,
      mimetype: imageData.mimetype,
    };

  } catch (err) {
    logger.error("❌ Erro:", err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

