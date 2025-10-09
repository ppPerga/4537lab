const http = require('http');
const url = require('url');

// In-memory dictionary storage with some initial data
const dictionary = {
    'hello': 'a greeting or expression of goodwill',
    'world': 'the earth and all the people and things on it',
    'javascript': 'a programming language used for web development',
    'api': 'Application Programming Interface - a set of protocols for building software',
    'rest': 'Representational State Transfer - an architectural style for web services'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;
    
    // Set CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS requests
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    res.setHeader('Content-Type', 'application/json');
    
    // Handle API endpoint: /api/definitions
    if (pathname === '/api/definitions') {
        if (method === 'GET') {
            handleGetRequest(parsedUrl.query, res);
        } else if (method === 'POST') {
            handlePostRequest(req, res);
        } else {
            res.writeHead(405);
            res.end(JSON.stringify({ 
                error: 'Method not allowed',
                message: 'Only GET and POST methods are supported'
            }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ 
            error: 'Endpoint not found',
            message: 'Use /api/definitions endpoint'
        }));
    }
});

// Handle GET requests - milescoda.xyz/api/definitions?word=example
function handleGetRequest(query, res) {
    const word = query.word;
    
    if (word) {
        // Get specific word definition
        const definition = dictionary[word.toLowerCase()];
        if (definition) {
            res.writeHead(200);
            res.end(JSON.stringify({ 
                word: word.toLowerCase(), 
                definition: definition,
                success: true 
            }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ 
                error: 'Word not found',
                word: word.toLowerCase(),
                success: false 
            }));
        }
    } else {
        // Get all definitions
        res.writeHead(200);
        res.end(JSON.stringify({ 
            definitions: dictionary,
            count: Object.keys(dictionary).length,
            success: true 
        }));
    }
}

// Handle POST requests - body contains { word: "example", definition: "..." }
function handlePostRequest(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const { word, definition } = JSON.parse(body);
            
            if (word && definition) {
                dictionary[word.toLowerCase()] = definition;
                res.writeHead(201);
                res.end(JSON.stringify({ 
                    message: 'Definition added successfully',
                    word: word.toLowerCase(),
                    definition: definition,
                    success: true 
                }));
            } else {
                res.writeHead(400);
                res.end(JSON.stringify({ 
                    error: 'Bad request',
                    message: 'Both word and definition are required in request body',
                    success: false 
                }));
            }
        } catch (error) {
            res.writeHead(400);
            res.end(JSON.stringify({ 
                error: 'Invalid JSON',
                message: 'Request body must be valid JSON',
                success: false 
            }));
        }
    });
}

// Start the server
const PORT = 4000;

server.listen(PORT, () => {
    console.log(`Dictionary API server running on port ${PORT}`);
    console.log(`Available at: milescoda.xyz/api/definitions`);
    console.log('');
    console.log('Endpoints:');
    console.log('  GET  /api/definitions        - Get all definitions');
    console.log('  GET  /api/definitions?word=X - Get specific definition');
    console.log('  POST /api/definitions        - Add definition (JSON body)');
    console.log('');
    console.log('Example usage:');
    console.log('  GET  milescoda.xyz/api/definitions?word=hello');
    console.log('  POST milescoda.xyz/api/definitions');
    console.log('       Body: {"word": "example", "definition": "a sample"}');
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
