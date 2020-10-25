const Compiler = require("./modules/Compiler"),
    Importer = require("./modules/Importer"),
    Parser = require("./modules/Parser"),
    bizDefaults = require("./modules/Biz"),
    {compilePath} = require("./static/paths");

const compiler = new Compiler(compilePath),
    importer = new Importer(),
    parser = new Parser();


// compile()

    parser.exec();

// import()


