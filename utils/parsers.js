const addressParser = require("parse-address");

const indexOfRegex = require('./indexOfRegex');
const {getState} = require('./stateFromZip')
const stateMap = require("./stateMap");

let count = 0;
function parseWeirdAddr(siteNum, addr) {
    switch(siteNum) {
        case 1:
            // console.log("Before: ", addr)
        
            const re = /[a-z|0-9][A-Z]/;
            let index = addr.search(re);
            while ( index != -1) {
                addr = addr.substring(0, index + 1) + ", " + addr.substring(index + 1, addr.length);
                index = addr.search(re);
            }

            addr = addr.replace("United States,", addr.split(",").length == 2 ? "," : "");
            addr = addr.replace("United States", "");
            
            const addArr = addr.split(" ");
            const zip = addArr[addArr.length-1];
            if (zip.length == 5 && zip.search(/[a-zA-Z]/)==-1 ) {
                
                if (addr.split(",").length == 2) {
                    const state = getState(zip)+",";
                    addArr.splice(addArr.length-1, 0, ",no city,", state)
                    addr = addArr.join(" ");
                } else {
                    const stateFull = getState(zip, true);
                    addr = addr.replace(stateFull, getState(zip));                
                }

            } else if (zip.length == 4 && zip.search(/[a-zA-Z]/)==-1 ) {
                addArr[addArr.length-1] = "0" + addArr[addArr.length-1];
                addr = addArr.join(" ");
               
            } else {
                return "";
            }
            
            // addr = addr.replace(" # ", " ").replace(/\s[0-9]+,\s/, ", ");
            addressArr = addr.split(",").filter(str=>str!="");
            
            if (addressArr.length == 3) {
                addressArr.splice(1, 0, "nocity");
                addr = addressArr.join(",");
            }

            // console.log("After: ", addr)
            // console.log(addressParser.parseLocation(addr));
            return addr
        default:
            console.log("Invalid argument @utils.parsers#parseWeirdAddr(int siteNumber)");
    }
}

//TRY TO GET THESE ALL TO PASS
// 5317 N 17th StMcAllen, Texas, United States, 78504
// 236 Massachusetts Avenue, NESuite 201Washington, District Of Columbia, United States, 20002
// PO Box 5541 New York, New York, United States, 10027
// 31931 Camino Capistrano # JUnited States, 92675

// parseWeirdAddr(1, "PO Box 5541 New York, New York, United States, 10027")
// parseWeirdAddr(1, "31931 Camino Capistrano # JUnited States, 92675")
// parseWeirdAddr(1, "303 Washington St WUnited States, 25309")
// parseWeirdAddr(1, "N6206 N French Creek RdTaylor, Michigan, United States, 54659")
// parseWeirdAddr(1, "3504 East Main StreetCollege Park, Georgia, United States, 30337")
// parseWeirdAddr(1, "8282 S Memorial Dr # 110Tulsa, Oklahoma, United States, 74133")
// parseWeirdAddr(1, "1845 Highway 126, Oregon, United States, 97439")


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

module.exports = {
    parseWeirdAddr,
    finalAddrParse
}
