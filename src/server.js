"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oasis = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var Oasis;
(function (Oasis) {
    let port = process.env.PORT;
    let databaseURL = "mongodb+srv://Admin:OasisServer@cluster0.ayk2n.mongodb.net/Oasis?retryWrites=true&w=majority";
    let mongoClient = new Mongo.MongoClient(databaseURL);
    startServer(port);
    connectToDatabase(databaseURL);
    function startServer(_port) {
        if (port == undefined)
            port = 5001;
        let server = Http.createServer();
        server.listen(port);
        console.log("listening on :" + port);
        server.addListener("request", handleRequest);
    }
    async function connectToDatabase(_url) {
        await mongoClient.connect();
        console.log("Database connection is established");
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        console.log("Here");
        if (_request.url) {
            console.log(_request.url);
            let url = Url.parse(_request.url, true);
            let newCommand = url.query["ghost"]?.toString();
            if (newCommand == undefined)
                newCommand = "";
            let mongo = mongoClient.db("Oasis").collection("Commands");
            if (newCommand == "getCommand") {
                _response.write("Command is: " + await mongo.find({ "ghost": { $exists: true } }));
            }
            else {
                await mongo.updateOne({ "_id": "625025edc8b13bb0fd87915f" }, { $set: { "ghost": "HalloWorld" + newCommand } }, { upsert: true });
                _response.write("Command received: " + newCommand);
            }
        }
        _response.end();
    }
})(Oasis = exports.Oasis || (exports.Oasis = {}));
//# sourceMappingURL=server.js.map