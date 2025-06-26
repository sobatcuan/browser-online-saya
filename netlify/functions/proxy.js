const axios = require('axios');

exports.handler = async function (event) {
  const targetUrl = event.queryStringParameters.url;
  if (!targetUrl) {
    return { statusCode: 400, body: 'Parameter "url" dibutuhkan.' };
  }

  try {
    const response = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' },
      validateStatus: () => true,
      responseType: 'arraybuffer'
    });

    const originalHeaders = response.headers;
    delete originalHeaders['content-security-policy'];
    delete originalHeaders['x-frame-options'];
    delete originalHeaders['content-disposition'];

    originalHeaders['Access-Control-Allow-Origin'] = '*';
    
    return {
      statusCode: response.status,
      headers: originalHeaders,
      body: Buffer.from(response.data, 'binary').toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return { statusCode: 500, body: `Gagal mengambil konten: ${error.message}` };
  }
};
