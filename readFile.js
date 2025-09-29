const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    res.writeHead(200, { 'Content-Type': 'text/html' });

    fs.readFile('file.txt', 'utf8', (err, data) => {
        if (err) {
            res.end('<h1>Error reading file</h1>');
            return;
        }
        if(!data) {
            data = 'File is empty.';
        }
        res.end(`<h1>File Contents:</h1><pre>${data}</pre>`);
    });

});

server.listen(3001, () => {
});

server.on('error', (err) => {
    console.error('Server error:', err);
});