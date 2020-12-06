const fs = require("fs");
const { prettifyJsonFile } = require("./prettify")
const patterns = [
    
]
const pathToSeparated = "./data/test/separated.json"
const pathToUpdated = "./data/test/allParsedData.json"
const pathToMain = "./data/allParsedData.json"
let filtered = []
let updated = []
const filterOutByPatterns = () => {
    JSON.parse(fs.readFileSync(pathToMain, "utf-8")).forEach((biz) => {
        // console.log(pattern)
        if (biz.city.trim() == "WWashington" || biz.city === "" || biz.city.trim().length <= 2) {
            filtered.push(biz);
        } else {
            updated.push(biz)
        }
    })
    fs.writeFileSync(pathToSeparated, JSON.stringify(filtered));
    fs.writeFileSync(pathToUpdated, JSON.stringify(updated))
    prettifyJsonFile(pathToSeparated)
    prettifyJsonFile(pathToUpdated)
}

filterOutByPatterns()

