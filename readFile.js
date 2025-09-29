const http = require('http');
const url = require('url');
const fs = require('fs');
const { getString } = require('./modules/utils');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    res.writeHead(200, { 'Content-Type': 'text/html' });

    fs.readFile('file.txt', 'utf8', (err, data) => {
        if (err) {
            const errorMessage = getString('errorReadingFile');
            res.end(`<h1>${errorMessage}</h1>`);
            return;
        }
        if(!data || data.trim() === '') {
            data = getString('fileEmpty');
        }
        const contentsLabel = getString('fileContents');
        res.end(`<h1>${contentsLabel}</h1><pre>${data}</pre>`);
    });

});

server.listen(3001, () => {
    console.log('Read file server running on http://localhost:3001');
});

server.on('error', (err) => {
    console.error('Server error:', err);
});