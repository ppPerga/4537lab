Lab 5 - Nodesql Client/Server

This folder contains a small client/server app modeled after lab4.

What it does
- Client has a button to insert a sample name and birthdate row via POST. Press multiple times will add multiple rows.
- Client has a textarea to send SQL queries. SELECT queries are sent via GET (query string). INSERT queries are sent via POST (JSON body { sql }).
- Server attempts to use the `nodesql` module if available. If not, it falls back to `sqlite3`.

Files
- `index.html` - client UI
- `lang.js` - language strings/config
- `script.js` - client logic
- `server.js` - Express server and DB logic
- `package.json` - dependencies and start script

Client folder for Netlify
- `client/` contains the static client files suitable for deploying to Netlify or any static host. Upload the entire `lab5/client` folder (or connect it via Git) to deploy the frontend separately from the backend.
   - `client/index.html`
   - `client/lang.js`
   - `client/script.js`
   - (optional) `client/style.css` if you add it

Run locally
1. cd lab5
2. npm install
   - If you want to use `nodesql`, install it (optional): `npm i nodesql` (if available)
3. npm start
4. Open http://localhost:5001/index.html in your browser

Environment variables
- `ALLOWED_ORIGIN` - optional. Set to the full origin of the frontend (for example `https://your-site.netlify.app`) to restrict CORS. Defaults to `*` (allow all).
- `ALLOW_CREDENTIALS` - optional. Set to `true` to send `Access-Control-Allow-Credentials: true`.

Simple run and background options

You can run the server directly without PM2. Below are minimal options for development and simple production runs.

- Run in the foreground (temporary):

```bash
cd /root/4537lab/lab5
ALLOWED_ORIGIN='https://lab5-nodesqlclient.netlify.app' ALLOW_CREDENTIALS='false' PORT=5001 node server.js
```

- Run and keep it running after logout (nohup):

```bash
cd /root/4537lab/lab5
nohup ALLOWED_ORIGIN='https://lab5-nodesqlclient.netlify.app' ALLOW_CREDENTIALS='false' PORT=5001 node server.js > server.log 2>&1 &
```

- Windows PowerShell (temporary for local testing):

```powershell
cd 'C:\WebDev\4537\labs\DigOce\4537lab\lab5'
$env:ALLOWED_ORIGIN='https://lab5-nodesqlclient.netlify.app'; $env:ALLOW_CREDENTIALS='false'; $env:PORT='5001'; node server.js
```

- Use a .env file with dotenv (optional, tiny change to `server.js` to `require('dotenv').config()`):

1. npm install dotenv
2. create a `.env` file with:

```
ALLOWED_ORIGIN=https://lab5-nodesqlclient.netlify.app
ALLOW_CREDENTIALS=false
PORT=5001
```

3. Start with `node server.js` and dotenv will load those values.

If you run the server behind Nginx, make sure Nginx proxies `/api/lab5/` to the Node server on the configured port (default 5001). Nginx can also inject CORS headers if you prefer to handle it at the proxy layer.

Notes
- Queries are validated and only SELECT and INSERT are allowed. DROP/ALTER/UPDATE/DELETE/TRUNCATE are blocked.
- If you host frontend separately, change endpoints in `lang.js` api paths to the backend domain (e.g. `https://api.example.com/api/query`).
- The database file `lab5.db` will be created in the `lab5` folder.

Security
- This is a simple lab/demo. Do not expose this to untrusted users without additional validation and authentication.
