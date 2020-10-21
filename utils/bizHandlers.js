const fs = require("fs");
function separateBizs(bizs) {
    fs.writeFileSync('./data/separatedBizs.json', JSON.stringify(bizs));
  }

module.exports = { separateBizs };