// Language configuration file for Dictionary REST API Client
const LANG = {
    // Page content
    pageTitle: "Dictionary REST API Client",
    mainHeading: "Dictionary REST API",
    
    // Section headings
    lookupHeading: "Look Up Word",
    addDefinitionHeading: "Add New Definition",
    allDefinitionsHeading: "All Definitions",
    
    // Button labels
    searchButton: "Search",
    addButton: "Add",
    loadAllButton: "Load All Definitions",
    
    // Input placeholders
    searchPlaceholder: "Enter word to search",
    wordPlaceholder: "Word",
    definitionPlaceholder: "Definition",
    
    // Error messages
    enterWordError: "Please enter a word to search",
    enterBothFieldsError: "Please enter both word and definition",
    genericError: "Error: ",
    
    // Success messages
    totalDefinitionsLabel: "Total definitions: ",
    
    // API configuration
    apiBaseUrl: "https://milescoda.xyz/api/definitions",
    
    // HTTP methods
    httpMethods: {
        post: "POST"
    },
    
    // Content types
    contentType: "application/json",
    
    // CSS classes
    cssClasses: {
        error: "error",
        success: "success",
        definitionItem: "definition-item"
    },
    
    // DOM element IDs
    elementIds: {
        searchWord: "searchWord",
        searchResult: "searchResult",
        newWord: "newWord",
        newDefinition: "newDefinition",
        addResult: "addResult",
        allDefinitions: "allDefinitions"
    },
    
    // Event types
    events: {
        enter: "Enter",
        domContentLoaded: "DOMContentLoaded",
        keypress: "keypress"
    },
    
    // HTML template strings
    templates: {
        errorParagraph: (message) => `<p class="${LANG.cssClasses.error}">${message}</p>`,
        successDiv: (word, definition) => `
            <div class="${LANG.cssClasses.success}">
                <h3>${word}</h3>
                <p>${definition}</p>
            </div>
        `,
        successParagraph: (message) => `<p class="${LANG.cssClasses.success}">${message}</p>`,
        definitionItem: (word, definition) => `
            <div class="${LANG.cssClasses.definitionItem}">
                <strong>${word}:</strong> ${definition}
            </div>
        `,
        allDefinitionsSuccess: (count, definitionsHtml) => `
            <div class="${LANG.cssClasses.success}">
                <p>${LANG.totalDefinitionsLabel}${count}</p>
                ${definitionsHtml}
            </div>
        `
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LANG;
}