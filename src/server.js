"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oasis = void 0;
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var Oasis;
(function (Oasis) {
    let port = process.env.PORT == undefined ? 5001 : process.env.PORT;
    let databaseURL = "mongodb+srv://Admin:OasisServer@cluster0.ayk2n.mongodb.net/Oasis?retryWrites=true&w=majority";
    let mongoClient = new Mongo.MongoClient(databaseURL);
    startServer(port);
    connectToDatabase(databaseURL);
    function startServer(_port) {
        let server = Http.createServer();
        server.listen(port);
        server.addListener("request", handleRequest);
        console.log("listening on :" + port);
    }
    async function connectToDatabase(_url) {
        await mongoClient.connect();
        console.log("Database connection is established");
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url) {
            console.log(_request.url);
            let url = Url.parse(_request.url, true);
            let newCommand = url.query["ghost"] ? url.query["ghost"].toString() : "";
            let mongo = mongoClient.db("Oasis").collection("Commands");
            if (newCommand == "getCommand") {
                _response.write("Command is: " + await mongo.find({ "ghost": { $exists: true } }));
            }
            else {
                let filter = { _id: "625025edc8b13bb0fd87915f" };
                let update = { ghost: newCommand.toString() + "Hello" };
                await mongo.updateOne(filter, { $set: update });
                _response.write("Command received: " + newCommand);
            }
        }
        _response.end();
    }
})(Oasis = exports.Oasis || (exports.Oasis = {}));
//# sourceMappingURL=server.js.map