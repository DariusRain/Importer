
const Reporter = require(".//Reporter");
const Biz = require("./Biz");
const addressParser = require("parse-address");
const fs = require("fs"),
  { separateBizs } = require("../utils/bizHandlers"),
  { default: validate } = require("validator");

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

class Parser {
  allBizs = [];
  separatedBizs = [];
  rawDataArr = []
  reporter = new Reporter();
  dataPath = './data/allBizsRaw.json';

  constructor(defaultBiz, validationCode, approvedDate) {
    this.defaultBiz = defaultBiz;
    this.validationCode = validationCode;
    this.approvedDate = approvedDate;
  }

  getRawDataArr() {
    this.rawDataArr = JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
  }

  parseBizs() {
    this.rawDataArr.forEach((biz) => {
      // console.log(biz);
      this.reporter.increment("total");
      const bizParsedData = this.parseBiz(JSON.parse(biz));

      if (bizParsedData === false) {
        this.separatedBizs.push(JSON.parse(biz));
        this.reporter.increment("unparsable");
        return;
      }

      this.reporter.write(bizParsedData);
      this.reporter.increment("parsed");
      const {
        name, phone, streetName,
        streetNumber, city, state,
        zipcode, about, email,
        website, type, categories,
        photos, openHour, closeHour } = bizParsedData;

      console.log(3, { name, phone, streetName, streetNumber, city, state, zipcode, about, email, website, type, categories, photos, openHour, closeHour })
      this.allBizs.push({
        ...this.defaultBiz,
        business_type: type,
        category: categories,
        name: name,
        owner_email: email,
        owner_phone: phone,
        business_web: website,
        street_name: streetName,
        street_num: streetNumber,
        open_hour: openHour,
        close_hour: closeHour,
        city: city,
        state: state,
        zipcode: zipcode,
        about: about,
        photos: photos,
      });


    })

  };



  parseBiz(biz) {
    // console.log(biz.contact);
    let skip = false;
    let dataObj = new Biz();
    if (biz.description !== undefined && biz.description.trim() !== '') {
      dataObj.about = this.parseDesc(biz.description)
    }
    if (biz.name != undefined) {
      dataObj.name = biz.name.toProperCase();
    } else {
      return false;
    }

    if (biz.image.includes("png") || biz.image.includes("jpeg")) {
      dataObj.photos.push(biz.image.trim());
    }
    if (biz.hours != undefined && biz.hours.length > 0) {
      let str = biz.hours[0].hours.split("-");
      console.log(str)
      if (str.length === 2) {
         this.parseHour(str[0]) != NaN && !this.parseHour(str[1]) != NaN && ( dataObj.openHour = this.parseHour(str[0]) ) && ( dataObj.closeHour = this.parseHour(str[1]) );
      }
      if(biz.openHour || biz.closeHour) {
        biz.openHour = this.defaultBiz.open_hour;
        biz.close_hour = this.defaultBiz.close_hour;
      }
    }


    let addressCount = 0;
    biz.contact.forEach(info => {
      // console.log(info);
      let cntData = info.value.trim();
      switch (info.type) {
        case 'phone':
          if (cntData.includes('\n')) {
            cntData = cntData.split('\n')[cntData.split('\n').length - 1]
          }
          const tempPhone = this.parsePhone(cntData);
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
          addressCount += 1;
          const parsedAddr = this.parseAdd(cntData);
          if (!parsedAddr === false) {
            // separatedBiz = true;
            // const {city, state, zipcode, streetName} = parsedAddr;
            dataObj = { ...dataObj, ...parsedAddr };
            this.reporter.increment("addresses")
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
    });;
    return skip || addressCount == 0 ? false : dataObj;
  }



  parseName(str) {

    let parsedName = str.split(' ');

    parsedName = parsedName.map(e => {
      return this.titleCase(e)
    });

    parsedName = parsedName.join(' ');
    return parsedName
  }

  parseHour(str) {
    return parseInt(str.indexOf("0") === 0 ? str.substring(1) : str);
  }



  parsePhone(str) {
    let parsedPhone = str
      .toLowerCase()
      .replace(/[a-z]/g, "")
      .replace(/-/g, "")
      .replace(/\+1/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "")
      .replace(/ /g, "")
      .replace(/\./g, "");

    parsedPhone =
      parsedPhone.length === 11 && parsedPhone[0] === 1
        ? parsedPhone.slice(1, parsedPhone.length - 1) : parsedPhone;
    return parsedPhone
  }




  parseDesc(str) {
    const r = /[^a-zA-Z.\, ]/g;
    return str.replace(r, '')
  }



  // --> Problem area
  parseAdd(str) {
    const parsedAddress = addressParser.parseLocation(str);
    // console.log(4, parsedAddress);
    if (!parsedAddress === false) {
      let { number, street, type, city, state, zip, sec_unit_type, sec_unit_num } = parsedAddress;
      let zipcode = "", streetName = "", streetNumber = "";
      if (state === undefined) return false;
      streetNumber = this.ifFalsey(number);
      state = state.toUpperCase();
      zipcode = this.ifFalsey(zip);
      streetName = this.ifFalsey(street);
      streetName += this.ifFalsey(type, true);
      streetName += this.ifFalsey(sec_unit_type, true);
      streetName += this.ifFalsey(sec_unit_num, true);
      console.log(1, parsedAddress)
      console.log(2, { city, state, zipcode, streetName, streetNumber })
      // console.log({city, state, zipcode, streetName})
      return { city, state, zipcode, streetName, streetNumber };

    } else {
      return false;
    }

  }
  done() {
    separateBizs(this.separatedBizs);
    this.reporter.finalize();
    fs.writeFileSync('./data/allParsedData.json', JSON.stringify(this.allBizs))
  }

  exec() {
    this.getRawDataArr();
    this.parseBizs();
    this.done();
  }

  ifFalsey(str, space = false) {
    // console.log(15, str)
    if (str != undefined && space) {
      return " " + str
    }

    if (str != undefined) {
      return str;
    }

    return "";

  }
  defBiz() {
    return new DefaultBiz;
  }
}

module.exports = Parser;