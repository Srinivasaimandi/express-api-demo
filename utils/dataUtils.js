const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data.json');

function getData() {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(fileContent);
}

function saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { getData, saveData };