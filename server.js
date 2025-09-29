const http = require('http');
const url = require('url');
const { getDate, getString } = require('./modules/utils');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const name = parsedUrl.query.name;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    const currentTime = getDate();
    
    if (name) {
        const greeting = getString('greeting', name);
        const timeMessage = getString('serverTime');
        res.end(`<h1>${greeting}</h1><p>${timeMessage} ${currentTime}</p>`);
    } else {
        const noNameMessage = getString('noName');
        const timeLabel = getString('currentTime');
        res.end(`<h1>${noNameMessage}</h1><p>${timeLabel} ${currentTime}</p>`);
    }
});

server.listen(3002, () => {
});

server.on('error', (err) => {
    console.error('Server error:', err);
});