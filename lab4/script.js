const API_BASE_URL = '/api/definitions';

// Search for a specific word
async function searchWord() {
    const word = document.getElementById('searchWord').value.trim();
    const resultDiv = document.getElementById('searchResult');
    
    if (!word) {
        resultDiv.innerHTML = '<p class="error">Please enter a word to search</p>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}?word=${encodeURIComponent(word)}`);
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="success">
                    <h3>${data.word}</h3>
                    <p>${data.definition}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Add a new definition
async function addDefinition() {
    const word = document.getElementById('newWord').value.trim();
    const definition = document.getElementById('newDefinition').value.trim();
    const resultDiv = document.getElementById('addResult');
    
    if (!word || !definition) {
        resultDiv.innerHTML = '<p class="error">Please enter both word and definition</p>';
        return;
    }
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ word, definition })
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `<p class="success">${data.message}</p>`;
            document.getElementById('newWord').value = '';
            document.getElementById('newDefinition').value = '';
        } else {
            resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Note: Update and Delete functions removed - only GET and POST are supported

// Get all definitions
async function getAllDefinitions() {
    const resultDiv = document.getElementById('allDefinitions');
    
    try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        
        if (data.success) {
            const definitionsHtml = Object.entries(data.definitions)
                .map(([word, definition]) => `
                    <div class="definition-item">
                        <strong>${word}:</strong> ${definition}
                    </div>
                `)
                .join('');
            
            resultDiv.innerHTML = `
                <div class="success">
                    <p>Total definitions: ${data.count}</p>
                    ${definitionsHtml}
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Clear search input on Enter key
document.getElementById('searchWord').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWord();
    }
});

// Load all definitions on page load
document.addEventListener('DOMContentLoaded', function() {
    getAllDefinitions();
});