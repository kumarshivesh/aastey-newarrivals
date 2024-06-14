const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to trigger the scraper
app.get('/scrape', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://aastey.com/collections/newarrivals', { waitUntil: 'networkidle2' });

    const productsData = await page.evaluate(() => {
      const products = [];
      const productElements = document.querySelectorAll('.grid-item__link');

      productElements.forEach(el => {
        const title = el.querySelector('.h2-bottom')?.innerText.trim() || '';
        const color = el.querySelector('.h2-bottom + .h2-bottom')?.innerText.trim() || '';
        const priceElement = el.querySelector('.h2-bottom + .h2-bottom + .h2-bottom');
        const salePrice = priceElement ? priceElement.childNodes[0].nodeValue.trim() : '';
        const regularPrice = priceElement ? priceElement.querySelector('strike')?.innerText.trim() : '';
        const imageURL = el.querySelector('img').src || '';

        if (title && color && salePrice && regularPrice && imageURL) {
          products.push({
            title,
            color,
            salePrice,
            regularPrice,
            imageURL,
          });
        }
      });

      return products;
    });

    await browser.close();
    res.json(productsData);
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).send('Error scraping data');
  }
});

// Fallback for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});