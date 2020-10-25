const fs = require("fs");

class Reporter {

    constructor() {
        this.total = 0;
        this.addresses = 0;
        this.phone = 0;
        this.email = 0;
        this.photos = 0;
        this.website = 0;
        this.about = 0;
        this.categories = 0;
        this.unparsable = 0;
        this.parsed = 0;
    
    }

    increment(key) {
        this[key] += 1;
    }

    write(biz) {
        // console.log(biz);
        Object.keys(biz).forEach(key => {
            switch (key) {
                case "photos":
                case "categories":
                    biz[key].length > 0 && (this[key] += biz[key].length);
                    break;
                case "state":
                case "phone":
                case "about":
                case "email":
                    biz[key] != '' && this.increment(key);
                    break;
            }
        })
    }

    finalize() {
        fs.writeFileSync("./data/report.json", JSON.stringify(this));
    }

    // self() {
    //     return {
    //         total: this.total,
    //         addresses: this.addresses,
    //         this.phone,
    //         this.email,
    //         this.photos,
    //         this.website,
    //         this.about,
    //         this.categories,
    //         this.unparsable,
    //     }
    // }
}

module.exports = Reporter;