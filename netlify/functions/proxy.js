const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Daftar proxy/VPN endpoint Anda (SOCKS5/HTTP)
const PROXIES = [
  'socks5://user:pass@us.vpnproxy.com:1080',
  'socks5://user:pass@uk.vpnproxy.com:1080',
  'socks5://user:pass@de.vpnproxy.com:1080',
  'socks5://user:pass@fr.vpnproxy.com:1080',
  'socks5://user:pass@jp.vpnproxy.com:1080'
];

exports.handler = async (event, context) => {
  // Ambil indeks instance dari query string ?i=1..5
  const idx = Math.min(Math.max(parseInt(event.queryStringParameters?.i) || 1, 1), PROXIES.length) - 1;
  const proxyUrl = PROXIES[idx];

  // Launch headless Chrome
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=${proxyUrl}`
    ].concat(chromium.args),
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  // Emulasi device, misal Pixel 5
  await page.emulate(puppeteer.devices['Pixel 5']);
  await page.goto('https://www.youtube.com', { waitUntil: 'networkidle2' });

  const content = await page.content();
  await browser.close();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: content
  };
};
