const axios = require('axios');
const crypto = require('crypto');
const logger = require('../../utils/logger');


// const audioData = {
//   url: "https://mmg.whatsapp.net/v/t62.7117-24/12149005_1086529286732487_9086575618206673740_n.enc?ccb=11-4&oh=01_Q5Aa1wGl7JJUDTJZXi87YkbOUUlW8j51lIiHMTyORsYqziEH0w&oe=68840EE3&_nc_sid=5e03e0&mms3=true",
//   mimetype: "audio/ogg; codecs=opus",
//   mediaKey: "VqvEDbBDJCxro4jVHlPP3aFhCydtdnAYDbNph/AOxXw=",
//   fileEncSha256: "nLobqwutBvPmOoooXeqdbclQh2MGlVEFOJS0WMguzeo=",
//   fileSha256: "PKk9JFsSXhbID7WmXP2uAaoU0ucx9Nc66mL8M3AomxY=",
// };

function hkdf(mediaKey, type, length = 112) {
  const salt = Buffer.alloc(32); // 32 bytes de zero
  const info = Buffer.from(`WhatsApp ${type} Keys`, 'utf-8');
  return crypto.hkdfSync("sha256", mediaKey, salt, info, length);
}

exports.downloadAndDecryptAsBase64 = async (audioData) => {
  try {

    logger.info("▶️ Iniciando download de audio...")


    const response = await axios.get(audioData.url, {
      responseType: "arraybuffer"
    });

    const encFull = Buffer.from(response.data);
    logger.info(`✅ Download OK: ${encFull.length} bytes`);

    const hashEnc = crypto.createHash("sha256").update(encFull).digest("base64");
    if (hashEnc !== audioData.fileEncSha256) {
      throw new Error("Hash do arquivo criptografado não bate com o esperado");
    }

    const encData = encFull.slice(0, -10); // remove o HMAC (últimos 10 bytes)

    const mediaKey = Buffer.from(audioData.mediaKey, "base64");
    const expandedKey = hkdf(mediaKey, "Audio");

    const iv = expandedKey.slice(0, 16);
    const aesKey = expandedKey.slice(16, 48);

    const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
    const decrypted = Buffer.concat([
      decipher.update(encData),
      decipher.final()
    ]);

    const hashPlain = crypto.createHash("sha256").update(decrypted).digest("base64");
    if (hashPlain !== audioData.fileSha256) {
      throw new Error("Hash do conteúdo descriptografado não confere");
    }

    const base64Audio = decrypted.toString('base64');
    logger.info("✅ Base64 gerado com sucesso");

    return {
      success: true,
      base64: base64Audio,
      mimetype: audioData.mimetype,
    };

  } catch (err) {
    logger.error("❌ Erro:", err.message);
    return {
      success: false,
      error: err.message
    };
  }
}
