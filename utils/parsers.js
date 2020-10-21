const addressParser = require('parse-address'),
{ default: validate } = require("validator");

function parseData(biz) {

    let dataObj = {
      phone: '', streetName: '', city: '', state: '', zipcode: '', about: '', email: '', categories: [], website: '', photos:[], type: ''
    }
    let skip;
    if (biz.description !== undefined && biz.description.trim() !== '') {
      dataObj.about = parseDesc(biz.description)
    }
  
    if (!biz.name === undefined || biz.name === '') {
      dataObj.name = parseName(biz.name)
    } else {
      return false;
    }

    if (biz.image.includes("png") || biz.image.includes("jpeg")) {
        dataObj.photos.push(biz.image.trim());
    }
    biz.contact.forEach(info => {
      skip = false;
      let cntData = info.value.trim();
      switch (info.type) {
        case 'phone':
          if (cntData.includes('\n')) {
            cntData = cntData.split('\n')[cntData.split('\n').length - 1]
          }
          const tempPhone = parsePhone(cntData);
          if (tempPhone != undefined && validate.isMobilePhone(tempPhone.trim())) {
            dataObj.phone = tempPhone.trim();
          } else {
            console.log(`"${cntData}" is not a phone number...`)
          }
          break;
        case 'e-mail':
          if (validate.isEmail(cntData)) {
            dataObj.email = cntData;
          } else {
            console.log(`"${cntData}" is not an email...`)
          }
          break;
        case 'twitter':
          dataObj.twitter = cntData
          break;
        case 'instagram':
          dataObj.instagram = cntData
          break;    
        case 'facebook':
            dataObj.facebook = cntData
          break;
        case 'address':
          const parsedAddr = parseAdd(cntData);
          // console.log(parsedAddr);
          if (!parsedAddr === false) {
            // separatedBiz = true;
            const {city, state, zipcode, streetName} = parsedAddr;
            dataObj.city = city;
            dataObj.state = state;
            dataObj.zipcode = zipcode;
            dataObj.streetName = streetName;
          } else {
            // console.log(`"${cntData}" is not a address...`)
            skip = true;
            return false;
          }
          break;
        case 'category':
          dataObj.categories = [...cntData.split(",")].filter(cat => cat !== 'Other');
          dataObj.type = dataObj.categories[0];
          break;
        case 'website':
          dataObj.website = cntData;
          break;
      }
    });
    return skip ? false : dataObj;
  }
  
  
  
  //title case a string
  function titleCase(str) {
    if (str === 'LCC') return str
    return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase()
  }
  
  
  
  
  function parseName(str) {
  
    let parsedName = str.split(' ');
  
    parsedName = parsedName.map(e => {
      return titleCase(e)
    });
  
    parsedName = parsedName.join(' ');
    return parsedName
  }
  
  
  
  
  function parsePhone(str) {
    let parsedPhone = str
      .toLowerCase()
      .replace(/[a-z]/g, "")
      .replace(/-/g, "")
      .replace(/\+1/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/ /g, "")
      .replace(/\./g, "");
  
    parsePhone =
      parsePhone.length === 11 && parsePhone[0] === 1
        ? parsePhone.slice(1, parsePhone.length - 1) : parsePhone;
    return parsedPhone
  }
  
  
  
  
  function parseDesc(str) {
    const r = /[^a-zA-Z.\, ]/g;
    return str.replace(r, '')
  }
  
  
  function parseAdd(str) {
    let city, state, zipcode, streetName;
    const parsedAddress = addressParser.parseAddress(str);
    if (!parsedAddress === false) {
      parsedAddress.city && (city = parsedAddress.city);
      if (!parsedAddress.state) return false;
      state = parsedAddress.state.toUpperCase();
      parsedAddress.zip && (zipcode = parsedAddress.zip);
      parsedAddress.street && (streetName = parsedAddress.street);
      parsedAddress.type && (streetName += ` ${parsedAddress.type}`);
      parsedAddress.sec_unit_type && (streetName += ` ${parsedAddress.sec_unit_type}`);
      parsedAddress.sec_unit_num && (streetName += ` ${parsedAddress.sec_unit_num}`);
      console.log({city, state, zipcode, streetName})
      return {city, state, zipcode, streetName};
  
    } else {
      return false;
    }
  
  }
  

  module.exports = {parseData, titleCase, parseName, parsePhone, parseDesc, parseAdd};