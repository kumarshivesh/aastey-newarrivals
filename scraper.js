const puppeteer = require('puppeteer');
const fs = require('fs');

async function getProductData() {
  let browser;

  try {
    // Launch browser and open new blank page
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1080, height: 768 });

    // Change navigation timeout from default 30 seconds to 2 minutes
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    // Navigate to URL
    await page.goto("https://aastey.com");

    // Wait for the link to be available and click on link to products page
    await page.waitForSelector('a[href="/collections/newarrivals"]', { visible: true });
    await page.click('a[href="/collections/newarrivals"]');

    // Wait for products page to load
    await page.waitForSelector('.new-grid.product-grid.collection-grid', { visible: true });

    // Get products data 
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
       
        products.push({
          title,
          color,
          salePrice,
          regularPrice,
          imageURL,
        });
      });

      return products;
    });

    // Log data
    console.log(productsData);

    // Save data to file
    fs.writeFileSync('products.json', JSON.stringify(productsData, null, 2));

    await browser.close();
  } catch (error) {
    console.log(error);
    await browser?.close();
  }
}

getProductData();
