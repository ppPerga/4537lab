// Search for a specific word
async function searchWord() {
    const word = document.getElementById(LANG.elementIds.searchWord).value.trim();
    const resultDiv = document.getElementById(LANG.elementIds.searchResult);
    
    if (!word) {
        resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.enterWordError);
        return;
    }
    
    try {
        const response = await fetch(`${LANG.apiBaseUrl}?word=${encodeURIComponent(word)}`);
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = LANG.templates.successDiv(data.word, data.definition);
        } else {
            resultDiv.innerHTML = LANG.templates.errorParagraph(data.error);
        }
    } catch (error) {
        resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.genericError + error.message);
    }
}

// Add a new definition
async function addDefinition() {
    const word = document.getElementById(LANG.elementIds.newWord).value.trim();
    const definition = document.getElementById(LANG.elementIds.newDefinition).value.trim();
    const resultDiv = document.getElementById(LANG.elementIds.addResult);
    
    if (!word || !definition) {
        resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.enterBothFieldsError);
        return;
    }
    
    try {
        const response = await fetch(LANG.apiBaseUrl, {
            method: LANG.httpMethods.post,
            headers: {
                'Content-Type': LANG.contentType,
            },
            body: JSON.stringify({ word, definition })
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = LANG.templates.successParagraph(data.message);
            document.getElementById(LANG.elementIds.newWord).value = '';
            document.getElementById(LANG.elementIds.newDefinition).value = '';
        } else {
            resultDiv.innerHTML = LANG.templates.errorParagraph(data.error);
        }
    } catch (error) {
        resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.genericError + error.message);
    }
}

// Note: Update and Delete functions removed - only GET and POST are supported

// Get all definitions
async function getAllDefinitions() {
    const resultDiv = document.getElementById(LANG.elementIds.allDefinitions);
    
    try {
        const response = await fetch(LANG.apiBaseUrl);
        const data = await response.json();
        
        if (data.success) {
            const definitionsHtml = Object.entries(data.definitions)
                .map(([word, definition]) => LANG.templates.definitionItem(word, definition))
                .join('');
            
            resultDiv.innerHTML = LANG.templates.allDefinitionsSuccess(data.count, definitionsHtml);
        } else {
            resultDiv.innerHTML = LANG.templates.errorParagraph(data.error);
        }
    } catch (error) {
        resultDiv.innerHTML = LANG.templates.errorParagraph(LANG.genericError + error.message);
    }
}

// Initialize page content and event listeners
function initializePage() {
    // Set page content from language file
    document.getElementById('pageTitle').textContent = LANG.pageTitle;
    document.title = LANG.pageTitle;
    document.getElementById('mainHeading').textContent = LANG.mainHeading;
    document.getElementById('lookupHeading').textContent = LANG.lookupHeading;
    document.getElementById('addDefinitionHeading').textContent = LANG.addDefinitionHeading;
    document.getElementById('allDefinitionsHeading').textContent = LANG.allDefinitionsHeading;
    document.getElementById('searchButton').textContent = LANG.searchButton;
    document.getElementById('addButton').textContent = LANG.addButton;
    document.getElementById('loadAllButton').textContent = LANG.loadAllButton;
    
    // Set placeholders
    document.getElementById(LANG.elementIds.searchWord).placeholder = LANG.searchPlaceholder;
    document.getElementById(LANG.elementIds.newWord).placeholder = LANG.wordPlaceholder;
    document.getElementById(LANG.elementIds.newDefinition).placeholder = LANG.definitionPlaceholder;
    
    // Set up event listeners
    document.getElementById(LANG.elementIds.searchWord).addEventListener(LANG.events.keypress, function(e) {
        if (e.key === LANG.events.enter) {
            searchWord();
        }
    });
    
    // Load all definitions on page load
    getAllDefinitions();
}

// Initialize page when DOM is loaded
document.addEventListener(LANG.events.domContentLoaded, initializePage);