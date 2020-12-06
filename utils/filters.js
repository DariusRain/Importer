const fs = require("fs");
const patterns = [
    /.city.:.""/,
    /.city.:."[a-z]{1,2}"/,
    /WWashington/
]
const pathToSeparated = "../data/test/separated.json"
const pathToUpdated = "../data/test/allParsedData.json"
const pathToMain = "../data/allParsedData.json"
let filtered = []
let updated = []
const filterOutByPatterns = () => {
    JSON.parse(fs.readFileSync(pathToMain, "utf-8")).forEach((biz) => patterns.forEach((pattern) => {
        if (!biz.city.search(pattern) == -1) {
            filtered.push(biz);
        } else {
            updated.push(biz)
        }
    }));
    fs.writeFileSync(pathToSeparated, JSON.stringify(filtered));
    fs.writeFileSync(pathToUpdated, JSON.stringify(updated))
}

filterOutByPatterns()

