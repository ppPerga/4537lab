// Server for lab5 - no Express: use built-in http server. Tries to use 'nodesql' module, falls back to sqlite3
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// CORS configuration — default to your Netlify frontend origin for simplicity.
// You can still override by setting the ALLOWED_ORIGIN environment variable.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://lab5-nodesqlclient.netlify.app';
const ALLOW_CREDENTIALS = process.env.ALLOW_CREDENTIALS === 'true';

let dbImpl = null;
let usingNodesql = false;

async function initDb(){
    // Try to use nodesql
    try{
        const nodesql = require('nodesql');
        if (nodesql && typeof nodesql.open === 'function'){
            dbImpl = {
                run: (sql)=> new Promise((resolve, reject)=> {
                    const db = nodesql.open(path.join(__dirname,'lab5.db'));
                    if (typeof db.exec === 'function') db.exec(sql, (err, res)=> err?reject(err):resolve(res));
                    else if (typeof db.run === 'function') db.run(sql, (err, res)=> err?reject(err):resolve(res));
                    else reject(new Error('nodesql API not compatible'));
                }),
                all: (sql)=> new Promise((resolve, reject)=> {
                    const db = nodesql.open(path.join(__dirname,'lab5.db'));
                    if (typeof db.query === 'function') db.query(sql, (err, rows)=> err?reject(err):resolve(rows));
                    else reject(new Error('nodesql API not compatible'));
                })
            };
            usingNodesql = true;
            console.log('Using nodesql module');
        }
    }catch(e){
        // nodesql not available, fallback
    }

    if (!dbImpl){
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database(path.join(__dirname,'lab5.db'));
        dbImpl = {
            run: (sql) => new Promise((resolve, reject) => db.run(sql, function(err){ if (err) return reject(err); resolve({ lastID: this.lastID, changes: this.changes }); })),
            all: (sql) => new Promise((resolve, reject) => db.all(sql, (err, rows) => err?reject(err):resolve(rows)))
        };
        console.log('Using sqlite3 fallback');
    }

    // create table if not exists (patients table)
    const create = `CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        birthdate TEXT NOT NULL
    );`;
    await dbImpl.run(create).catch(err => { console.error('Error creating table:', err); });
}

function isAllowedSql(sql){
    if (!sql) return false;
    const t = sql.trim().split(/\s+/)[0].toUpperCase();
    if (t !== 'SELECT' && t !== 'INSERT') return false;
    if (/\b(DROP|ALTER|UPDATE|DELETE|TRUNCATE)\b/i.test(sql)) return false;
    return true;
}

function escapeSql(val){
    return `'${String(val).replace(/'/g,"''")}'`;
}

// Simple static file server helper
function serveStatic(filePath, res){
    const fullPath = path.join(__dirname, filePath);
    fs.readFile(fullPath, (err, data) => {
        if (err){
            res.writeHead(404, {'Content-Type':'text/plain'});
            res.end('Not found');
            return;
        }
        const ext = path.extname(fullPath).toLowerCase();
        const map = {
            '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.txt':'text/plain'
        };
        res.writeHead(200, {'Content-Type': map[ext] || 'application/octet-stream'});
        res.end(data);
    });
}

async function handleApi(req, res, parsedUrl){
    // CORS headers - use configured origin
    if (ALLOWED_ORIGIN === '*') {
        res.setHeader('Access-Control-Allow-Origin','*');
    } else {
        res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
        // advise caches that response varies by Origin
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    if (ALLOW_CREDENTIALS) res.setHeader('Access-Control-Allow-Credentials','true');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    // normalize paths: support both /api/... and /api/lab5/...
    let pathname = parsedUrl.pathname || '/';
    if (pathname.startsWith('/api/lab5')) pathname = pathname.replace(/^\/api\/lab5/, '/api');

    if (req.method === 'POST' && pathname === '/api/insert-sample'){
        try{
            const name = 'Sample_' + Date.now();
            const year = 1950 + Math.floor(Math.random()*60);
            const month = 1 + Math.floor(Math.random()*12);
            const day = 1 + Math.floor(Math.random()*28);
            const birthdate = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const sql = `INSERT INTO patients (name,birthdate) VALUES (${escapeSql(name)}, ${escapeSql(birthdate)});`;
            const r = await dbImpl.run(sql);
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify({ success: true, name, birthdate, lastID: r.lastID }));
        }catch(err){
            res.writeHead(500, {'Content-Type':'application/json'});
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    if (pathname === '/api/query'){
        if (req.method === 'GET'){
            const sql = parsedUrl.query.sql;
            if (!isAllowedSql(sql)) { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({ success:false, error:'Invalid or unsupported query' })); return; }
            try{
                if (sql.trim().toUpperCase().startsWith('SELECT')){
                    const rows = await dbImpl.all(sql);
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify({ success: true, rows }));
                } else {
                    const r = await dbImpl.run(sql);
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify({ success: true, lastID: r.lastID }));
                }
            }catch(err){
                res.writeHead(500, {'Content-Type':'application/json'});
                res.end(JSON.stringify({ success:false, error: err.message }));
            }
            return;
        }

    if (req.method === 'POST'){
            // collect body
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
                let obj = {};
                try{ obj = JSON.parse(body); }catch(e){ /* ignore */ }
                const sql = obj.sql;
                if (!isAllowedSql(sql)) { res.writeHead(400, {'Content-Type':'application/json'}); res.end(JSON.stringify({ success:false, error:'Invalid or unsupported query' })); return; }
                try{
                    if (sql.trim().toUpperCase().startsWith('SELECT')){
                        const rows = await dbImpl.all(sql);
                        res.writeHead(200, {'Content-Type':'application/json'});
                        res.end(JSON.stringify({ success: true, rows }));
                    } else {
                        const r = await dbImpl.run(sql);
                        res.writeHead(200, {'Content-Type':'application/json'});
                        res.end(JSON.stringify({ success: true, lastID: r.lastID }));
                    }
                }catch(err){
                    res.writeHead(500, {'Content-Type':'application/json'});
                    res.end(JSON.stringify({ success:false, error: err.message }));
                }
            });
            return;
        }
    }

    // not an API endpoint
    res.writeHead(404, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ success:false, error:'Not found' }));
}

const server = http.createServer(async (req, res) => {
    try{
        const parsedUrl = url.parse(req.url, true);

        // Basic request logging to help debug routing/CORS issues
        console.log(`[req] ${req.method} ${parsedUrl.pathname} host=${req.headers.host} from=${req.socket.remoteAddress}`);
        // also log origin header when present
        if (req.headers.origin) console.log(`      Origin: ${req.headers.origin}`);

        // API
        if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/api/')){
            return handleApi(req, res, parsedUrl);
        }

        // serve static files (index.html, script.js, lang.js, style.css etc.)
        let filePath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
        // disallow directory traversal
        if (filePath.includes('..')){ res.writeHead(400); res.end('Bad request'); return; }
        const fullPath = path.join(__dirname, filePath);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()){
            return serveStatic(filePath, res);
        }

        // fallback
        res.writeHead(404, {'Content-Type':'text/plain'});
        res.end('Not found');
    }catch(err){
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ success:false, error: err.message }));
    }
});

const PORT = process.env.PORT || 5001;
initDb().then(()=>{
    server.listen(PORT, ()=> console.log(`Lab5 server listening on http://localhost:${PORT}`));
}).catch(err=>{
    console.error('Failed to init DB:', err);
});
