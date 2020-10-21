const fs = require("fs");
function separateBizs(bizs) {
    fs.writeFileSync('separatedBizs.json', JSON.stringify(bizs));
  }

module.exports = { separateBizs };