const addressParser = require("parse-address");
function parseWeirdAddr(siteNum, addr) {
    switch(siteNum) {
        case 1:
            const re = /[a-z|0-9][A-Z]/;
            
            let index = addr.search(re);
            addr = addr.replace(/,/, "");
            addr = addr.substring(0, index + 1) + " " + addr.substring(index + 1, addr.length - 1 );
            index = addr.search(re);
            if (0 < index) {
                parseWeirdAddr(1, addr);
            }
            console.log(addressParser.parseLocation(addr));
            console.log(addr);

            addr = addr.replace("# ", "Apt # ")
            return addr;

        default:
            console.log("Invalid argument @utils.parsers#parseWeirdAddr(int siteNumber)");
    }
}

// parseWeirdAddr(1, "3504 East Main StreetCollege Park, Georgia, United States, 30337")
// parseWeirdAddr(1, "8282 S Memorial Dr # 110Tulsa, Oklahoma, United States, 74133")
parseWeirdAddr(1, "1845 Highway 126Florence, Oregon, United States, 97439")

module.exports = {
    parseWeirdAddr
}