const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));
  page.on('requestfailed', req => console.error('FAILED REQUEST:', req.url(), req.failure().errorText));

  console.log('Navigating...');
  await page.goto('https://thumbnail-application.vercel.app/', { waitUntil: 'networkidle0' });
  
  console.log('Done!');
  await browser.close();
})();
