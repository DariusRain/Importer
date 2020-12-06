const Compiler = require("./modules/Compiler"),
    Importer = require("./modules/Importer"),
    Parser = require("./modules/Parser"),
    // defaultBiz = require("./static/defaultBiz"),
    { compilePath, parsedDataPath } = require("./static/paths"),
    { prettifyJsonFile } = require("./utils/prettify");

const compiler = new Compiler(compilePath),
    importer = new Importer();
// parser = new Parser(defaultBiz);


// compiler.compile()

// parser.exec();
prettifyJsonFile(parsedDataPath)
// import()


