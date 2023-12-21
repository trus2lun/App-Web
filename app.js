const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: '26.226.216.226',
  database: 'postgres',
  password: '1808',
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    // Fetch data from the PostgreSQL database
    const result = await pool.query('SELECT * FROM finaltest ORDER BY f_id asc');
    const rows = result.rows;

    // Render HTML page with data
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
        </style>
      </head>
      <body>
        <h1>Book Database</h1>
        <input type="text" id="searchInput" placeholder="Search...">
        <table id="bookTable">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Episode</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Shelf</th>
          </tr>
          ${rows.map(row => `
            <tr>
              <td>${row.f_id}</td>
              <td>${row.f_title}</td>
              <td>${row.f_author}</td>
              <td>${row.f_genre}</td>
              <td>${row.f_episode}</td>
              <td>${row.f_quantity}</td>
              <td>${row.f_price}</td>
              <td>${row.f_shelf}</td>
            </tr>`).join('')}
        </table>
        <script>
          const searchInput = document.getElementById('searchInput');
          const bookTable = document.getElementById('bookTable');

          searchInput.addEventListener('input', () => {
            const filter = searchInput.value.toUpperCase();
            const rows = bookTable.getElementsByTagName('tr');

            for (let i = 1; i < rows.length; i++) {
              const cells = rows[i].getElementsByTagName('td');
              let shouldHide = true;

              for (let j = 0; j < cells.length; j++) {
                const cellText = cells[j].innerText.toUpperCase();
                if (cellText.includes(filter)) {
                  shouldHide = false;
                  break;
                }
              }

              rows[i].style.display = shouldHide ? 'none' : '';
            }
          });
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
