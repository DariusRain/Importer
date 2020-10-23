const fs = require("fs");

class Reporter {
    total = 0;
    addresses = 0;
    phone = 0;
    email = 0;
    photos = 0;
    website = 0;
    about = 0;
    categories = 0;
    unparsable = 0;

    increment(key) {
        this[key] += 1;
    }

    write(biz) {
        Object.keys(biz).forEach(key => {
            switch (key) {
                case "photos":
                case "categories":
                    this.increment(biz[key].length);
                    break;
                case "state":
                case "phone":
                case "about":
                case "email":
                    biz[key] != '' && (this.increment(key));
                    break;
            }
        })
    }

    finalize() {
        fs.writeFileSync("./data/report.json", JSON.stringify(this));
    }
}

module.exports = Reporter;