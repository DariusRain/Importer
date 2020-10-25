class Biz {
    constructor() {
    this.validationCode = 'DARIUS20';
    this.poster_email = '';
    this.owner_ethn = "Black (African Decent)";
    this.business_type = 'Other';
    this.street_name = ' ';
    this.street_num = ' ';
    this.about = "";
    this.zipcode = ' ';
    this.open_hour = 8;
    this.close_hour = 17;
    this.registered = false;
    this.listed = true;
    this.isImport = true;
    this.emailValidated = true;
    this.approved = {
        active: true,
        userId: null,
        teamId: null,
        timeStamp: new Date(2020, 2, 2)
    };
    this.photos = []        
    }
 

}


module.exports = Biz;