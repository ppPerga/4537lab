// Language configuration for lab5 client
const LANG = {
    pageTitle: "Lab 5 - Nodesql Client",
    mainHeading: "Lab 5: Nodesql Client/Server",

    // Buttons and labels
    insertSampleButton: "Insert Sample Row",
    querySubmitButton: "Run Query",

    // Placeholders and helpers
    queryPlaceholder: "Enter a SQL query (SELECT or INSERT only)",

    // Messages
    insertSuccess: "Inserted sample row",
    insertFailure: "Failed to insert sample row",
    invalidQuery: "Query type not allowed. Only SELECT and INSERT queries are supported.",
    missingQuery: "Please enter a SQL query",
    genericError: "Error: ",

    // API endpoints (change to full backend URL if hosted separately)
    api: {
        insertSample: "/api/insert-sample",
        query: "/api/query"
    },

    // DOM element ids
    ids: {
        insertSampleBtn: "insertSampleBtn",
        queryTextarea: "queryTextarea",
        querySubmitBtn: "querySubmitBtn",
        resultDiv: "result",
        pageTitle: "pageTitle",
        mainHeading: "mainHeading"
    },

    // Templates
    templates: {
        errorParagraph: (msg) => `<p class=\"error\">${msg}</p>`,
        successParagraph: (msg) => `<p class=\"success\">${msg}</p>`,
        resultTable: (rows) => {
            if (!rows || rows.length === 0) return '<p>No rows returned</p>';
            const cols = Object.keys(rows[0]);
            const header = '<tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr>';
            const body = rows.map(r => '<tr>' + cols.map(c => `<td>${(r[c]===null? 'NULL': r[c])}</td>`).join('') + '</tr>').join('');
            return `<table class=\"result-table\">${header}${body}</table>`;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = LANG;
