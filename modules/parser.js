
const Reporter = require(".//Reporter");
const fs = require("fs"),
  { parseData } = require("../utils/parsers"),
  { separateBizs } = require("../utils/bizHandlers");

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

      const bizParsedData = parseData(JSON.parse(biz));

      if (!bizParsedData) {
        this.separatedBizs.push(JSON.parse(biz));
        this.reporter.increment("unparsable");
        return;
      }

      this.reporter.write(bizParsedData);

      const { name, phone, streetName, city, state, zipcode, about, email, website, type, categories, photos } = bizParsedData;
    
      this.allBizs.push({
        ...defaultBiz,
        business_type: type,
        category: categories,
        name: name,
        owner_email: email,
        owner_phone: phone,
        business_web: website,
        street_name: streetName,
        city: city,
        state: state,
        zipcode: zipcode,
        about: about,
        photos: photos,
      });
    
    })

  };

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


}

module.exports = Parser;