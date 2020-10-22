const fs = require("fs");
let allBizs = [];
let fileNames = fs.readdirSync("scraped");

module.exports = () => {
    // let count = 0;
    // For each file name in the "scraped" directory
    fileNames.forEach(fileName => {
        // count++;
        // Get file from scraped directory with current fileName in itteration alphabetically.
        let file = fs.readFileSync(`./scraped/${fileName}`);

        // Add current bizs array ineach json file to the allBizs array which will later be added to a large json file.
        allBizs.push(...JSON.parse(file).bizs);
    })


    //  Create json file of all bizs pushed to the array
    fs.writeFileSync("allBizsRaw.json", JSON.stringify(allBizs));

    // Debug:
    // console.log("count:", count);
    console.log("Bizs:", allBizs.length);
} 