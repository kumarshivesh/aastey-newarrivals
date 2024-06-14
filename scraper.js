const puppeteer = require('puppeteer');

async function getProductData() {
  let browser;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 768 });
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto("https://aastey.com");
    await page.waitForSelector('a[href="/collections/newarrivals"]', { visible: true });
    await page.click('a[href="/collections/newarrivals"]');
    await page.waitForSelector('.new-grid.product-grid.collection-grid', { visible: true });

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
    console.log(JSON.stringify(productsData, null, 2));
  } catch (error) {
    console.log(error);
    await browser?.close();
  }
}

getProductData();
