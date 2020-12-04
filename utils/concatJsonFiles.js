const fs = require("fs");

const st1 = "allParsedData-1.json";
const st2 = "allParsedData.json";

// const data1 = JSON.parse(fs.readFileSync( process.cwd() + "/data/"+st1, 'utf8'));
// const data2 = JSON.parse(fs.readFileSync( process.cwd() + "/data/"+st2, 'utf8'));
// const final = data1.concat(data2);
// fs.writeFileSync("allDataFinal.json", JSON.stringify(final));

const data2 = JSON.parse(fs.readFileSync( "allDataFinal.json", 'utf8'));
