
const fs = require("fs"),
  { parseData } = require("./utils/parsers"),
  {separateBizs} = require("./utils/bizHandlers"),
  approvedDate = new Date(2020, 2, 2),
  validationCode = 'DARIUS20',
  dataPath = './allBizsRaw.json',
  report = {
    total: 0,
    adresses: 0,
    phone: 0,
    email: 0,
    photos: 0,
    website: 0,
    about: 0,
    categories: 0,
    unparsable: 0,
  },
  defaultBiz = {
    validationCode: validationCode,
    poster_email: '',
    owner_ethn: "Black (African Decent)",
    business_type: 'Other',
    street_name: ' ',
    street_num: ' ',
    zipcode: ' ',
    open_hour: 8,
    close_hour: 17,
    registered: false,
    listed: true,
    isImport: true,
    emailValidated: true,
    approved: {
      active: true,
      userId: null,
      teamId: null,
      timeStamp: approvedDate,
    },
  };
  
  let separatedBizs = [];
  function parseBiz() {
    
    
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    
    const dataArr = JSON.parse(rawData)
    
    // console.log(dataArr.length);
    const allBizs = [];
  
  let cx = 0;
  dataArr.forEach((biz) => {
    
    const bizParsedData = parseData(JSON.parse(biz));
    
    if (!bizParsedData) {
      separatedBizs.push(JSON.parse(biz));
      report.unparsable += 1;
      return;
    }

    writeReport(bizParsedData);
    
    const { name, phone, streetName, city, state, zipcode, about, email, website, type, categories, photos } = bizParsedData;
    console.log(bizParsedData)
    allBizs.push({
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
  
  separateBizs(separatedBizs);
  finalizeReport();
  fs.writeFileSync('allParsedData.json', JSON.stringify(allBizs))

};
function writeReport(biz) {
  Object.keys(biz).forEach(key => {
    switch(key) {
      case "state":
        biz[key] != '' && (report["addresses"] += 1);
        break;
      case "photos":
      case "categories":
        report[key] += biz[key].length;
        break;
      case "phone":
      case "about":
      case "email":
        biz[key] != '' && (report[key] += 1);
        break;
    }
  })
}

function finalizeReport() {
  fs.writeFileSync("report.json", JSON.stringify(report));
}

parseBiz()


