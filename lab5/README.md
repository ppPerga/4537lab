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

Run locally
1. cd lab5
2. npm install
   - If you want to use `nodesql`, install it (optional): `npm i nodesql` (if available)
3. npm start
4. Open http://localhost:4001/index.html in your browser

Notes
- Queries are validated and only SELECT and INSERT are allowed. DROP/ALTER/UPDATE/DELETE/TRUNCATE are blocked.
- If you host frontend separately, change endpoints in `lang.js` api paths to the backend domain (e.g. `https://api.example.com/api/query`).
- The database file `lab5.db` will be created in the `lab5` folder.

Security
- This is a simple lab/demo. Do not expose this to untrusted users without additional validation and authentication.
