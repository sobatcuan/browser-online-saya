// File: netlify/functions/proxy.js (VERSI PERBAIKAN)
const axios = require('axios');

exports.handler = async function (event, context) {
  const targetUrl = event.queryStringParameters.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: 'URL parameter is required',
    };
  }

  try {
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer', // Ambil sebagai data mentah
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    // Ambil content-type dari respons asli
    const contentType = response.headers['content-type'];

    // Kirim kembali data mentah dalam format Base64
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType
      },
      body: Buffer.from(response.data, 'binary').toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: `Proxy error: ${error.message}`,
    };
  }
};
