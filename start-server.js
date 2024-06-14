const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Endpoint to trigger the scraper
app.get('/scrape', (req, res) => {
    exec('node scraper.js', (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return res.status(500).send('Error running scraper');
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        const products = JSON.parse(stdout);
        res.json(products);
    });
});

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
