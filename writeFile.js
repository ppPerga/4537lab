const http = require('http');
const url = require('url');
const fs = require('fs');
const { getString } = require('./modules/utils');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const text = parsedUrl.query.text;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    if (!text) {
        const instructions = getString('writeFileInstructions');
        res.end(`<h1>${instructions}</h1>`);
        return;
    }
    
    fs.appendFile('file.txt', text, err => {
        if (err) {
            const errorMessage = getString('errorWritingFile');
            res.end(`<h1>${errorMessage}</h1>`);
            return;
        }
        const successMessage = getString('fileWrittenSuccess');
        res.end(`<h1>${successMessage}</h1>`);
    });
});

server.listen(3002, () => {
    console.log('Write file server running on http://localhost:3002');
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});