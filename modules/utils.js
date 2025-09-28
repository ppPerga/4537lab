const fs = require('fs');
const path = require('path');

const langPath = path.join(__dirname, '..', 'lang', 'en', 'en.json');
const strings = JSON.parse(fs.readFileSync(langPath, 'utf8'));

function getDate() {
    return new Date().toLocaleString();
}

function getString(key, ...replacements) {
    let text = strings[key] || key;
    
    replacements.forEach((replacement, index) => {
        text = text.replace(`%${index + 1}`, replacement);
    });
    
    return text;
}

module.exports = {
    getDate,
    getString
};