const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const text = parsedUrl.query.text;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.appendFile('file.txt', text, err => {
        if (err) {
            res.end('<h1>Error writing to file</h1>');
            return;
        }
        res.end('<h1>File written successfully</h1>');
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

server.on('error', (err) => {
    console.error('Server error:', err);
});