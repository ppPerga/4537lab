// Client script for lab5 (client folder)
// Uses LANG from client/lang.js

function el(id){ return document.getElementById(id); }

async function insertSample(){
    const resultDiv = el(LANG.ids.insertResult);
    resultDiv.innerHTML = '';
    try{
        const res = await fetch(LANG.api.insertSample, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            resultDiv.innerHTML = LANG.templates.successParagraph(LANG.insertSuccess + ' (id:' + (data.lastID || 'n/a') + ')');
        } else {
            resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.insertFailure + ': ' + (data.error || JSON.stringify(data)));
        }
    }catch(err){
        resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.genericError + err.message);
    }
}

function detectQueryType(q){
    if (!q) return null;
    const t = q.trim().split(/\s+/)[0].toUpperCase();
    if (t === 'SELECT') return 'SELECT';
    if (t === 'INSERT') return 'INSERT';
    return null;
}

async function runQuery(){
    const query = el(LANG.ids.queryTextarea).value.trim();
    const resultDiv = el(LANG.ids.queryResult);
    resultDiv.innerHTML = '';
    if (!query) { resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.missingQuery); return; }
    const type = detectQueryType(query);
    if (!type){ resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.invalidQuery); return; }

    try{
        if (type === 'SELECT'){
            // send via GET
            const url = LANG.api.query + '?sql=' + encodeURIComponent(query);
            const res = await fetch(url);
            const data = await res.json();
            if (data.success){
                resultDiv.innerHTML = LANG.templates.resultTable(data.rows);
            } else {
                resultDiv.innerHTML = LANG.templates.errorParagraph(data.error || JSON.stringify(data));
            }
        } else {
            // INSERT -> send via POST
            const res = await fetch(LANG.api.query, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ sql: query }) });
            const data = await res.json();
            if (data.success){
                resultDiv.innerHTML = LANG.templates.successParagraph('Inserted. lastID: ' + (data.lastID||'n/a'));
            } else {
                resultDiv.innerHTML = LANG.templates.errorParagraph(data.error || JSON.stringify(data));
            }
        }
    }catch(err){
        resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.genericError + err.message);
    }
}

function initialize(){
    document.title = LANG.pageTitle;
    el(LANG.ids.insertSampleBtn).textContent = LANG.insertSampleButton;
    el(LANG.ids.querySubmitBtn).textContent = LANG.querySubmitButton;
    el(LANG.ids.queryTextarea).placeholder = LANG.queryPlaceholder;

    el(LANG.ids.insertSampleBtn).addEventListener('click', insertSample);
    el(LANG.ids.querySubmitBtn).addEventListener('click', runQuery);
}

document.addEventListener('DOMContentLoaded', initialize);
