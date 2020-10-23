const Compiler = require("./modules/Compiler"),
    Importer = require("./modules/Importer"),
    Parser = require("./modules/Parser"),
    bizDefaults = require("./static/bizDefaults"),
    {compilePath} = require("./static/paths");

const compiler = new Compiler(compilePath),
    importer = new Importer(),
    parser = new Parser(bizDefaults);


// compile()

    parser.exec();

// import()


