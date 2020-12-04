const addressParser = require("parse-address");

const indexOfRegex = require('./indexOfRegex');
const stateMap = require("./stateMap");

let count = 0;
function parseWeirdAddr(siteNum, addr) {
    switch(siteNum) {
        case 1:
            const re = /[a-z|0-9][A-Z]/;
            
            let index = addr.search(re);
            addr = addr.replace("United States,", "");
            addr = addr.substring(0, index + 1) + " " + addr.substring(index + 1, addr.length );
            index = addr.search(re);
            if (0 < index) {
                parseWeirdAddr(1, addr);
            }

            // if ( count < 100) {
            //     console.log(addressParser.parseLocation(addr));
            //     console.log(addr);
            // }
            // count++;

            // addr = addr.replace("# ", "Apt # ")
            return addr;

        default:
            console.log("Invalid argument @utils.parsers#parseWeirdAddr(int siteNumber)");
    }
}


function finalAddrParse ( addrObj ) {

    if (addrObj.city == "nocity") addrObj.city = "";
  
    addrObj.streetName = (addrObj.streetNumber.trim()+" "+addrObj.streetName.trim());
  
    if (addrObj.streetName == " RR") addrObj.streetName = "";
      
      const 
      addrStr = addrObj.streetName.split(" "),
      lastAddrStr = addrStr[addrStr.length-1];
    
      const regExTes1 = /[A-Z|0-9][A-Z]/;
      const regExTes2 = /[A-Z|0-9][A-Z][a-z]/;
    
      if (regExTes1.test(lastAddrStr) && lastAddrStr.length != 2) {        
        
          const splitIndex = indexOfRegex(regExTes1, addrObj.streetName, addrObj.streetName.indexOf(lastAddrStr));
          const newStreetName = addrObj.streetName.substr(0,splitIndex);
          const newCityName = addrObj.streetName.substr(splitIndex+1)
          addrObj.streetName = newStreetName;
          addrObj.city = newCityName+" "+addrObj.city.trim()
  
      } else if (regExTes2.test(addrObj.city)) {
  
          const splitIndex = indexOfRegex(regExTes2, addrObj.city, 0);
          const streetAdd = addrObj.city.substr(0,splitIndex+1);
          const newCityName = addrObj.city.substr(splitIndex+1)
          addrObj.streetName = addrObj.streetName+" "+streetAdd;
          addrObj.city = newCityName;
  
      } else if (regExTes1.test(addrObj.city) && !regExTes2.test(addrObj.city)) {
          
          addrObj.streetName = addrObj.streetName+" "+addrObj.city;
          addrObj.city = "Washington"
          addrObj.state = "DC"
        
      } else if (addrObj.city.length == 2 && addrObj.city != 'of') {
  
        addrObj.streetName = addrObj.streetName+" "+addrObj.city
        addrObj.city = "";
        
      }
  
    
    const cityArr = addrObj.city.split(" ");
    const len = cityArr.length;
  
    if (
      stateMap[cityArr[1]] != undefined
      || ( len > 2 && stateMap[(cityArr[len-2]+" "+cityArr[len-1])] != undefined )
    ) {
      addrObj.city = cityArr[0];
    }
  
    return addrObj;
  
}

// parseWeirdAddr(1, "3504 East Main StreetCollege Park, Georgia, United States, 30337")
// parseWeirdAddr(1, "8282 S Memorial Dr # 110Tulsa, Oklahoma, United States, 74133")
// parseWeirdAddr(1, "1845 Highway 126Florence, Oregon, United States, 97439")

module.exports = {
    parseWeirdAddr,
    finalAddrParse
}