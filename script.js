document.addEventListener("DOMContentLoaded", function() {
  fetch('products.json')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.querySelector('#productTable tbody');
          // Filter out products with empty fields
          const filteredData = data.filter(product => {
              return product.title && product.color && product.salePrice && product.regularPrice && product.imageURL;
          });

          filteredData.forEach(product => {
              const row = document.createElement('tr');

              const imageCell = document.createElement('td');
              const image = document.createElement('img');
              image.src = product.imageURL;
              image.alt = product.title;
              image.style.maxWidth = '100px';
              imageCell.appendChild(image);
              row.appendChild(imageCell);

              const titleCell = document.createElement('td');
              titleCell.textContent = product.title;
              row.appendChild(titleCell);

              const colorCell = document.createElement('td');
              colorCell.textContent = product.color;
              row.appendChild(colorCell);

              const regularPriceCell = document.createElement('td');
              regularPriceCell.textContent = product.regularPrice;
              row.appendChild(regularPriceCell);

              const salePriceCell = document.createElement('td');
              salePriceCell.textContent = product.salePrice;
              row.appendChild(salePriceCell);

              tableBody.appendChild(row);
          });
      })
      .catch(error => console.error('Error fetching products:', error));
});
