document.addEventListener('DOMContentLoaded', async () => {
  const spinner = document.getElementById('spinner');
  const loadingText = document.getElementById('loading-text');
  const tableBody = document.getElementById('products-table-body');

  try {
    // Show the spinner and loading text
    spinner.style.display = 'block';
    loadingText.style.display = 'block';
    tableBody.style.display = 'none';

    const response = await fetch('/scrape');
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // Hide the spinner and loading text, and show the table
    spinner.style.display = 'none';
    loadingText.style.display = 'none';
    tableBody.style.display = '';
  }
});

function renderProducts(products) {
  const tableBody = document.getElementById('products-table-body');
  tableBody.innerHTML = '';

  products.forEach(product => {
    const row = document.createElement('tr');

    const imgCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = product.imageURL;
    img.alt = product.title;
    img.width = 100;
    imgCell.appendChild(img);

    const titleCell = document.createElement('td');
    titleCell.textContent = product.title;

    const colorCell = document.createElement('td');
    colorCell.textContent = product.color;

    const regularPriceCell = document.createElement('td');
    regularPriceCell.textContent = product.regularPrice;

    const salePriceCell = document.createElement('td');
    salePriceCell.textContent = product.salePrice;

    row.appendChild(imgCell);
    row.appendChild(titleCell);
    row.appendChild(colorCell);
    row.appendChild(regularPriceCell);
    row.appendChild(salePriceCell);

    tableBody.appendChild(row);
  });
}
