const fs = require("fs");

//  Compiles x amount of JSON files from a directory path into one JSON file which will only contain an arrray.
class Compiler {

    // Container for all collected elements until parsed into one JSON file.
    allBizs = []
    
    // Path is the directory path that has all the JSON files.
    constructor(path) {
        this.path = path;
    }
    
    compile() {

        // Get array of file names in directory
        let fileNames = fs.readdirSync(path);

        // For each file name in the "scraped" directory
        fileNames.forEach(fileName => {

            // Get file from scraped directory with current fileName in itteration alphabetically.
            let file = fs.readFileSync(`${path}${fileName}`);

            // Add current bizs array ineach json file to the allBizs array which will later be added to a large json file.
            this.allBizs.push(...JSON.parse(file).bizs);
        })


        //  Create json file of all bizs pushed to the array
        fs.writeFileSync("allBizsRaw.json", JSON.stringify(allBizs));

        // Debug:
        // console.log("count:", count);
        console.log("Compiled: ", allBizs.length);

    }
}




module.exports = Compiler;