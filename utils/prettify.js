const beautify = require('json-beautify');
const fs = require("fs");

const prettifyJsonFile = (filePath) => {
    const prettifiedJson = beautify(JSON.parse(fs.readFileSync(filePath, "utf-8")), null, 2, 100);
    fs.writeFileSync(filePath, prettifiedJson);
}

module.exports = {
    prettifyJsonFile
}