const {getState}= require("./stateFromZip");
const stateMap = require("./stateMapCap");
const addressParser = require("parse-address");
function parseWeirdAddr(siteNum, addr) {
    switch(siteNum) {
        case 1:
            const re = /[a-z|0-9][A-Z]/;
            
           
            // console.log("Before: ", addr)
            let index = addr.search(re);
            addr = addr.substring(0, index + 1) + ", " + addr.substring(index + 1, addr.length);
            // console.log("SubStr: ", addr)
            index = addr.search(re);
            if (0 < index) {
                return parseWeirdAddr(1, addr);
            }

            const addArr = addr.split(" ");
            const zip = addArr[addArr.length-1];
            if (zip.length == 5 && zip.search(/[a-zA-Z]/) ) {
                // console.log(zip);
                const stateFull = getState(zip, true);
                addr = addr.replace("United States", getState(zip) )///[United States]/i
                addr = addr.replace(stateFull+",", "");
            }

            addr = addr.replace(" # ", " ").replace(/\s[0-9]+,\s/, ", ");
            // console.log(addr.split(","));
            addressArr = addr.split(",").filter(str=>str!="");

            // console.log(addressArr);

            if (addressArr.length == 3) {

                    addressArr.splice(1, 0, "nocity");
                    addr = addressArr.join(",");

            }
            // console.log(addressParser.parseLocation(addr));
            // console.log("Final: ", addr);

            return addr;

        default:
            console.log("Invalid argument @utils.parsers#parseWeirdAddr(int siteNumber)");
    }
}


// // Fixed these issues
// parseWeirdAddr(1, "1845 Highway 126Florence, Oregon, United States, 97439")
// parseWeirdAddr(1, "8282 S Memorial Dr # 110Tulsa, Oklahoma, United States, 74133")
// parseWeirdAddr(1, "3504 East Main StreetCollege Park, GeorgiaUnited States, 30337")
// parseWeirdAddr(1, "29275 County Road 247Carrollton, Texas, United States, 64633")
// parseWeirdAddr(1, "1397 Munford AveUnited States, 38058")

// // No state
// parseWeirdAddr(1, "111 E Broadway StUnited States, 39194")
// parseWeirdAddr(1, "900 Saddletree Ct, United States, 78231")

// parseWeirdAddr(1, "600 E Boulevard Ave # 16Bismarck, North Dakota, United States, 58505")

const finalParse = ( biz ) => {
  if (biz.city == "nocity") biz.city = "";
  biz.street_name = (biz.street_num.trim()+" "+biz.street_name.trim());
  if (biz.street_name == " RR") biz.street_name = "";
  
    const 
    addrStr = biz.street_name.split(" "),
    lastAddrStr = addrStr[addrStr.length-1];
  
    const regExTes1 = /[A-Z|0-9][A-Z]/;
    const regExTes2 = /[A-Z|0-9][A-Z][a-z]/;
  
    if (regExTes1.test(lastAddrStr) && lastAddrStr.length != 2) {        
      
        const splitIndex = regexIndexOf(regExTes1, biz.street_name, biz.street_name.indexOf(lastAddrStr));
        const newStreetName = biz.street_name.substr(0,splitIndex);
        const newCityName = biz.street_name.substr(splitIndex+1)
        biz.street_name = newStreetName;
        biz.city = newCityName+" "+biz.city.trim()
    } else if (regExTes2.test(biz.city)) {
        const splitIndex = regexIndexOf(regExTes2, biz.city, 0);
        const streetAdd = biz.city.substr(0,splitIndex+1);
        const newCityName = biz.city.substr(splitIndex+1)
        biz.street_name = biz.street_name+" "+streetAdd;
        biz.city = newCityName;
    } else if (regExTes1.test(biz.city) && !regExTes2.test(biz.city)) {
        
        biz.street_name = biz.street_name+" "+biz.city;
        biz.city = "Washington"
        biz.state = "DC"
      
    } else if (biz.city.length == 2 && biz.city != 'of') {
      biz.street_name = biz.street_name+" "+biz.city
      biz.city = "";
      
    }
  
  const cityArr = biz.city.split(" ");
  const len = cityArr.length;
  if (
    stateMap[cityArr[1]] != undefined
    || ( len > 2 && stateMap[cityArr[len-2]+" "+cityArr[len-1]] != undefined )
  ) {
    biz.city = cityArr[0];
  }
  return biz;
}
module.exports = {
    finalParse,
    parseWeirdAddr
}